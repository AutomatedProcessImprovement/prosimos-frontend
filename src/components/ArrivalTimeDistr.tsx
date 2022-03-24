import { UseFormReturn } from "react-hook-form";
import { JsonData } from "./formData";
import TimeDistribution from "./distributions/TimeDistribution";
import { Card, Grid, Typography } from "@mui/material";
import TimePeriodGridItemWithoutDelete from "./calendars/TimePeriodGridItemWithoutDelete";

interface ArrivalTimeDistrProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

const ArrivalTimeDistr = (props: ArrivalTimeDistrProps) => {
    const { formState: { errors } } = props.formState    
    const currentErrors = errors?.arrival_time_distribution

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card elevation={5} sx={{ p: 2 }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Arrival Time Calendar
                            </Typography>
                            <TimePeriodGridItemWithoutDelete
                                formState={props.formState}
                                objectFieldName="arrival_time_calendar"
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