import { Grid, Typography } from "@mui/material";
import { UseFormReturn, Controller } from "react-hook-form";
import { JsonData } from "../formData";
import BatchingTypeSelect from "./BatchingTypeSelect";
import DistributionSection from "./DistributionSection";
import { QueryBuilder } from "./QueryBuilder";

interface TaskBatchingProps {
    formState: UseFormReturn<JsonData, object>
    taskIndex: number
}

/**
 * Component for rendering all task's details in regards to batching
 */
const TaskBatching = (props: TaskBatchingProps) => {
    const {formState: { control: formControl }, taskIndex} = props

    return (
        <Grid container item xs={12}>
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <Controller
                        name={`batch_processing.${taskIndex}.type`}
                        control={formControl}
                        render={({ field }) => (
                            <BatchingTypeSelect
                                field={field}
                                label={"Batching Type"}
                                // TODO: errors
                                // fieldError={currErrors?.from}
                            />
                        )}
                    />
                </Grid>
                <Grid container item xs={12} sx={{ mt: 2 }}>
                    <DistributionSection
                        formState={props.formState}
                        taskIndex={taskIndex}
                        objectFieldNamePart={`batch_processing.${taskIndex}.size_distrib`}
                        valueLabel="Probability"
                    />
                    <Grid item xs={6}>
                        <Typography variant="h6" align="left"> Duration Distribution </Typography>

                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" align="left"> Firing Rules </Typography>
                    <QueryBuilder
                        formState={props.formState}
                        taskIndex={taskIndex}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default TaskBatching;
