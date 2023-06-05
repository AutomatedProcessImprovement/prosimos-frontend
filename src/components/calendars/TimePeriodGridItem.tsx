import { IconButton, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { REQUIRED_ERROR_MSG, SHOULD_BE_GREATER_0_MSG, SHOULD_BE_LESS_OR_EQ_1_MSG } from "../validationMessages";
import TimePickerController from "./TimePickerController";
import WeekdaySelect from "./WeekdaySelect";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from "react";
import { ModelType } from "./ModelType";

interface TimePeriodGridItemProps<FieldValues> {
    formState: UseFormReturn<FieldValues, object>
    objectFieldName: string
    timePeriodIndex?: number
    isWithDeleteButton: boolean
    onDelete?: (index: number) => void
    modelType?: ModelType
}

const TimePeriodGridItem = <FieldValues,>(props: TimePeriodGridItemProps<FieldValues>) => {
    const { formState: { control: formControl, formState: { errors } }, objectFieldName, isWithDeleteButton, timePeriodIndex, onDelete, modelType } = props
    const [currErrors, setCurrErrors] = useState({})
    const columnWidth = modelType === ModelType.CRISP ? 2.5 : 2

    useEffect(() => {
        if (Object.keys(errors).length !== 0) {
            let currErrors = errors as any
            objectFieldName.split(".").forEach((key) => {
                currErrors = currErrors?.[key];
            })
            const finalErrors = currErrors || "Something went wrong, please check the simulation scenario parameters"
            setCurrErrors(finalErrors)
        }
    }, [errors, objectFieldName])

    const onDeleteClicked = () => {
        if (onDelete && timePeriodIndex !== undefined) {
            onDelete(timePeriodIndex)
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={columnWidth}>
                <Controller
                    name={`${objectFieldName}.from` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="Begin Day"
                            fieldError={(currErrors as any)?.from}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={columnWidth}>
                <Controller
                    name={`${objectFieldName}.to` as Path<FieldValues>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field }) => (
                        <WeekdaySelect
                            field={field}
                            label="End Day"
                            fieldError={(currErrors as any)?.to}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={columnWidth}>
                <TimePickerController
                    name={`${objectFieldName}.beginTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="Begin Time"
                    fieldError={(currErrors as any)?.beginTime}
                />
            </Grid>
            <Grid item xs={columnWidth}>
                <TimePickerController
                    name={`${objectFieldName}.endTime` as Path<FieldValues>}
                    formState={props.formState}
                    label="End Time"
                    fieldError={(currErrors as any)?.endTime}
                />
            </Grid>
            
            { modelType === ModelType.FUZZY && 
            <Grid item xs={columnWidth}>
                <Controller
                    
                    name={`${objectFieldName}.probability` as Path<FieldValues>}
                    control={formControl}
                    rules={{ 
                        required: REQUIRED_ERROR_MSG,
                        min: { value: 0, message: SHOULD_BE_GREATER_0_MSG },
                        max: { value: 1, message: SHOULD_BE_LESS_OR_EQ_1_MSG }

                    }}
                    render={({ field: {onChange, value} }) => (
                        <TextField
                            type="number"
                            value={value}
                            label="Probability"
                            inputProps={{
                                step: "0.00001",
                                min: "0",
                                max: "1"
                            }}  
                            onChange={(e) => {
                                onChange(Number(e.target.value))
                            }}        
                            variant="standard"    
                            fullWidth              
                        />
                    )}
                />
            </Grid>}
            {isWithDeleteButton && <Grid item xs={2} style={{
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