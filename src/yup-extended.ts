import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";
import moment from "moment";

yup.addMethod<yup.StringSchema>(yup.string, "timeFormat", function (errorMessage) {
    return this.test(`test-time-format`, errorMessage, function (value) {
        const { path, createError } = this;

        return (
            moment(value, "HH:mm:ss.SSSSSS", true).isValid() ||
            moment(value, "HH:mm:ss.SSS", true).isValid() ||
            moment(value, "HH:mm:ss", true).isValid() ||
            createError({ path, message: errorMessage })
        );
    });
});

declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    timeFormat(errorMessage: string): StringSchema<TType, TContext>;
  }
}

export default yup;