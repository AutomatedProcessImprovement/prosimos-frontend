import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { ControllerRenderProps, FieldError } from "react-hook-form";

interface WeekdaySelectProps<FieldValues>{
    field: ControllerRenderProps<FieldValues, any>,
    label?: string
    fieldError?: FieldError
}

const WeekdaySelect = <FieldValues,>(props: WeekdaySelectProps<FieldValues>) => {
    return (
        <TextField 
            sx={{ width: "100%" }}
            {...props.field}
            error={props.fieldError !== undefined}
            helperText={props.fieldError?.message}
            label={props.label}
            variant="standard"
            select
        >
            <MenuItem value="MONDAY">Monday</MenuItem>
            <MenuItem value="TUESDAY">Tuesday</MenuItem>
            <MenuItem value="WEDNESDAY">Wednesday</MenuItem>
            <MenuItem value="THURSDAY">Thursday</MenuItem>
            <MenuItem value="FRIDAY">Friday</MenuItem>
            <MenuItem value="SATURDAY">Saturday</MenuItem>
            <MenuItem value="SUNDAY">Sunday</MenuItem>
        </TextField>
    )
}

export default WeekdaySelect;