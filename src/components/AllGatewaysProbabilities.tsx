import { useState } from "react";
import { Card, Grid } from "@mui/material";
import { JsonData } from "./SimulationParameters";
import GatewayProbabilities from "./GatewayProbabilities";

export interface GatewayBranchingProbabilities {
    [gatewayUid: string]: {
        [activityUid: string]: number
    }
}

interface GatewayBranchingProbProps {
    probabilities: GatewayBranchingProbabilities
    onParamFormUpdate: (paramSectionName: keyof JsonData, updatedValue: any) => void
}

const AllGatewaysProbabilities = (props: GatewayBranchingProbProps) => {
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
                <Grid container spacing={2}>
                    {Object.entries(updProbabilities).map(([gatewayKey, prob]) => (
                        <Grid key={`${gatewayKey}Grid`} item xs={12}>
                            <Card elevation={5} sx={{ p: 1 }}>
                                <GatewayProbabilities
                                    gatewayKey={gatewayKey}
                                    prob={prob}
                                    onProbChange={onProbChange}
                                />
                            </Card>
                        </Grid>
                    ))}
                </Grid>
        </>)
    }

    return <></>
}

export default AllGatewaysProbabilities;