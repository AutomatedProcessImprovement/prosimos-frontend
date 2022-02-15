import { Grid, TextField } from "@mui/material";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove';
import GridItemWithCenteredIcon from "./GridItemWithCenteredIcon";

interface TimeDistributionProps {
    formState: UseFormReturn<JsonData, object>
}

const TimeDistribution = (props: TimeDistributionProps) => {
    const { control: formControl, formState: { errors } } = props.formState
    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `arrival_time_distribution.distribution_params`
    })

    const distrErrors = errors?.arrival_time_distribution

    const onDistrFuncParamAdd = () => append({ value: 0 })

    const onDistrFuncParamRemove = () => {
        const lastIndex = fields.length - 1
        remove(lastIndex)
    }

    return (
        <Grid container spacing={2}>
            <Grid container item xs={4}>
                <Grid item xs={12}>
                    <Controller
                        name={`arrival_time_distribution.distribution_name`}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                error={distrErrors?.distribution_name !== undefined}
                                helperText={distrErrors?.distribution_name?.message}
                                variant="standard"
                                placeholder="Function name"
                                label="Distribution"
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container item xs={8} spacing={2}>
                {fields.map((item, paramIndex) => {
                    const errors = distrErrors?.distribution_params?.[paramIndex]
                    let labelName = ""
                    switch (paramIndex) {
                        case 0: labelName = "Mean"; break
                        case 1: labelName = "Std deviation"; break
                    }

                    return (
                        <Grid item xs={2} key={`arrival_distr_params_${paramIndex}`}>
                            <Controller
                                name={`arrival_time_distribution.distribution_params.${paramIndex}.value`}
                                control={formControl}
                                rules={{ required: REQUIRED_ERROR_MSG }}
                                render={({ 
                                    field: { onChange, value }
                                 }) => ( 
                                    <TextField
                                        type="number"
                                        value={value}
                                        label={labelName || `Param ${paramIndex+1}`}
                                        onChange={(e) => {
                                            onChange(Number(e.target.value))
                                        }}
                                        inputProps={{
                                            step: "0.1"
                                        }}
                                        error={errors?.value !== undefined}
                                        helperText={errors?.value?.message || ""}
                                        variant="standard"
                                    />
                                )}
                            />
                        </Grid>
                    )
                })}
                <GridItemWithCenteredIcon
                    onClick={onDistrFuncParamRemove}
                    icon={<RemoveIcon/>}
                />
                <GridItemWithCenteredIcon
                    onClick={onDistrFuncParamAdd}
                    icon={<AddIcon/>}
                />
            </Grid>
        </Grid>
    )
}

export default TimeDistribution;
