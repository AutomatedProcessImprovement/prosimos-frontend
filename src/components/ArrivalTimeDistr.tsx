import { UseFormReturn } from "react-hook-form";
import { JsonData } from "./formData";
import TimeDistribution from "./distributions/TimeDistribution";
import { Card, Grid, Typography } from "@mui/material";
import ArrivalTimePeriod from "./calendars/ArrivalTimePeriod";

interface ArrivalTimeDistrProps {
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    }
}

const ArrivalTimeDistr = (props: ArrivalTimeDistrProps) => {

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card elevation={5} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Calendar
                            </Typography>
                            <ArrivalTimePeriod
                                formState={props.formState}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" align="left">
                                Distribution Function
                            </Typography>
                            <TimeDistribution
                                formState={props.formState}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ArrivalTimeDistr;