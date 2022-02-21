import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { ControllerRenderProps } from "react-hook-form";

interface WeekdaySelectProps<FieldValues>{
    field: ControllerRenderProps<FieldValues, any>,
    label?: string
}

const WeekdaySelect = <FieldValues,>(props: WeekdaySelectProps<FieldValues>) => {
    return (
        <TextField 
            sx={{ width: "100%" }}
            {...props.field}
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