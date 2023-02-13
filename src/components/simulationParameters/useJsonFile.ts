import { useEffect, useState } from "react";
import { CaseAttributeDefinition, CaseBasedRule, FiringRule, JsonData, PriorityRule } from "../formData";
import { EventsFromModel } from "../modelData";


const useJsonFile = (jsonFile: any, eventsFromModel?: EventsFromModel) => {
    const [missedElemNum, setMissedElemNum] = useState(0)   // shows num of elements that were present in the config
    const [allCaseAttr, setAllCaseAttr] = useState<string[]>([]) // all defined case attributes
    // but were absent in BPMN model
    const [jsonData, setJsonData] = useState<JsonData>()

    useEffect(() => {
        if (jsonFile !== null && jsonFile !== "" && eventsFromModel !== undefined) {
            const jsonFileReader = new FileReader();
            jsonFileReader.readAsText(jsonFile, "UTF-8")
            jsonFileReader.onload = e => {
                if (e.target?.result && typeof e.target?.result === 'string') {
                    const rawData = JSON.parse(e.target.result)

                    // verify events in the config
                    // remove those that do not exist in the BPMN model
                    const mergeResults = getMergeEventsList(eventsFromModel, rawData["event_distribution"])
                    const [missedNum, finalEvents] = mergeResults
                    rawData["event_distribution"] = finalEvents

                    parseAndUpdatePrioritisationRules(rawData)

                    updateRangesForBatchingRulesIfAny(rawData)
                    collectAndSetAllCaseAttr(rawData["case_attributes"])

                    setJsonData(rawData)
                    setMissedElemNum(missedNum)
                }
            }
        }
    }, [jsonFile, eventsFromModel]);


    const collectAndSetAllCaseAttr = (jsonCase: CaseAttributeDefinition[]) => {
        const allItems = jsonCase?.map(({ name }) => name) ?? []
        setAllCaseAttr(allItems)
    }

    return { jsonData, missedElemNum, allCaseAttr }
}

const parseAndUpdatePrioritisationRules = (rawData: any) => {
    const prioritisationRulesArr: [] = rawData["prioritisation_rules"]

    if (prioritisationRulesArr === undefined || prioritisationRulesArr.length === 0) {
        // nothing to do, array is empty
        return
    }
    const parsePrioritisationRules: PriorityRule[] = []

    for (let orRule of prioritisationRulesArr) {
        const parsedRule: CaseBasedRule[][] = []

        for (let andRule of (orRule as any)["rules"]) {
            const parsedAndRules: CaseBasedRule[] = []

            for (let simpleRule of andRule) {
                const condition: string = simpleRule["condition"]

                const [minValue, maxValue] = simpleRule["value"]
                if (condition === "in") {
                    // TODO: add validation when the infinite range is provided
                    if (minValue === 0) {
                        // no lower boundary, so we transform the rule to <=
                        parsedAndRules.push({
                            attribute: simpleRule["attribute"],
                            comparison: "<=",
                            value: maxValue
                        } as CaseBasedRule)
                    }
                    else if (maxValue === "inf") {
                        // no lower boundary, so we transform the rule to >=
                        parsedAndRules.push({
                            attribute: simpleRule["attribute"],
                            comparison: ">=",
                            value: minValue
                        } as CaseBasedRule)
                    }
                    else {
                        // both boundaries exist, so it is a range
                        parsedAndRules.push({
                            attribute: simpleRule["attribute"],
                            comparison: simpleRule["condition"],
                            value: simpleRule["value"]
                        } as CaseBasedRule)
                    }
                }
                else {
                    parsedAndRules.push({
                        attribute: simpleRule["attribute"],
                        comparison: simpleRule["condition"],
                        value: simpleRule["value"]
                    } as CaseBasedRule)
                }
            }

            parsedRule.push(parsedAndRules)
        }

        parsePrioritisationRules.push({
            priority_level: orRule["priority_level"],
            rule: parsedRule
        })
    }

    rawData["prioritisation_rules"] = parsePrioritisationRules
}

/**
 * Merge events from BPMN with the configuration provided in .json file.
 * BPMN overrides the .json.
 * If event exists in BPMN but not in json      - we add it with empty distribution.
 * If an event exists in json but not in BPMN   - we ignore it and show the warning.
 */
const getMergeEventsList = (eventsFromModel: EventsFromModel, eventsConfig: any) => {
    const eventsArr = eventsFromModel.getAllKeys()
    if (eventsArr.length === 0) {
        // no events in the BPMN model
        const events_config_num = eventsConfig ? eventsConfig.length : 0
        return [events_config_num, []] as const
    }

    const allModelEvents: string[] = []
    const finalEvents = eventsArr.map((eventId: string) => {
        allModelEvents.push(eventId)
        const sameEventFromConfig = eventsConfig.find((config: { event_id: string; }) => config.event_id === eventId)
        if (sameEventFromConfig === undefined) {
            return {
                event_id: eventId
            }
        }

        return { ...sameEventFromConfig }
    })

    const difference: string[] = eventsConfig.filter((e: any) => !allModelEvents.includes(e.event_id));
    const missedNum = difference.length

    return [missedNum, finalEvents] as const
};

const updateRangesForBatchingRulesIfAny = (rawData: JsonData) => {
    const batching_info = rawData.batch_processing // array per task
    for (var task_batch_info_index in batching_info) {
        const curr_task_batch_rules = batching_info[task_batch_info_index].firing_rules
        _transform_between_operators(curr_task_batch_rules)
    }
};

export const _groupByEligibleForBetweenAndNot = (result: [FiringRule[], FiringRule[], FiringRule[]], current: FiringRule): [FiringRule[], FiringRule[], FiringRule[]] => {
    const [ready_res, large_res, others] = result
    if (current.attribute === "ready_wt") {
        ready_res.push(current)
    }
    else if (current.attribute === "ready_wt") {
        large_res.push(current)
    }
    else {
        others.push(current)
    }

    return [ready_res, large_res, others]
}

const _transform_between_operators = (firing_rules: FiringRule[][]) => {
    for (var or_rule_index in firing_rules) {
        const curr_and_rules = firing_rules[or_rule_index]
        const [ready_wt_rules, large_wt_rules, others] = curr_and_rules.reduce(_groupByEligibleForBetweenAndNot, [[], [], []] as [FiringRule[], FiringRule[], FiringRule[]])

        let ready_wt_new_rule = undefined
        let large_wt_new_rule = undefined
        if (ready_wt_rules.length >= 2) {
            const result = _get_min_and_max_rules(ready_wt_rules)
            if (result === undefined) {
                console.log(`Invalid setup for ready_wt rules ${ready_wt_rules}`)
            }

            ready_wt_new_rule = [{
                attribute: "ready_wt",
                comparison: "between",
                value: result!
            }]
        }

        if (large_wt_rules.length >= 2) {
            const result = _get_min_and_max_rules(ready_wt_rules)
            if (result === undefined) {
                console.log(`Invalid setup for ready_wt rules ${ready_wt_rules}`)
            }

            large_wt_new_rule = [{
                attribute: "large_wt",
                comparison: "between",
                value: result!
            }]
        }

        const new_and_rule = [
            ...others,
            ...(ready_wt_new_rule ? ready_wt_new_rule : []),
            ...(large_wt_new_rule ? large_wt_new_rule : [])
        ]

        // assign a new set of rules as the final one
        firing_rules[or_rule_index] = new_and_rule
    }

    return true
}

const _get_min_and_max_rules = (rules: FiringRule[]): [string, string] | undefined => {
    const minValue = rules.find((v: FiringRule) => _is_equal_any(v.comparison, ['>', '>=']))?.value
    const maxValue = rules.find((v: FiringRule) => _is_equal_any(v.comparison, ['<', '<=']))?.value

    if (minValue === undefined || maxValue === undefined)
        return undefined

    return [minValue as string, maxValue as string]
}

const _is_equal_any = (value: string, possible_options: string[]) => {
    for (const option_index in possible_options) {
        const curr_res = value === possible_options[option_index]

        if (curr_res) {
            return curr_res
        }
    }

    return false
}

export default useJsonFile;
