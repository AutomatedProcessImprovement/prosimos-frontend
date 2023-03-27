const GREATER_THAN = "Greater Than"
const GREATER_THAN_OR_EQUALS = "Greater Than or Equal To"
export const EQUALS = "Equals"
const LESS_THAN = "Less Than"
const LESS_THAN_OR_EQUALS = "Less Than or Equal To"
const BETWEEN = "Between"

export const typeOperatorMap = {
  size: {
    ">": {
      label: GREATER_THAN
    },
    ">=": {
      label: GREATER_THAN_OR_EQUALS
    },
    "=": {
      label: EQUALS
    },
    "<": {
      label: LESS_THAN
    },
    "<=": {
      label: LESS_THAN_OR_EQUALS
    }
  },
  waiting_time: {
    "<": {
      label: LESS_THAN
    },
    "<=": {
      label: LESS_THAN_OR_EQUALS
    },
    "=": {
      label: EQUALS
    },
    "between": {
      label: BETWEEN,
      multiple: true
    }
  },
  hour: {
    "<": {
      label: LESS_THAN
    },
    "<=": {
      label: LESS_THAN_OR_EQUALS
    },
    "=": {
      label: EQUALS
    },
    ">": {
      label: GREATER_THAN
    },
    ">=": {
      label: GREATER_THAN_OR_EQUALS
    },
    "between": {
      label: BETWEEN,
      multiple: true
    },
  },
  weekday: {
    "=": {
      label: EQUALS
    }
  },
  priority_continuous: {
    "<=": {
      label: LESS_THAN_OR_EQUALS
    },
    "=": {
      label: EQUALS
    },
    ">=": {
      label: GREATER_THAN_OR_EQUALS
    },
    "in": {
      label: BETWEEN,
      multiple: true
    },
  },
  priority_discrete: {
    "=": {
      label: EQUALS
    },
  }
};

type QueryBuilderSchema<T> = {
  [key: string]: {
    label: string;
    type: T;
  };
};

const BATCH_SIZE_PROP_NAME = "size"

type BatchingRuleTypes = "size" | "waiting_time" | "hour" | "weekday" | "priority"
type BatchingBuilderSchema = QueryBuilderSchema<BatchingRuleTypes>

type PrioritisationRuleTypes = string // every string is eligible because case attributes' names are dynamic
export type PrioritisationBuilderSchema = QueryBuilderSchema<PrioritisationRuleTypes>

export type EligibleBuilderSchemas = BatchingBuilderSchema | PrioritisationBuilderSchema

export const batchingSchema: BatchingBuilderSchema = {
  size: {
    label: "Batch size",
    type: BATCH_SIZE_PROP_NAME
  },
  ready_wt: {
    label: "Ready waiting time",
    type: "waiting_time"
  },
  large_wt: {
    label: "Large waiting time",
    type: "waiting_time"
  },
  daily_hour: {
    label: "Daily hour",
    type: "hour"
  },
  week_day: {
    label: "Weekday",
    type: "weekday"
  }
};

export const getDefaultOption = (builderSchema: EligibleBuilderSchemas) => {
  const sizeProp = builderSchema["BATCH_SIZE_PROP_NAME"]
  if (sizeProp !== undefined) {
    return sizeProp
  }

  // else find a first case attribute in the array
  // and select it as a default one
  const caseAttrProp = Object.entries(builderSchema)[0][0]
  return caseAttrProp
}
