import { useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData } from "./formData";
import TimeDistribution from "./distributions/TimeDistribution";
import { Card, Grid, Typography } from "@mui/material";
import AddButtonBase from "./toolbar/AddButtonBase";
import { defaultWorkWeekTimePeriod } from "./simulationParameters/defaultValues";
import TimePeriodGridItem from "./calendars/TimePeriodGridItem";
import { MIN_LENGTH_REQUIRED_MSG } from "./validationMessages";

interface ArrivalTimeDistrProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

const ArrivalTimeDistr = (props: ArrivalTimeDistrProps) => {
    const { formState: { errors }, control: formControl } = props.formState    
    const currentErrors = errors?.arrival_time_distribution

    const { fields: arrivalCalendarFields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `arrival_time_calendar`
    })

    const onTimePeriodAdd = () => {
        append(defaultWorkWeekTimePeriod)
    }

    const onTimePeriodRemove = (index: number) => {
        console.log("remove")
        if (arrivalCalendarFields.length === 1) {
            props.setErrorMessage(MIN_LENGTH_REQUIRED_MSG("arrival time period"))
            return
        }

        remove(index)
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card elevation={5} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Arrival Time Calendar
                            </Typography>
                        </Grid>
                        <Grid item container xs={12} spacing={2}>
                            {arrivalCalendarFields.map((_item: any, index: number) => (
                                <Grid item>
                                    <TimePeriodGridItem
                                        formState={props.formState}
                                        objectFieldName={`arrival_time_calendar.${index}` as unknown as keyof JsonData}
                                        isWithDeleteButton={true}
                                        onDelete={onTimePeriodRemove}
                                        timePeriodIndex={index}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <AddButtonBase
                                labelName="Add a time period"
                                onClick={onTimePeriodAdd}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Arrival Time Distribution Function
                            </Typography>
                            <TimeDistribution
                                formState={props.formState}
                                objectNamePath="arrival_time_distribution"
                                errors={currentErrors}
                                setErrorMessage={props.setErrorMessage}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ArrivalTimeDistr;