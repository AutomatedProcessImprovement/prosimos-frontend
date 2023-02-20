import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { PrioritisationBuilderSchema } from "../batching/schemas";
import { JsonData } from "../formData";
import { defaultPrioritisationRule } from "../simulationParameters/defaultValues";
import { UpdateAndRemovePrioritisationErrors } from "../simulationParameters/usePrioritisationErrors";
import AllPrioritisationItemsToolbar from "./AllPrioritisationItemsToolbar";
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

    const { fields, remove, prepend } = useFieldArray({
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

    const onAddNewPrioritisationItem = () => {
        prepend(defaultPrioritisationRule)
    }

    return (
        <Grid container item xs={12} spacing={2} >
            <AllPrioritisationItemsToolbar
                onAddNew={onAddNewPrioritisationItem}
            />
            <Grid container item xs={12} style={{ paddingTop: "0px" }}>
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
        </Grid>
    )
}

export default AllPrioritisationItems;
