import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, FormHelperText } from '@mui/material';
import { daysOfWeek } from '../../helpers/timeConversions';

interface WeekdayFilterProps {
  label?: string;
  value: string[];
  onChange: any;
}

const WeekdayFilterCheckbox = (props: WeekdayFilterProps) => {
  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel>{props.label || "Select at least one weekday"}</InputLabel>
      <Select
        multiple
        value={props.value}
        onChange={props.onChange}
        renderValue={(selected) => (
          Array.isArray(selected) ? 
            selected
              .sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b))
              .map((day) => day.charAt(0) + day.slice(1).toLowerCase())
              .join(', ') 
            : selected
        )}
      >
        {daysOfWeek.map((day) => (
          <MenuItem key={day} value={day}>
            <Checkbox checked={props.value.indexOf(day) > -1} />
            <ListItemText primary={day.charAt(0) + day.slice(1).toLowerCase()} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WeekdayFilterCheckbox;
