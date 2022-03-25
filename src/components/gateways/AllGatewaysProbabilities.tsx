import { Card, Grid } from "@mui/material";
import { JsonData } from "../formData";
import GatewayProbabilities from "./GatewayProbabilities";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Gateways } from "../modelData";

interface GatewayBranchingProbProps {
    formState: UseFormReturn<JsonData, object>
    gateways: Gateways
}

const AllGatewaysProbabilities = (props: GatewayBranchingProbProps) => {
    const { formState: { control: formControl }, gateways } = props
    const { fields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `gateway_branching_probabilities`
    })
    
    return (
        <Grid container spacing={2}>
            {fields.map((probability, index) => {
                const gatewayKey = probability.gateway_id
                return <Grid key={`${gatewayKey}Grid`} item xs={12}>
                    <Card elevation={5} sx={{ p: 1 }}>
                        <GatewayProbabilities
                            gatewayKey={gatewayKey}
                            index={index}
                            formState={props.formState}
                            gateway={gateways?.[gatewayKey]}
                        />
                    </Card>
                </Grid>
            })}
        </Grid>
    )
}

export default AllGatewaysProbabilities;