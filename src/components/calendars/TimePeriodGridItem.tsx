import { IconButton } from "@mui/material";
import { Grid } from "@mui/material";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import TimePickerController from "./TimePickerController";
import WeekdaySelect from "./WeekdaySelect";
import DeleteIcon from '@mui/icons-material/Delete';

interface TimePeriodGridItemProps<FieldValues> {
    formState: UseFormReturn<FieldValues, object>
    objectFieldName: keyof FieldValues
    isWithDeleteButton: boolean
    timePeriodIndex?: number
    onDelete?: (index: number) => void
}

const TimePeriodGridItem = <FieldValues,>(props: TimePeriodGridItemProps<FieldValues>) => {
    const { formState: { control: formControl }, objectFieldName, isWithDeleteButton, timePeriodIndex, onDelete } = props
    const itemSize = isWithDeleteButton ? 2.5 : 3
    return (
        <Grid container spacing={2}>
            <Grid item xs={itemSize}>
                <Controller
                    name={`${objectFieldName}.from` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="Begin Day"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={itemSize}>
                <Controller
                    name={`${objectFieldName}.to` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="End Day"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={itemSize}>
                <TimePickerController
                    name={`${objectFieldName}.beginTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="Begin Time"
                />
            </Grid>
            <Grid item xs={itemSize}>
                <TimePickerController
                    name={`${objectFieldName}.endTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="End Time"
                />
            </Grid>
            {isWithDeleteButton && <Grid item xs={2}>
                <IconButton
                    size="small"
                    onClick={() => (onDelete && timePeriodIndex) && onDelete(timePeriodIndex)}
                >
                    <DeleteIcon />
                </IconButton>
            </Grid>}
        </Grid>
    )
}

export default TimePeriodGridItem;