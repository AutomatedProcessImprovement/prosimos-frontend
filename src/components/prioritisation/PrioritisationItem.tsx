import { Card, Grid, TextField, Typography } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { QueryBuilder } from "../batching/QueryBuilder";
import { PrioritisationBuilderSchema } from "../batching/schemas";
import { JsonData } from "../formData";
import { useSharedStyles } from "../sharedHooks/useSharedStyles";
import { UpdateAndRemovePrioritisationErrors } from "../simulationParameters/usePrioritisationErrors";
import DeleteButtonToolbar from "../toolbar/DeleteButtonToolbar";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import { ValueOptionsByAttrName } from "./caseAttributesCollectorAndTransformer";

interface PrioritisationItemProps {
    formState: UseFormReturn<JsonData, object>
    builderSchema: PrioritisationBuilderSchema
    discreteOptionsByCaseAttributeName: ValueOptionsByAttrName
    updateAndRemovePrioritisationErrors: UpdateAndRemovePrioritisationErrors
    index: number
    onPrioritisationItemDelete: (index: number) => void
}

const PrioritisationItem = (props: PrioritisationItemProps) => {
    const { formState, formState: { control: formControl }, builderSchema, discreteOptionsByCaseAttributeName,
        updateAndRemovePrioritisationErrors, index, onPrioritisationItemDelete: onPrioritisationItemDeleteProp } = props
    const classes = useSharedStyles()

    const onContinuousCaseAttrDelete = () => {
        onPrioritisationItemDeleteProp(index)
    }

    return (
        <Card elevation={5} sx={{ m: 1, p: 1, minHeight: "262.5px", width: "100%" }}>
            <Grid container item xs={12} sx={{ p: 1 }}>
                <Grid item xs={10}>
                    <Controller
                        name={`prioritisation_rules.${index}.priority_level` as unknown as keyof JsonData}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({
                            field: { onChange, value }
                        }) => {
                            return <TextField
                                type="number"
                                value={value}
                                label="Priority"
                                onChange={(e) => {
                                    // save as a number in the json file
                                    onChange(Number(e.target.value))
                                }}
                                inputProps={{
                                    step: "any",
                                    min: 1
                                }}
                                // error={errors?.value !== undefined}
                                // helperText={errors?.value?.message || ""}
                                variant="standard"
                                style={{ width: "100%" }}
                            />
                        }}
                    />
                </Grid>
                <Grid item xs={2} className={classes.centeredGrid}>
                    <DeleteButtonToolbar
                        onClick={onContinuousCaseAttrDelete}
                        labelName="Delete"
                        tooltipText={"Delete the case attribute"}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" align="left">
                        Condition
                    </Typography>
                    <QueryBuilder
                        formState={formState}
                        name={`prioritisation_rules.${index}.rules`}
                        builderSchema={builderSchema}
                        possibleValueOptions={discreteOptionsByCaseAttributeName}
                        updateAndRemovePrioritisationErrors={updateAndRemovePrioritisationErrors}
                    />
                </Grid>
            </Grid>
        </Card>
    )
}

export default PrioritisationItem;
