import React from "react";
import { MenuItem, TextField } from "@mui/material";
import { ControllerRenderProps, FieldError } from "react-hook-form";

interface WeekdaySelectProps<FieldValues>{
    field: ControllerRenderProps<FieldValues, any>,
    label?: string
    fieldError?: FieldError
    updateParamsNum: (newDistrFunc: DISTR_FUNC) => void
}

export enum DISTR_FUNC {
    fix="fix",
    norm="norm",
    expon="expon",
    exponnorm="exponnorm",
    gamma="gamma",
    triang="triang",
    uniform="uniform",
    lognorm="lognorm"
} 


const WeekdaySelect = <FieldValues,>(props: WeekdaySelectProps<FieldValues>) => {
    const { onChange, ...otherProps} = props.field
    const onDistrFuncChange = (e?: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) => {
        const selectedValue = e?.target.value
        props.updateParamsNum(selectedValue as DISTR_FUNC)
        onChange(e)
    }

    return (
        <TextField 
            sx={{ width: "100%" }}
            {...otherProps}
            onChange={e => onDistrFuncChange(e)}
            error={props.fieldError !== undefined}
            helperText={props.fieldError?.message}
            label={props.label}
            variant="standard"
            select
        >
            {Object.values(DISTR_FUNC).map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
            ))}
        </TextField>
    )
}

export default WeekdaySelect;