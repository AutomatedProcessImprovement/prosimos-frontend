import { Grid } from "@mui/material";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import TimePickerController from "./TimePickerController";
import WeekdaySelect from "./WeekdaySelect";


interface TimePeriodGridItemProps<FieldValues> {
    formState: UseFormReturn<FieldValues, object>
    objectFieldName: keyof FieldValues
}

const TimePeriodGridItem = <FieldValues,>(props: TimePeriodGridItemProps<FieldValues>) => {
    const { formState: { control: formControl }, objectFieldName } = props
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Controller
                    name={`${objectFieldName}.from` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="Begin Day"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <Controller
                    name={`${objectFieldName}.to` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="End Day"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={3}>
                <TimePickerController
                    name={`${objectFieldName}.beginTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="Begin Time"
                />
            </Grid>
            <Grid item xs={3}>
                <TimePickerController
                    name={`${objectFieldName}.endTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="End Time"
                />
            </Grid>
        </Grid>
    )
}

export default TimePeriodGridItem;