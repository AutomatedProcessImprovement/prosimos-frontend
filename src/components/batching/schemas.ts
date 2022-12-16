export const typeOperatorMap = {
    number: {
      $eq: {
        label: "Equals"
      },
      $ne: {
        label: "Does Not Equal"
      },
      $lt: {
        label: "< Less Than"
      },
      $lte: {
        label: "<= Less Than or Equal To"
      },
      $gte: {
        label: ">= Greater Than or Equal To"
      },
      $gt: {
        label: "> Greater Than"
      }
    },
    string: {
      $eq: {
        label: "Equals"
      },
      $in: {
        label: "Equals Any Of",
        multiple: true
      },
      $ne: {
        label: "Does Not Equal"
      },
      $nin: {
        label: "Does Not Equal Any Of",
        multiple: true
      }
    },
    date: {
      $eq: {
        label: "Equals"
      },
      $ne: {
        label: "Not Equal"
      },
      $lt: {
        label: "Is Before"
      },
      $lte: {
        label: "Is Before or On"
      },
      $gte: {
        label: "Is After or On"
      },
      $gt: {
        label: "Is After"
      }
    },
    boolean: {
      $eq: {
        label: "Is"
      },
      $ne: {
        label: "Is Not"
      }
    }
  };
  
  export type QueryBuilderSchema = {
    [key: string]: {
      label: string;
      type: "string" | "number" | "boolean" | "date";
    };
  };
  
  export const exampleSchema: QueryBuilderSchema = {
    "item.path": {
      label: "Item Path",
      type: "string"
    },
    weight: {
      label: "Weight",
      type: "number"
    },
    cost: {
      label: "Cost",
      type: "number"
    },
    updatedAt: {
      label: "Updated",
      type: "date"
    },
    createdAt: {
      label: "Created",
      type: "date"
    }
  };
  