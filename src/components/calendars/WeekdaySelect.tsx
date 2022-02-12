import { Select, MenuItem } from "@mui/material";
import { ControllerRenderProps } from "react-hook-form";
import { AllResourceCalendars } from "../ResourceCalendars";

interface WeekdaySelectProps {
    field: ControllerRenderProps<AllResourceCalendars, any>,
    label: string
}

const WeekdaySelect = (props: WeekdaySelectProps) => {
    return (
        <Select
            {...props.field}
            label={props.label}
            variant="standard"
        >
            <MenuItem value="MONDAY">Monday</MenuItem>
            <MenuItem value="TUESDAY">Tuesday</MenuItem>
            <MenuItem value="WEDNESDAY">Wednesday</MenuItem>
            <MenuItem value="THURSDAY">Thursday</MenuItem>
            <MenuItem value="FRIDAY">Friday</MenuItem>
            <MenuItem value="SATURDAY">Saturday</MenuItem>
            <MenuItem value="SUNDAY">Sunday</MenuItem>
        </Select>
    )
}

export default WeekdaySelect;