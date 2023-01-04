import { MenuItem, TextField } from "@mui/material";
import { ControllerRenderProps, FieldError } from "react-hook-form";
import { AllModelTasks } from "../modelData";

interface BatchingTypeSelectProps<FieldValues>{
    field: ControllerRenderProps<FieldValues, any>,
    label?: string
    fieldError?: FieldError
    tasksFromModel: AllModelTasks
}

const TaskSelect = <FieldValues,>(props: BatchingTypeSelectProps<FieldValues>) => {
    const { tasksFromModel } = props

    return (
        <TextField 
            sx={{ width: "75%" }}
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
                    <MenuItem key={`task-option-${taskId}`}value={taskId}>
                        {taskDetails.name}
                    </MenuItem>
                )
            })}
        </TextField>
    )
}

export default TaskSelect;
