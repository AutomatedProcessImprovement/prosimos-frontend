import { Grid, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { JsonData } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";

interface ArrivalTimePeriodProps {
    formState: UseFormReturn<JsonData, object>
}

const ArrivalTimePeriod = (props: ArrivalTimePeriodProps) => {
    const { control: formControl } = props.formState
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>

            </Grid>
        </Grid>
    )
}

export default ArrivalTimePeriod;