import { TextField, MenuItem } from "@mui/material";
import { UseFormReturn, Controller, FieldError } from "react-hook-form";
import { JsonData } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";

interface ResourceSelectProps {
    formState: UseFormReturn<JsonData, object>
    allocationIndex: number
    resourceIndex: number
    allowedResources: { [key: string]: { name: string } }
    currentError?: FieldError
}

const ResourceSelect = (props: ResourceSelectProps) => {
    const { 
        formState: { control: formControl },
        allocationIndex, resourceIndex, allowedResources, currentError
    } = props

    return (
        <Controller
            name={`task_resource_distribution.${allocationIndex}.resources.${resourceIndex}.resource_id`}
            control={formControl}
            rules={{ required: REQUIRED_ERROR_MSG }}
            render={({ field }) => (
                <TextField 
                    sx={{ width: "100%" }}
                    {...field}
                    label="Resource"
                    variant="standard"
                    select
                    error={currentError !== undefined}
                    helperText={currentError?.message}
                >
                    {Object.entries(allowedResources).map(([resourceId, resourceValue]) => (
                        <MenuItem value={resourceId}>{resourceValue.name}</MenuItem>
                    ))}
                </TextField>
            )}
        />
    )
}

export default ResourceSelect;