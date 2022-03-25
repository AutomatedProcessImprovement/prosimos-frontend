import React from "react";
import { Grid, Typography, TextField } from "@mui/material";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData } from "../formData";
import { GatewayInfo } from "../modelData";

interface BranchingProbProps {
    gatewayKey: string
    index: number
    formState: UseFormReturn<JsonData, object>
    gateway: GatewayInfo
}

const GatewayProbabilities = (props: BranchingProbProps) => {
    const { gatewayKey, index: gatewayIndex, 
        formState : { control: formControl, formState: { errors }, trigger }, gateway } = props

    const { fields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `gateway_branching_probabilities.${gatewayIndex}.probabilities`
    })
    return (
        <Grid container spacing={1} key={gatewayKey + 'Grid'}>
            <Grid item xs={12}>
                <Typography key={gatewayKey + 'Key'} variant="h6" align="left">
                    {gateway.name || gatewayKey}
                </Typography>
            </Grid>
            {fields.map(({ path_id: activityKey }, index) => {
                const probsError = errors?.gateway_branching_probabilities?.[gatewayIndex]?.probabilities as any
                const fieldError = probsError?.[index]?.value
                const businessObject = gateway.childs?.[activityKey]

                return <React.Fragment key={`${activityKey}Fr`} >
                    <Grid key={`${activityKey}NameGrid`} item xs={6}>
                        <Typography key={activityKey + 'Name'} align="center" variant="body2">
                            {businessObject.name || activityKey}
                        </Typography>
                    </Grid>
                    <Grid key={activityKey + 'ValueGrid'} item xs={6}>
                        <Controller
                            name={`gateway_branching_probabilities.${gatewayIndex}.probabilities.${index}.value`}
                            control={formControl}
                            render={({ field }) => {
                                const {onChange} = field
                                return <TextField
                                    {...field}
                                    key={activityKey + 'Value'}
                                    type="number"
                                    onChange={(e) => {
                                        onChange(e)
                                        trigger(`gateway_branching_probabilities.${gatewayIndex}.probabilities`)
                                    }}
                                    variant="standard"
                                    label="Probability"
                                    inputProps={{
                                        step: "0.01",
                                        min: 0,
                                        max: 1
                                    }}
                                    style = {{width: "50%"}}
                                    error={fieldError !== undefined || probsError !== undefined}
                                    helperText={probsError?.message || fieldError?.message || ""}
                                />
                            }}
                        />
                    </Grid>
                </React.Fragment>
            })}
        </Grid>
    )
}

export default GatewayProbabilities;