import { Grid, Typography } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { QueryBuilder } from "../batching/QueryBuilder";
import { PrioritisationBuilderSchema } from "../batching/schemas";
import { JsonData } from "../formData";

interface AllPrioritisationItemsProps {
    formState: UseFormReturn<JsonData, object>
    queryBuilderSchema: PrioritisationBuilderSchema
}

const AllPrioritisationItems = (props: AllPrioritisationItemsProps) => {
    const { formState: { control: formControl }, queryBuilderSchema } = props

    const { fields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: 'prioritisation_rules'
    })

    return (
        <Grid container item xs={12}>
            {fields.map((item, index) => {
                console.log(item, index)
                return <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="h6" align="left"> Rule </Typography>
                    <QueryBuilder
                        formState={props.formState}
                        name={`prioritisation_rules.${index}.rule`}
                        possibleOptions={queryBuilderSchema}
                    />
                </Grid>
            })}
        </Grid>
    )
}

export default AllPrioritisationItems;
