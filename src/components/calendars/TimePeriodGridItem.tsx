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
    timePeriodIndex?: number
    isWithDeleteButton: boolean
    onDelete?: (index: number) => void
}

const TimePeriodGridItem = <FieldValues,>(props: TimePeriodGridItemProps<FieldValues>) => {
    const { formState: { control: formControl, formState: { errors } }, objectFieldName, isWithDeleteButton, timePeriodIndex, onDelete } = props
    const currErrors = (errors as any)?.[objectFieldName]

    const onDeleteClicked = () => {
        if (onDelete && timePeriodIndex !== undefined) {
            onDelete(timePeriodIndex)
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={2.5}>
                <Controller
                    name={`${objectFieldName}.from` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="Begin Day"
                            fieldError={currErrors?.from}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={2.5}>
                <Controller
                    name={`${objectFieldName}.to` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="End Day"
                            fieldError={currErrors?.to}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={2.5}>
                <TimePickerController
                    name={`${objectFieldName}.beginTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="Begin Time"
                    fieldError={currErrors?.beginTime}
                />
            </Grid>
            <Grid item xs={2.5}>
                <TimePickerController
                    name={`${objectFieldName}.endTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="End Time"
                    fieldError={currErrors?.endTime}
                />
            </Grid>
            {isWithDeleteButton && <Grid item xs={2} style= {{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <IconButton
                    size="small"
                    onClick={onDeleteClicked}
                >
                    <DeleteIcon />
                </IconButton>
            </Grid>}
        </Grid>
    )
}

export default TimePeriodGridItem;