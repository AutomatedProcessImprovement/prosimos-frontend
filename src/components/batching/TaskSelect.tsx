import { MenuItem, TextField } from "@mui/material";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import { AllModelTasks } from "../modelData";

interface BatchingTypeSelectProps<FieldValues>{
    field: ControllerRenderProps<FieldValues, any>,
    label?: string
    fieldError?: FieldError
    tasksFromModel: AllModelTasks
}

const BatchingTypeSelect = <FieldValues,>(props: BatchingTypeSelectProps<FieldValues>) => {
    const { tasksFromModel } = props

    return (
        <TextField 
            sx={{ width: "50%" }}
            {...props.field}
            error={props.fieldError !== undefined}
            helperText={props.fieldError?.message || ""}
            label={props.label}
            variant="standard"
            select
        >
            {Object.entries(tasksFromModel).map((field, index) => {
                const taskId = field[0]
                const taskDetails = field[1]
                return (
                    <MenuItem value={taskId}>
                        {taskDetails.name}
                    </MenuItem>
                )
            })}
        </TextField>
    )
}

export default BatchingTypeSelect;
