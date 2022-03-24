export const REQUIRED_ERROR_MSG = "Cannot be empty"
export const SUMMATION_ONE_MSG = "Summation should be equal to 1"
export const RESOURCE_ALLOCATION_DUPLICATES = "Resources should be unique"
export const MIN_LENGTH_REQUIRED = (entity_name: string) => {
    return `At least one ${entity_name} should be defined`
}
