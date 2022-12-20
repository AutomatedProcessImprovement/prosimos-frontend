export const typeOperatorMap = {
  size: {
    ">": {
      label: "Greater Than"
    },
    ">=": {
      label: "Greater Than or Equal To"
    },
    "==": {
      label: "Equals"
    },
    "<": {
      label: "Less Than"
    },
    "<=": {
      label: "Less Than or Equal To"
    }
  },
  waiting_time: {
    "<": {
      label: "Less Than"
    },
    "<=": {
      label: "Less Than or Equal To"
    },
    "==": {
      label: "Equals"
    },
    "between": {
      label: "Between",
      multiple: true
    }
  },
  hour: {
    "<": {
      label: "Less Than"
    },
    "<=": {
      label: "Less Than or Equal To"
    },
    "==": {
      label: "Equals"
    },
    ">": {
      label: "Greater Than"
    },
    ">=": {
      label: "Greater Than or Equal To"
    },
    "between": {
      label: "Between",
      multiple: true
    },
  },
  weekday: {
    "==": {
      label: "Equals"
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
