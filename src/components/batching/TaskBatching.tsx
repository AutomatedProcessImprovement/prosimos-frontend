import { Grid, Typography } from "@mui/material";
import { UseFormReturn, useFieldArray, FieldArrayWithId } from "react-hook-form";
import { JsonData } from "../formData";
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

    // const { fields, append, remove } = useFieldArray({
    //     keyName: 'key',
    //     control: formControl,
    //     name: `.${index}`
    // })
    console.log(field)
    return (
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <Typography> {field.task_id} </Typography>
                <QueryBuilder
                    formState={props.formState}
                    taskIndex={taskIndex}
                />
            </Grid>
        </Grid>
    )
}

export default TaskBatching;
