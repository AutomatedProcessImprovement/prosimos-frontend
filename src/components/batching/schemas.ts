const GREATER_THAN = "Greater Than"
const GREATER_THAN_OR_EQUALS = "Greater Than or Equal To"
const EQUALS = "Equals"
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
  }
};

export type QueryBuilderSchema = {
  [key: string]: {
    label: string;
    type: "size" | "waiting_time" | "hour" | "weekday"
  };
};

export const exampleSchema: QueryBuilderSchema = {
  size: {
    label: "Batch size",
    type: "size"
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
