import moment from "moment"
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form"
import { LocalizationProvider, TimePicker } from "@mui/lab"
import AdapterMoment from "@mui/lab/AdapterMoment"
import { TableRow, TableCell, Typography, TextField, IconButton, Checkbox } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import WeekdaySelect from "./WeekdaySelect"
import { AllResourceCalendars } from "../ResourceCalendars"

interface TimePeriodItemProps {
    formState: UseFormReturn<AllResourceCalendars, object>
    index: number,
    isItemSelected: boolean
    handleClick: (name: string) => void
}

const defaultTimePeriod = {
    from: "MONDAY",
    to: "THURSDAY",
    beginTime: "09:00:00.000",
    endTime: "17:00:00.000"  
}

const TimePeriodItem = (props: TimePeriodItemProps) => {
    const { formState: { control: formControl, getValues }, index, isItemSelected, handleClick } = props

    const { fields: timePeriodsFields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `calendars.${index}.time_periods`
    })

    const currCalendar = getValues(`calendars.${index}`)

    const onTimePeriodAdd = () => {
        append(defaultTimePeriod)
    }

    const onTimePeriodDelete = (index: number) => {
        remove(index)
    }

    return <>
        {timePeriodsFields.map((timePeriod, tpIndex) => {
            const isOnlyOneRow = timePeriodsFields.length === 1
            const isLastRow = (timePeriodsFields.length-1) === tpIndex
            const isFirstRow = (tpIndex === 0) 

            return <TableRow 
                key={`timePeriod_${index}_${timePeriod.key}`}
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
            >
                <TableCell padding="checkbox">
                    {isFirstRow && <Checkbox
                        color="primary"
                        checked={props.isItemSelected}
                        onChange={() => handleClick(currCalendar.id)}
                    />}
                </TableCell>
                <TableCell width="20%">
                    {isFirstRow &&
                        <Typography align="center" variant="body2">
                            {currCalendar.id}
                        </Typography>
                    }
                </TableCell>
                <TableCell width="19%">
                    <Controller
                        name={`calendars.${index}.time_periods.${tpIndex}.from`}
                        control={formControl}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <WeekdaySelect
                                field={field}
                                label="Begin Day"
                            />
                        )}
                    />

                </TableCell>
                <TableCell width="19%">
                    <Controller
                        name={`calendars.${index}.time_periods.${tpIndex}.to`}
                        control={formControl}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <WeekdaySelect
                                field={field}
                                label="End Day"
                            />
                        )}
                    />
                </TableCell>
                <TableCell width="19%">
                    <Controller
                        name={`calendars.${index}.time_periods.${tpIndex}.beginTime`}
                        control={formControl}
                        rules={{ required: true }}
                        render={({ 
                            field: { onChange, value },
                         }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                    renderInput={(props) => <TextField {...props} variant="standard" />}
                                    views={['hours', 'minutes']}
                                    inputFormat={'HH:mm'}
                                    mask="__:__"
                                    value={moment(value, 'HH:mm:ss.SSS')}
                                    onChange={(newValue) => {
                                        const newValueString = moment(newValue).format('HH:mm:ss.SSS')
                                        onChange(newValueString)
                                    }}
                                />
                            </LocalizationProvider>
                        )}
                    />
                </TableCell>
                <TableCell width="19%">
                    <Controller
                        name={`calendars.${index}.time_periods.${tpIndex}.endTime`}
                        control={formControl}
                        rules={{ required: true }}
                        render={({ 
                            field: { onChange, value },
                         }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                    renderInput={(props) => <TextField {...props} variant="standard" />}
                                    views={['hours', 'minutes']}
                                    inputFormat={'HH:mm'}
                                    mask="__:__"
                                    value={moment(value, 'HH:mm:ss.SSS')}
                                    onChange={(newValue) => {
                                        const newValueString = moment(newValue).format('HH:mm:ss.SSS')
                                        onChange(newValueString)
                                    }}
                                />
                            </LocalizationProvider>
                        )}
                    />
                </TableCell>
                <TableCell width="4%">
                    {!isOnlyOneRow && <IconButton
                        size="small"
                        onClick={() => onTimePeriodDelete(tpIndex)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    }
                </TableCell>
                <TableCell width="4%">
                    {isLastRow && <IconButton
                        size="small"
                        onClick={onTimePeriodAdd}
                    >
                        <AddIcon />
                    </IconButton>
                    }
                </TableCell>
            </TableRow>
        })}
    </>
}

export default TimePeriodItem;
