import React, { useState } from "react";
import { Card, Grid, TextField, Typography } from "@mui/material";
import { JsonData } from "./SimulationParameters";

export interface GatewayBranchingProbabilities {
    [gatewayUid: string]: {
        [activityUid: string]: number
    }
}
interface GatewayBranchingProbProps {
    probabilities: GatewayBranchingProbabilities
    onParamFormUpdate: (paramSectionName: keyof JsonData, updatedValue: any) => void
}

const GatewayBranchingProb = (props: GatewayBranchingProbProps) => {
    const [updProbabilities, setUpdProbabilities] = useState(props.probabilities)


    const onProbChange = (gatewayUid: string, activityUid: string, { target }: any) => {
        const updated = {
            ...updProbabilities,
            [gatewayUid]: {
                ...updProbabilities[gatewayUid],
                [activityUid]: target.value
            }
        }

        setUpdProbabilities(updated)

        // update params in the parent component
        props.onParamFormUpdate("gateway_branching_probabilities", updated)
    }

    if (updProbabilities) {
        return (<>
            <form>
                <Grid container spacing={2}>
                    {Object.entries(updProbabilities).map(([gatewayKey, prob]) => (
                        <Grid key={`${gatewayKey}Grid`} item xs={12}>
                            <Card elevation={5} sx={{ p: 1 }}>
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
                                                    key={activityKey + 'Value'}
                                                    required
                                                    onChange={e => onProbChange(gatewayKey, activityKey, e)}
                                                    value={probValue}
                                                    variant="standard"
                                                    label="Probability"
                                                />
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </form>
        </>)
    }

    return <></>
}

export default GatewayBranchingProb;