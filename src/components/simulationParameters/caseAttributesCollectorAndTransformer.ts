import { PrioritisationBuilderSchema } from "../batching/schemas"
import { CaseAttributeDefinition } from "../formData"

/**
* Collect all case attributes user has defined
* 
* Transform them to the object parseable for dropdown
* 
* This means we add 'type' field to each case attributes 
* which later tells us eligible list of operations for the case attribute
*
* @param {CaseAttributeDefinition[]} caseAttrsFromJson - array of all case attributes defined in a simulation scenario
* @returns {Object} Dictionary (query builder schema) with case attributes name together with the QueryBuilder type
*/
export const collectAndSetAllCaseAttr = (caseAttrsFromJson: CaseAttributeDefinition[]) => {
    return caseAttrsFromJson?.reduce(transformCaseAttrArrToQueryBuilderSchema, {}) ?? {}
}

const transformCaseAttrArrToQueryBuilderSchema = (accObj: PrioritisationBuilderSchema, { name: currentAttrName, type }: CaseAttributeDefinition) => {
    const currVal = {
        [currentAttrName]: {
            label: currentAttrName,
            type: (type === "discrete") ? "priority_discrete" : "priority_continuous"
        }
    } as PrioritisationBuilderSchema

    return {
        ...accObj,
        ...currVal
    }
}
