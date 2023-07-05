import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { DAYS_OF_WEEK } from '../../helpers/timeConversions';

interface WeekdayFilterProps {
  label?: string;
  value: string[];
  onChange: any;
}

const WeekdayFilterCheckbox = (props: WeekdayFilterProps) => {

  const formatDay = (day:string) => {
    return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  };

  const renderSelectedValue = (selected:any) => {
    return Array.isArray(selected) ? 
      selected
        .sort((a, b) => DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b))
        .map((day) => formatDay(day))
        .join(', ') 
      : selected
  }

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel>{props.label || "Select at least one weekday"}</InputLabel>
      <Select
        multiple
        value={props.value}
        onChange={props.onChange}
        renderValue={renderSelectedValue}
      >
        {DAYS_OF_WEEK.map((day) => (
          <MenuItem key={day} value={day}>
            <Checkbox checked={props.value.indexOf(day) > -1} />
            <ListItemText primary={formatDay(day)} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WeekdayFilterCheckbox;
