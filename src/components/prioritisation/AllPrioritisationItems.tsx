import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { PrioritisationBuilderSchema } from "../batching/schemas";
import { JsonData } from "../formData";
import { UpdateAndRemovePrioritisationErrors } from "../simulationParameters/usePrioritisationErrors";
import { collectAllCaseAttrWithTypes, ValueOptionsByAttrName } from "./caseAttributesCollectorAndTransformer";
import PrioritisationItem from "./PrioritisationItem";

interface AllPrioritisationItemsProps {
    formState: UseFormReturn<JsonData, object>
    updateAndRemovePrioritisationErrors: UpdateAndRemovePrioritisationErrors
}

const AllPrioritisationItems = (props: AllPrioritisationItemsProps) => {
    const { formState: { control: formControl, getValues }, formState, updateAndRemovePrioritisationErrors } = props
    const [builderSchema, setBuilderSchema] = useState<PrioritisationBuilderSchema>({})
    const [discreteOptionsByCaseAttributeName, setDiscreteOptionsByCaseAttributeName] = useState<ValueOptionsByAttrName>({})

    const { fields, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: 'prioritisation_rules'
    })

    const onPrioritisationItemDelete = (index: number) => {
        remove(index)
    }

    useEffect(() => {
        const [newBuilderSchema, newDiscreteOptions] = collectAllCaseAttrWithTypes(getValues("case_attributes"), false)
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
                <PrioritisationItem
                    key={item.key}
                    formState={formState}
                    updateAndRemovePrioritisationErrors={updateAndRemovePrioritisationErrors}
                    discreteOptionsByCaseAttributeName={discreteOptionsByCaseAttributeName}
                    builderSchema={builderSchema}
                    index={index}
                    onPrioritisationItemDelete={onPrioritisationItemDelete}
                />
            ))}
        </Grid>
    )
}

export default AllPrioritisationItems;
