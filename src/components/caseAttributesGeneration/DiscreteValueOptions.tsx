import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import DistributionMappingWithAdd from "../batching/DistributionMappingWithAdd";
import { AllowedDistrParamsName } from "../batching/DistributionSection";
import { JsonData } from "../formData";
import AddButtonBase from "../toolbar/AddButtonBase";

interface DiscreteValueOptionsProps {
    formState: UseFormReturn<JsonData, object>
    // setErrorMessage: (value: string) => void
    itemIndex: number
}

const DiscreteValueOptions = (props: DiscreteValueOptionsProps) => {
    const { formState: { control: formControl }, itemIndex } = props
    const objectFieldNamePart = `case_attributes.${itemIndex}.values` as AllowedDistrParamsName
    const [isRowAdded, setIsRowAdded] = useState(false)

    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: objectFieldNamePart
    });

    const onTimePeriodAdd = () => {
        setIsRowAdded(true)
        append({
            key: "Option's Name",
            value: 0.5
        })
    };

    return (
        <Grid item container xs={12}>
            <Grid item container xs={12}>
                <Grid item xs={9}>
                    <Typography variant="subtitle2" align="left"> Option List </Typography>
                </Grid>
                <Grid item xs={3}>
                    <AddButtonBase
                        labelName="Add an option"
                        onClick={onTimePeriodAdd}
                    />
                </Grid>
            </Grid>
            <DistributionMappingWithAdd
                formState={props.formState}
                objectFieldNamePart={objectFieldNamePart}
                valueLabel="Probability"
                isRowAdded={isRowAdded}
                setIsRowAdded={setIsRowAdded}
                fields={fields}
                remove={remove}
                keyTextFieldProps={{
                    label: "Value",
                    type: "text"
                }}
            />
        </Grid>
    )
}

export default DiscreteValueOptions;