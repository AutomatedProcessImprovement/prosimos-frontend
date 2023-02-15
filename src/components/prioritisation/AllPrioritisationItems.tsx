import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { QueryBuilder } from "../batching/QueryBuilder";
import { PrioritisationBuilderSchema } from "../batching/schemas";
import { JsonData } from "../formData";
import { collectAllCaseAttrWithTypes } from "./caseAttributesCollectorAndTransformer";

interface AllPrioritisationItemsProps {
    formState: UseFormReturn<JsonData, object>
}

const AllPrioritisationItems = (props: AllPrioritisationItemsProps) => {
    const { formState: { control: formControl, getValues } } = props
    const [builderSchema, setBuilderSchema] = useState<PrioritisationBuilderSchema>({})
    const [discreteOptionsByCaseAttributeName, setDiscreteOptionsByCaseAttributeName] = useState({})

    const { fields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: 'prioritisation_rules'
    })

    useEffect(() => {
        const [newBuilderSchema, newDiscreteOptions] = collectAllCaseAttrWithTypes(getValues("case_attributes"))
        if (newBuilderSchema !== builderSchema) {
            setBuilderSchema(newBuilderSchema)
        }
        if (newDiscreteOptions !== discreteOptionsByCaseAttributeName) {
            setDiscreteOptionsByCaseAttributeName(newDiscreteOptions)
        }
    }, [])

    return (
        <Grid container item xs={12}>
            {fields.map((item, index) => (
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" align="left"> Rule </Typography>
                    <QueryBuilder
                        formState={props.formState}
                        name={`prioritisation_rules.${index}.rules`}
                        builderSchema={builderSchema}
                        possibleValueOptions={discreteOptionsByCaseAttributeName}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default AllPrioritisationItems;
