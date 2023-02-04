import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";
import moment from "moment";
import { REQUIRED_ERROR_MSG, SHOULD_BE_NUMBER_MSG, UNIQUE_KEYS } from "./components/validationMessages";

const isStrArrUnique = (wordsArr: string[] | undefined): boolean => {
  // returns whether the provided array of string contains only unique words
  const origSize = wordsArr?.length

  if (!origSize || origSize === 0) {
    return true
  }

  const set = new Set(wordsArr)
  const uniqueSize = set.size

  return uniqueSize === origSize
}

yup.addMethod<yup.StringSchema>(yup.string, "timeFormat", function (errorMessage) {
  return this.test("test-time-format", errorMessage, function (value) {
    const { path, createError } = this;

    return (
      moment(value, "HH:mm:ss.SSSSSS", true).isValid() ||
      moment(value, "HH:mm:ss.SSS", true).isValid() ||
      moment(value, "HH:mm:ss", true).isValid() ||
      createError({ path, message: errorMessage })
    );
  });
});

yup.addMethod<yup.StringSchema>(yup.string, "integer", function () {
  return this.matches(/^\d+$/, "Only digits are allowed")
})

// quarantees that AND rule doesn't have duplicated attributes (e.g., two weekdays)
yup.addMethod(yup.array, "uniqueAttributes", function () {
  const message = "Fields should be unique"
  return this.test("unique", message, function (value) {
    const keysArr = value?.map(({ attribute }) => attribute ?? "")
    const { path, createError } = this;

    return (
      isStrArrUnique(keysArr) ||
      createError({ path, message })
    )
  });
});

// quarantees that we have only one setup per task
yup.addMethod(yup.array, "uniqueTaskBatching", function () {
  const message = "Only one batch setup per task is allowed"
  return this.test("unique", message, function (orRules) {
    const keysArr = orRules?.map(({ task_id }) => task_id ?? "")
    const { path, createError } = this;

    return (
      isStrArrUnique(keysArr) ||
      createError({ path, message })
    )
  });
});

// quarantees the uniqueness of keys per distribution map
yup.addMethod(yup.array, "uniqueKeyDistr", function () {
  const message = UNIQUE_KEYS
  return this.test("unique", message, function (distrArr) {
    const keysArr = distrArr?.map(({ key }) => key ?? "")
    const { path, createError } = this;

    return (
      isStrArrUnique(keysArr) ||
      createError({ path, message })
    )
  });
});

export const distributionValidation = {
  distribution_name: yup.string().required(REQUIRED_ERROR_MSG),
  distribution_params: yup.array()
      .of(
          yup.object().shape({
              value: yup.number().typeError(SHOULD_BE_NUMBER_MSG).required(REQUIRED_ERROR_MSG)
          })
      )
      .required()
      .min(2, "At least two required parameters should be provided")
}

declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
    > extends yup.BaseSchema<TType, TContext, TOut> {
    timeFormat(errorMessage: string): StringSchema<TType, TContext>;
    integer(): StringSchema<TType, TContext>;
  }

  interface ArraySchema<T> {
    uniqueAttributes(): ArraySchema<T>;
    uniqueTaskBatching(): ArraySchema<T>;
    uniqueKeyDistr(): ArraySchema<T>;
  }
}

export default yup;
