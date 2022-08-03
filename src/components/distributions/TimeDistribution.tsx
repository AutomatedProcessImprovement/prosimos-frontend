import { useState } from "react";
import { Grid, TextField } from "@mui/material";
import { Controller, FieldError, useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import DistrFuncSelect from "./DistrFuncSelect";
import { DISTR_FUNC } from "./DistrFuncSelect"

type AllowedObjectName = "arrival_time_distribution" 
    | `task_resource_distribution.${number}.resources.${number}`

type AllowedDistrParamsName = "arrival_time_distribution.distribution_params" 
    | `task_resource_distribution.${number}.resources.${number}.distribution_params`

interface TimeDistributionProps {
    formState: UseFormReturn<JsonData, object>
    objectNamePath: AllowedObjectName
    errors?: {
        distribution_name?: FieldError
        distribution_params?: { value?: FieldError }[]
    }
    setErrorMessage: (value: string) => void
    funcLabel?: string
}

const distrFuncWithNumOfParams: { [key in DISTR_FUNC]: any [] } = {
    [DISTR_FUNC.fix]: [0,0,1],
    [DISTR_FUNC.norm]: new Array(2+2).fill(0),
    [DISTR_FUNC.expon]: new Array(2+2).fill(0),
    [DISTR_FUNC.exponnorm]: new Array(3+2).fill(0),
    [DISTR_FUNC.uniform]: new Array(2+2).fill(0),
    [DISTR_FUNC.gamma]: new Array(3+2).fill(0),
    [DISTR_FUNC.triang]: new Array(3+2).fill(0),
    [DISTR_FUNC.lognorm]: new Array(3+2).fill(0)
}

const TimeDistribution = (props: TimeDistributionProps) => {
    const { control: formControl, setValue, getValues } = props.formState
    const { objectNamePath, errors: distrErrors, setErrorMessage } = props
    const { fields, replace } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `${objectNamePath}.distribution_params` as AllowedDistrParamsName
    });
    const [currSelectedFunc, setCurrSelectedFunc] = useState<DISTR_FUNC | null>(null)

    // TODO: will be back once we allow user all set of the possible distribution functions

    // const onDistrFuncParamAdd = () => append({ value: 0 })

    // const onDistrFuncParamRemove = () => {
    //     const fieldsLength = fields.length
    //     if (fieldsLength === 2) {
    //         props.setErrorMessage("Two required parameters should be defined")
    //         return
    //     }

    //     const lastIndex = fieldsLength - 1
    //     remove(lastIndex)
    // };

    const updateParamsNum = (newDistrFunc: DISTR_FUNC) => {
        setCurrSelectedFunc(newDistrFunc)
        const newDefaultParams = distrFuncWithNumOfParams[newDistrFunc]
        replace(newDefaultParams)
        newDefaultParams.forEach((item, index) => {
            setValue(`${objectNamePath}.distribution_params.${index}.value`, item)
        })
    };

    const onNumberFieldChange = (num: Number, label: String, onChange: (value: Number) => void) => {
        let newDistrFunc = null
        if (currSelectedFunc == null) {
            newDistrFunc = getValues(`${objectNamePath}.distribution_name`) as DISTR_FUNC
            setCurrSelectedFunc(newDistrFunc)
        }

        const distrFunc = currSelectedFunc ?? newDistrFunc
        
        if (distrFunc === DISTR_FUNC.triang && label === "Param 1") {
            if (num < 0 || num > 1)
                setErrorMessage("Parameter 1 (shape parameter) should be in the range [0, 1]")
            else 
                onChange(num)
        } else {
            onChange(num)
        }
    };
    
    return (
        <Grid container spacing={2}>
            <Grid container item xs={4}>
                <Grid item xs={12}>
                    <Controller
                        name={`${objectNamePath}.distribution_name` as unknown as keyof JsonData}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field }) => (
                            <DistrFuncSelect
                                field={field}
                                fieldError={distrErrors?.distribution_name}
                                label={props.funcLabel || "Distribution Function"}
                                updateParamsNum={updateParamsNum}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={8} spacing={2}>
                {fields.map((item, paramIndex) => {
                    const errors = distrErrors?.distribution_params?.[paramIndex]
                    let labelName = ""
                    const length = fields.length
                    switch (paramIndex) {
                        // give the name starting from the last element in the array
                        case (length - 1): labelName = "Max"; break
                        case (length - 2): labelName = "Min"; break
                        case (length - 3): labelName = "Scale"; break
                        case (length - 4): labelName = "Loc"; break
                    }

                    return (
                        <Grid item xs={3} key={`${objectNamePath}_distribution_params_${paramIndex}`}>
                            <Controller
                                name={`${objectNamePath}.distribution_params.${paramIndex}.value` as unknown as keyof JsonData}
                                control={formControl}
                                rules={{ required: REQUIRED_ERROR_MSG }}
                                render={({ 
                                    field: { onChange, value }
                                 }) => {
                                    const label = labelName || `Param ${paramIndex+1}`
                                    return <TextField
                                        type="number"
                                        value={value}
                                        label={label}
                                        onChange={(e) => {
                                            onNumberFieldChange(Number(e.target.value), label, onChange)
                                        }}
                                        inputProps={{
                                            step: "any"
                                        }}
                                        error={errors?.value !== undefined}
                                        helperText={errors?.value?.message || ""}
                                        variant="standard"
                                    />
                                }}
                            />
                        </Grid>
                    )
                })}
                {/* TODO: will be back once we allow all possible functions from the scipy stats library*/}
                {/* <GridItemWithCenteredIcon
                    onClick={onDistrFuncParamRemove}
                    icon={<RemoveIcon/>}
                />
                <GridItemWithCenteredIcon
                    onClick={onDistrFuncParamAdd}
                    icon={<AddIcon/>}
                /> */}
            </Grid>
        </Grid>
    )
}

export default TimeDistribution;
