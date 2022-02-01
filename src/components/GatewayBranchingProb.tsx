import React from "react";
import { Card, Grid, TextField, Typography } from "@mui/material";

interface GatewayBranchingProbProps {
    probabilities?: []
}

const GatewayBranchingProb = (props: GatewayBranchingProbProps) => {
    const handleSubmit = () => {

    }

    if (props.probabilities) {
        return (<>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {Object.entries(props.probabilities).map(([gatewayKey, prob]) => (
                        <Grid item xs={12}>
                            <Card elevation={5} sx={{ p: 1 }}>
                                <Grid container spacing={1} key={gatewayKey+'Grid'}>
                                    <Grid item xs={12}>
                                        <Typography key={gatewayKey+'Key'} variant="h6" align="left">
                                            {gatewayKey}
                                        </Typography>
                                    </Grid>
                                    {Object.entries(prob).map(([activityKey, probValue]) => (
                                        <React.Fragment key={`${activityKey}Fr`} >
                                            <Grid key={`${activityKey}NameGrid`} item xs={5}>
                                                <Typography key={activityKey+'Name'} align="center" variant="body2">
                                                    {activityKey}
                                                </Typography>
                                            </Grid>
                                            <Grid key={activityKey+'ValueGrid'} item xs={7}>
                                                <TextField
                                                    key={activityKey+'Value'}
                                                    required
                                                    // onChange={onTextChange}
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