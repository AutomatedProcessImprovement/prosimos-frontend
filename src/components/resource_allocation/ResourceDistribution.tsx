import { Grid, Paper, TextField, Typography } from "@mui/material";
import { UseFormReturn, Controller } from "react-hook-form";
import TimeDistribution from "../distributions/TimeDistribution";
import { JsonData, ProbabilityDistributionForResource } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";

interface ResourceDistributionProps {
    formState: UseFormReturn<JsonData, object>
    resourceDistr: ProbabilityDistributionForResource
    allocationIndex: number
    resourceIndex: number
}

const ResourceDistribution = (props: ResourceDistributionProps) => {
    const { formState: { control: formControl }, allocationIndex, resourceIndex } = props

    return (
        <Paper elevation={5} sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name={`task_resource_distribution.${allocationIndex}.resources.${resourceIndex}.resource_id`}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="standard"
                                placeholder="Resource name"
                                label="Resource"
                                sx={{ width: "100%"}}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" align="left">
                        Duration
                    </Typography>
                    <TimeDistribution
                        formState={props.formState}
                        objectNamePath={`task_resource_distribution.${allocationIndex}.resources.${resourceIndex}`}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ResourceDistribution;
