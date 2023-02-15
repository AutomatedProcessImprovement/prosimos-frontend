import { PriorityRule } from "../formData"

/**
* Collect all unique case attributes referenced in the prioritisation rules
*
* @param {PriorityRule[]} rules - array of all defined prioritisation rules
* @returns {Set<string>} Set of unique case attributes
*/
export const collectUniqueAtrrs = (rules: PriorityRule[]): Set<string> => {
    const collectedAttr: Set<string> = new Set()

    if (rules === undefined || rules.length === 0) {
        return collectedAttr
    }

    for (let rule of rules) {
        for (let orRules of rule["rules"]) {
            for (let andRule of orRules) {
                collectedAttr.add(andRule.attribute)
            }
        }
    }

    return collectedAttr
}
