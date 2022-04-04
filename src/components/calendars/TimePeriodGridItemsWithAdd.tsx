import { Grid } from "@mui/material";
import { FieldArrayPath, FieldArrayWithId } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import AddButtonBase from "../toolbar/AddButtonBase";
import TimePeriodGridItem from "./TimePeriodGridItem";

interface TimePeriodGridItemsWithAddProps<FieldValues> {
    fields: FieldArrayWithId<FieldValues, FieldArrayPath<FieldValues>, "key">[]
    formState: UseFormReturn<FieldValues, object>
    objectFieldNamePart: keyof FieldValues
    onTimePeriodRemove: (index: number) => void
    onTimePeriodAdd: () => void
}

const TimePeriodGridItemsWithAdd = <FieldValues,>(props: TimePeriodGridItemsWithAddProps<FieldValues>) => {
    const { fields, objectFieldNamePart } = props

    return (
        <Grid item xs={12} container spacing={2}>
            {fields.map((item, index: number) => {
                // restrict from deleting only the last period item
                const isWithoutDeleteButton = (fields.length === 1 && index === 0 )

                return (
                    <Grid item xs={12}> 
                        <TimePeriodGridItem
                            key={item.key}
                            formState={props.formState}
                            objectFieldName={`${objectFieldNamePart}.${index}` as unknown as keyof FieldValues}
                            isWithDeleteButton={!isWithoutDeleteButton}
                            timePeriodIndex={index}
                            onDelete={props.onTimePeriodRemove}
                        />
                    </Grid>
                )
            })}
            <Grid item xs={12}>
                <AddButtonBase
                    labelName="Add a time period"
                    onClick={props.onTimePeriodAdd}
                />
            </Grid>
        </Grid>
    )
}

export default TimePeriodGridItemsWithAdd;