import { Card, Grid, TextField, Typography } from "@mui/material";
import { UseFormReturn, Controller, useFieldArray } from "react-hook-form";
import { JsonData } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import DiscreteValueOptions from "./DiscreteValueOptions";

interface DiscreteCaseAttrProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
    itemIndex: number
}

const DiscreteCaseAttr = (props: DiscreteCaseAttrProps) => {
    const { formState, formState: { control: formControl }, setErrorMessage, itemIndex } = props

    return (
        <Card elevation={5} sx={{ m: 1, p: 1, minHeight: "215px" }}>
            <Grid container item xs={12} sx={{ p: 1 }}>
                <Grid item xs={12}>
                    <Controller
                        name={`case_attributes.${itemIndex}.name`}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field: { ref, ...others } }) => {
                            return (
                                <TextField
                                    {...others}
                                    inputRef={ref}
                                    style={{ width: "100%" }}
                                    // error={areAnyErrors}
                                    // helperText={errorMessage}
                                    variant="standard"
                                    placeholder="Resource pool name"
                                    label={"Case Attribute's Name"}
                                />
                            )
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <DiscreteValueOptions
                        formState={formState}
                        itemIndex={itemIndex}
                    />

                </Grid>
            </Grid>
        </Card>
    )
}

export default DiscreteCaseAttr;