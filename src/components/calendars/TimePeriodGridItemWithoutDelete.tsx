import { UseFormReturn } from "react-hook-form";
import TimePeriodGridItem from "./TimePeriodGridItem";

interface TimePeriodGridItemWithoutDeleteProps<FieldValues> {
    formState: UseFormReturn<FieldValues, object>
    objectFieldName: keyof FieldValues
}

const TimePeriodGridItemWithoutDelete = <FieldValues,>(props: TimePeriodGridItemWithoutDeleteProps<FieldValues>) => {
    const {formState, objectFieldName} = props
    return (
        <TimePeriodGridItem
            formState={formState}
            objectFieldName={objectFieldName}
            isWithDeleteButton={false}
        />
    )
}

export default TimePeriodGridItemWithoutDelete;