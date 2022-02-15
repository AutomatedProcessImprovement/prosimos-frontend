import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { ControllerRenderProps } from "react-hook-form";
import { JsonData } from "../formData";

interface WeekdaySelectProps {
    field: ControllerRenderProps<JsonData, any>,
    label?: string
}

const WeekdaySelect = (props: WeekdaySelectProps) => {
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}

export default WeekdaySelect;