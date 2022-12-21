import { useState, useEffect, ChangeEvent } from "react";
import { IconButton, Grid, TextField } from "@mui/material";
import { Controller, Path, UseFormReturn } from "react-hook-form";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import DeleteIcon from '@mui/icons-material/Delete';
import { JsonData } from "../formData";

interface DistributionMappingRowProps {
    formState: UseFormReturn<JsonData, object>
    // objectFieldName: string
    timePeriodIndex?: number
    isWithDeleteButton: boolean
    onDelete?: (index: number) => void
    taskIndex: number
    rowIndex: number
}

const DistributionMappingRow = (props: DistributionMappingRowProps) => {
    const { formState: { control: formControl, formState: { errors } },
        // objectFieldName
        timePeriodIndex, onDelete, taskIndex, rowIndex } = props
    const [currErrors, setCurrErrors] = useState({})
    const [objectFieldName, setObjectFieldName] = useState<Path<JsonData>>()

    useEffect(() => {
        setObjectFieldName(`batch_processing.${taskIndex}.size_distrib.${rowIndex}`)
    }, [taskIndex, rowIndex])
    
    useEffect(() => {
        if ((Object.keys(errors).length !== 0) && (objectFieldName !== undefined)) {
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
            <Grid item xs={5}>
                <Controller
                    name={`batch_processing.${taskIndex}.size_distrib.${rowIndex}.key` as Path<JsonData>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field: { ref, ...others } }) => {
                        return (
                            <TextField
                                {...others}
                                inputRef={ref}
                                style={{ width: "100%" }}
                                error={!!(currErrors as any)?.key?.message}
                                helperText={(currErrors as any)?.key?.message}
                                variant="standard"
                                label="Batch Size"
                                type="number"
                            />
                        )
                    }}
                />
            </Grid>
            <Grid item xs={5}>
                <Controller
                    name={`batch_processing.${taskIndex}.size_distrib.${rowIndex}.value` as Path<JsonData>}
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field: { ref, onChange, ...others } }) => {
                        return (
                            <TextField
                                {...others}
                                onChange={((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                    const valueStr = event.target.value
                                    onChange(Number(valueStr))
                                })}
                                inputRef={ref}
                                style={{ width: "100%" }}
                                error={!!(currErrors as any)?.value?.message}
                                helperText={(currErrors as any)?.value?.message}
                                variant="standard"
                                label="Probability"
                                type="number"
                            />
                        )
                    }}
                />
            </Grid>
            <Grid item xs={2} style={{
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
            </Grid>
        </Grid>
    )
}

export default DistributionMappingRow;
