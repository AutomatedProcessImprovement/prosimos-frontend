import { Grid, Typography } from "@mui/material";
import { UseFormReturn, FieldArrayWithId, Controller, Path } from "react-hook-form";
import { JsonData } from "../formData";
import BatchingTypeSelect from "./BatchingTypeSelect";
import DistributionMappingWithAdd from "./DistributionMappingWithAdd";
import { QueryBuilder } from "./QueryBuilder";

interface TaskBatchingProps {
    formState: UseFormReturn<JsonData, object>
    taskIndex: number
    field: FieldArrayWithId<JsonData, "batch_processing", "key">
}

/**
 * Component for rendering all task's details in regards to batching
 */
const TaskBatching = (props: TaskBatchingProps) => {
    const {formState: { control: formControl }, taskIndex, field} = props

    return (
        <Grid container item xs={12}>
            <Grid container item xs={12}>
                <Typography> {field.task_id} </Typography>
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
                    <Grid item xs={6}>
                        <Typography variant="h6" align="left"> Size Distribution </Typography>
                        <DistributionMappingWithAdd
                            formState={props.formState}
                            taskIndex={taskIndex}
                            objectFieldNamePart={`batch_processing.${taskIndex}.size_distrib`}
                            valueLabel="Probability"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" align="left"> Duration Distribution </Typography>
                        <DistributionMappingWithAdd
                            formState={props.formState}
                            taskIndex={taskIndex}
                            objectFieldNamePart={`batch_processing.${taskIndex}.duration_distrib`}
                            valueLabel="Scale Factor"
                        />
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
