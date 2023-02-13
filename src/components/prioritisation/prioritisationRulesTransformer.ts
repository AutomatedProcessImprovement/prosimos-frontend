import { CaseBasedRule, JsonData, PriorityRule } from "../formData";

/**
 * Transforming the prioritisation rules
 * In case the value was not a range one, we change it to be a range
 * Equals rules stay the same
 * For between rules, we just change the operator name supported by 
 */
export const transformPrioritisationRules = (values: JsonData) => {
    const copiedValues = JSON.parse(JSON.stringify(values))
    const prioritisation_rules = copiedValues.prioritisation_rules // array per each priority level

    if (prioritisation_rules !== undefined) {
        prioritisation_rules.forEach((element: PriorityRule) => {
            _transformRulesToRangesIfAny(element.rule)
        })
    }

    return copiedValues
};

const _transformRulesToRangesIfAny = (orRules: CaseBasedRule[][]) => {
    let newValueArr: (number | string)[];

    for (let orRule of orRules) {
        for (let andRule of orRule) {
            if (andRule.comparison !== "=") {
                // no changes in case operator equals =
                switch (andRule.comparison) {
                    case "<=":
                        andRule.comparison = "in"
                        newValueArr = [0, andRule.value as number]
                        // newValueArr.push()
                        andRule.value = newValueArr
                        break
                    case ">=":
                        andRule.comparison = "in"
                        newValueArr = [andRule.value as number, "inf"]
                        // newValueArr.push()
                        andRule.value = newValueArr
                        break
                    case "in":
                        andRule.comparison = "in"
                        break
                    default:
                        console.log("Not a supported operator")
                }
            }
        }
    }
}

// const _groupByEligibleForBetweenAndNot = (result: [FiringRule[], FiringRule[], FiringRule[]], current: FiringRule): [FiringRule[], FiringRule[], FiringRule[]] => {
//     const [ready_res, large_res, others] = result
//     if (current.comparison === "between") {
//         if (current.attribute === "ready_wt") {
//             ready_res.push(current)
//         }
//         else if (current.attribute === "ready_wt") {
//             large_res.push(current)
//         }
//     } else {
//         others.push(current)
//     }

//     return [ready_res, large_res, others]
// }

// const _transformBetweenOperatorsPerTask = (curr_task_batch_rules: FiringRule[][]) => {
//     for (var or_rule_index in curr_task_batch_rules) {
//         const curr_and_rules = curr_task_batch_rules[or_rule_index]
//         const [ready_wt_rules, large_wt_rules, others] = curr_and_rules.reduce(_groupByEligibleForBetweenAndNot, [[], [], []] as [FiringRule[], FiringRule[], FiringRule[]])
//         let new_ready_rules: FiringRule[] | undefined = undefined
//         let new_large_rules: FiringRule[] | undefined = undefined
//         if (ready_wt_rules.length > 0) {
//             // expect one BETWEEN rule
//             const values = (ready_wt_rules[0]!.value as string[]).map(x => Number(x))

//             const min_value = Math.min(...values)
//             const max_value = Math.max(...values)
//             const attr = ready_wt_rules[0].attribute

//             new_ready_rules = [
//                 { attribute: attr, comparison: ">=", value: String(min_value) } as FiringRule,
//                 { attribute: attr, comparison: "<=", value: String(max_value) } as FiringRule
//             ]
//         }
//         else if (large_wt_rules.length > 0) {
//             // expect two AND rules here
//             const values = ready_wt_rules.map(x => Number(x.value))
//             const min_value = Math.min(...values)
//             const max_value = Math.max(...values)
//             const attr = ready_wt_rules[0].attribute

//             new_ready_rules = [
//                 { attribute: attr, comparison: ">=", value: String(min_value) } as FiringRule,
//                 { attribute: attr, comparison: "<=", value: String(max_value) } as FiringRule
//             ]
//         }

//         curr_task_batch_rules[or_rule_index] = [
//             ...others,
//             ...(new_ready_rules ? new_ready_rules : []),
//             ...(new_large_rules ? new_large_rules : [])
//         ]
//     }
// };