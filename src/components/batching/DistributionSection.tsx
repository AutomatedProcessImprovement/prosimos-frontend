import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { BatchDistrib, JsonData } from "../formData";
import AddButtonBase from "../toolbar/AddButtonBase";
import DistributionMappingWithAdd from "./DistributionMappingWithAdd";

export type AllowedDistrParamsName = `batch_processing.${number}.duration_distrib`
    | `batch_processing.${number}.size_distrib`

interface DistributionSectionProps {
    formState: UseFormReturn<JsonData, object>
    objectFieldNamePart: AllowedDistrParamsName
    taskIndex: number
    valueLabel: string
}

const DistributionSection = (props: DistributionSectionProps) => {
    const { formState: { control: formControl }, taskIndex, objectFieldNamePart, valueLabel } = props
    const [isRowAdded, setIsRowAdded] = useState(false)

    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: objectFieldNamePart
    });

    const onTimePeriodAdd = () => {
        setIsRowAdded(true)
        append({
            key: "1",
            value: 0.5
        } as BatchDistrib)
    };
    
    return (
        <Grid item container xs={6}>
            <Grid item container xs={12}>
                <Grid item xs={9}>
                    <Typography variant="h6" align="left"> Size Distribution </Typography>
                </Grid>
                <Grid item xs={3}>
                    <AddButtonBase
                        labelName="Add a mapping"
                        onClick={onTimePeriodAdd}
                    />
                </Grid>
            </Grid>
            <DistributionMappingWithAdd
                formState={props.formState}
                taskIndex={taskIndex}
                objectFieldNamePart={objectFieldNamePart}
                valueLabel={valueLabel}
                isRowAdded={isRowAdded}
                setIsRowAdded={setIsRowAdded}
                fields={fields}
                remove={remove}
            />
        </Grid>
    );
};

export default DistributionSection;
