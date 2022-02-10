import { LocalizationProvider, TimePicker } from "@mui/lab";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem, Select, Typography, IconButton, Link } from "@mui/material";
import { ResourceCalendar } from "./ArrivalParameters";
import AdapterMoment from '@mui/lab/AdapterMoment';
import AddIcon from '@mui/icons-material/Add';
import moment from "moment";

interface CalendarItemProps {
    items: ResourceCalendar[]
}

const CalendarItem = (props: CalendarItemProps) => {
    const { items } = props

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Begin Day</TableCell>
                    <TableCell>End Day</TableCell>
                    <TableCell>Begin Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    items.map((calendar) => (
                        calendar.time_periods.map((timePeriod, index) => {
                            const isLastRow = (calendar.time_periods.length-1) === index
                            const isFirstRow = (index === 0) 
                            return <TableRow>
                                <TableCell width="20%">
                                    {isFirstRow &&
                                        <Typography align="center" variant="body2">
                                            {calendar.id}
                                        </Typography>
                                    }
                                </TableCell>
                                <TableCell width="19%">
                                    <Select
                                        value={timePeriod.from}
                                        label="Begin Day"
                                        variant="standard"
                                        // onChange={handleChange}
                                    >
                                        <MenuItem value="MONDAY">Monday</MenuItem>
                                        <MenuItem value="TUESDAY">Tuesday</MenuItem>
                                        <MenuItem value="WEDNESDAY">Wednesday</MenuItem>
                                        <MenuItem value="THURSDAY">Thursday</MenuItem>
                                        <MenuItem value="FRIDAY">Friday</MenuItem>
                                        <MenuItem value="SATURDAY">Saturday</MenuItem>
                                        <MenuItem value="Sunday">Sunday</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell width="19%">
                                    <Select
                                        value={timePeriod.to}
                                        label="End Day"
                                        variant="standard"
                                        // onChange={handleChange}
                                    >
                                        <MenuItem value="MONDAY">Monday</MenuItem>
                                        <MenuItem value="TUESDAY">Tuesday</MenuItem>
                                        <MenuItem value="WEDNESDAY">Wednesday</MenuItem>
                                        <MenuItem value="THURSDAY">Thursday</MenuItem>
                                        <MenuItem value="FRIDAY">Friday</MenuItem>
                                        <MenuItem value="SATURDAY">Saturday</MenuItem>
                                        <MenuItem value="Sunday">Sunday</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell width="19%">
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <TimePicker
                                            renderInput={(props) => <TextField {...props} variant="standard" />}
                                            views={['hours', 'minutes']}
                                            inputFormat={'HH:mm'}
                                            mask="__:__"
                                            value={moment(timePeriod.beginTime, 'HH:mm:ss')}
                                            onChange={(newValue) => {
                                                //setValue(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </TableCell>
                                <TableCell width="19%">
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <TimePicker
                                            renderInput={(props) => <TextField {...props} variant="standard" />}
                                            views={['hours', 'minutes']}
                                            inputFormat={'HH:mm'}
                                            mask="__:__"
                                            value={moment(timePeriod.endTime, 'HH:mm:ss')}
                                            onChange={(newValue) => {
                                                //setValue(newValue);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </TableCell>
                                <TableCell width="4%">
                                    {isLastRow && <IconButton
                                        size="small"
                                        // onClick={() => onResourceProfileDelete(index)}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    }
                                </TableCell>
                            </TableRow>
                        })
                    ))
                }
            </TableBody>
        </Table>
    );
}

export default CalendarItem;