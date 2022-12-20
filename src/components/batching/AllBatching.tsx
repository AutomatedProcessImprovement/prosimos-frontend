import { Grid } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData } from "../formData";
import { AllModelTasks } from "../modelData";
import TaskBatching from "./TaskBatching";

export const BATCH_PROCESSING = "batch_processing"
interface AllBatchingProps {
    tasksFromModel: AllModelTasks
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

const AllBatching = (props: AllBatchingProps) => {
    const {tasksFromModel, formState: { control: formControl }, setErrorMessage} = props

    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `${BATCH_PROCESSING}`
    })

    return <Grid container>
        {fields.map((field, index) => {
            return <TaskBatching
                key={field.key}
                formState={props.formState}
                taskIndex={index}
                field={field}
            />
        })} 
    </Grid>
}

export default AllBatching;