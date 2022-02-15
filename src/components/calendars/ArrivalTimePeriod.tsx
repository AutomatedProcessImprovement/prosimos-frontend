import { Grid } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { JsonData } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import TimePickerController from "./TimePickerController";
import WeekdaySelect from "./WeekdaySelect";

interface ArrivalTimePeriodProps {
    formState: UseFormReturn<JsonData, object>
}

const ArrivalTimePeriod = (props: ArrivalTimePeriodProps) => {
    const { control: formControl } = props.formState
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Controller
                    name={`arrival_time_calendar.from`}
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
                    name={`arrival_time_calendar.to`}
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
                    name={"arrival_time_calendar.beginTime" as keyof JsonData}
                    formState={props.formState}
                    label="Begin Time"
                />
            </Grid>
            <Grid item xs={3}>
                <TimePickerController
                    name={"arrival_time_calendar.endTime" as keyof JsonData}
                    formState={props.formState}
                    label="End Time"
                />
            </Grid>
        </Grid>
    )
}

export default ArrivalTimePeriod;