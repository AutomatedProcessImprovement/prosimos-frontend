import { Controller, useFieldArray, UseFormReturn } from "react-hook-form"
import { TableRow, TableCell, IconButton, Checkbox, TextField } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import WeekdaySelect from "./WeekdaySelect"
import TimePickerController from "./TimePickerController"
import { JsonData } from "../formData"

interface TimePeriodTableRowsProps {
    formState: UseFormReturn<JsonData, object>
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

const TimePeriodTableRows = (props: TimePeriodTableRowsProps) => {
    const { formState: { control: formControl, getValues, formState: { errors } }, index, isItemSelected, handleClick } = props

    const { fields: timePeriodsFields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_calendars.${index}.time_periods`
    })

    const currCalendar = getValues(`resource_calendars.${index}`)
    const calErrors = errors.resource_calendars?.[index]

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
            const currErrors = calErrors?.time_periods?.[tpIndex]

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
                        <Controller
                            name={`resource_calendars.${index}.name`}
                            control={formControl}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    error={calErrors?.name !== undefined}
                                    helperText={calErrors?.name?.message || ""}
                                    variant="standard"
                                    placeholder="Resource Name"
                                />
                            )}
                        />
                    }
                </TableCell>
                <TableCell width="19%">
                    <Controller
                        name={`resource_calendars.${index}.time_periods.${tpIndex}.from`}
                        control={formControl}
                        render={({ field }) => (
                            <WeekdaySelect
                                field={field}
                                fieldError={currErrors?.from}
                            />
                        )}
                    />
                </TableCell>
                <TableCell width="19%">
                    <Controller
                        name={`resource_calendars.${index}.time_periods.${tpIndex}.to`}
                        control={formControl}
                        render={({ field }) => (
                            <WeekdaySelect
                                field={field}
                                fieldError={currErrors?.to}
                            />
                        )}
                    />
                </TableCell>
                <TableCell width="19%">
                    <TimePickerController
                        name={`resource_calendars.${index}.time_periods.${tpIndex}.beginTime` as unknown as keyof JsonData}
                        formState={props.formState}
                        fieldError={currErrors?.beginTime}
                    />
                </TableCell>
                <TableCell width="19%">
                    <TimePickerController
                        name={`resource_calendars.${index}.time_periods.${tpIndex}.endTime` as unknown as keyof JsonData}
                        formState={props.formState}
                        fieldError={currErrors?.endTime}
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

export default TimePeriodTableRows;
