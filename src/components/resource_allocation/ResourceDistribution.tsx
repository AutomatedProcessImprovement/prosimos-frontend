import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import TimeDistribution from "../distributions/TimeDistribution";
import { JsonData, ProbabilityDistributionForResource } from "../formData";
import ResourceSelect from "./ResourceSelect";
import DeleteIcon from '@mui/icons-material/Delete';

interface ResourceDistributionProps {
    formState: UseFormReturn<JsonData, object>
    resourceDistr: ProbabilityDistributionForResource
    allocationIndex: number
    resourceIndex: number
    allowedResources: { [key: string]: { name: string } }
    setErrorMessage: (value: string) => void
}

const ResourceDistribution = (props: ResourceDistributionProps) => {
    const { formState, allocationIndex, resourceIndex, allowedResources, setErrorMessage } = props
    const { formState: { errors } } = formState
    
    const currentErrors = errors?.task_resource_distribution?.[allocationIndex]?.resources?.[resourceIndex]
    const distrErrors = {
        distribution_name: currentErrors?.distribution_name,
        distribution_params: currentErrors?.distribution_params
    }

    return (
        <Paper elevation={5} sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={11}>
                    <ResourceSelect
                        formState={formState}
                        allocationIndex={allocationIndex}
                        resourceIndex={resourceIndex}
                        allowedResources={allowedResources}
                        currentError={currentErrors?.resource_id}
                    />
                </Grid>
                <Grid item xs={1}>
                    <IconButton component="span" onClick={() => { console.log("hello") }}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" align="left">
                        Duration
                    </Typography>
                    <TimeDistribution
                        formState={formState}
                        objectNamePath={`task_resource_distribution.${allocationIndex}.resources.${resourceIndex}`}
                        errors={distrErrors}
                        setErrorMessage={setErrorMessage}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ResourceDistribution;
