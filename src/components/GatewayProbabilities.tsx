import React, { useState } from "react";
import { Grid, Typography, TextField } from "@mui/material";

interface ActivityProbabilites {
    [activityUid: string]: number
}

interface BranchingProbProps {
    gatewayKey: string
    prob: any
    onProbChange: (gatewayUid: string, activityUid: string, { target }: any) => void
}

const GatewayProbabilities = (props: BranchingProbProps) => {
    const [areProbabilitiesValid, setAreProbabilitiesValid] = useState(true)
    const { gatewayKey, prob, onProbChange } = props

    const onChange = (gatewayUid: string, activityUid: string, e: any) => {
        const updatedValue = parseFloat(e.target.value).toFixed(2)
        const updated = {
            ...prob,
            [activityUid]: updatedValue
        } as ActivityProbabilites

        const probabilitiesSum = Object.values(updated).reduce((prev, curr) => Number(prev) + Number(curr))

        if (probabilitiesSum > 1) {
            setAreProbabilitiesValid(false)
        } else {
            setAreProbabilitiesValid(true)
        }

        onProbChange(gatewayUid, activityUid, e)
    }

    return (
        <Grid container spacing={1} key={gatewayKey + 'Grid'}>
            <Grid item xs={12}>
                <Typography key={gatewayKey + 'Key'} variant="h6" align="left">
                    {gatewayKey}
                </Typography>
            </Grid>
            {Object.entries(prob).map(([activityKey, probValue]) => (
                <React.Fragment key={`${activityKey}Fr`} >
                    <Grid key={`${activityKey}NameGrid`} item xs={5}>
                        <Typography key={activityKey + 'Name'} align="center" variant="body2">
                            {activityKey}
                        </Typography>
                    </Grid>
                    <Grid key={activityKey + 'ValueGrid'} item xs={7}>
                        <TextField
                            error={areProbabilitiesValid ? false : true}
                            key={activityKey + 'Value'}
                            type="number"
                            required
                            onChange={e => onChange(gatewayKey, activityKey, e)}
                            value={probValue}
                            variant="standard"
                            label="Probability"
                            helperText={areProbabilitiesValid ? "" : "Summation should be <= 1"}
                            inputProps={{
                                step: "0.01",
                                min: 0,
                                max: 1
                            }}
                            style = {{width: "40%"}}
                        />
                    </Grid>
                </React.Fragment>
            ))}
        </Grid>
    )
}

export default GatewayProbabilities;