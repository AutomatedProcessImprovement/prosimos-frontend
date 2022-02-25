import { Grid, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { ScenarioProperties } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import moment from "moment";

interface ScenarioSpecificationProps {
    formState: UseFormReturn<ScenarioProperties, object>
}

const ScenarioSpecification = (props: ScenarioSpecificationProps) => {
    const { control: formControl, formState: { errors } } = props.formState

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Controller
                    name="num_processes"
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            type="number"
                            value={value}
                            label="Total number of process instances"
                            onChange={(e) => {
                                onChange(Number(e.target.value))
                            }}
                            inputProps={{
                                step: "0.1"
                            }}
                            error={errors?.num_processes !== undefined}
                            helperText={errors?.num_processes?.message || ""}
                            variant="standard"
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="start_date"
                    control={formControl}
                    rules={{ required: REQUIRED_ERROR_MSG }}
                    render={({ field: { onChange, value } }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateTimePicker
                                label="Scenario start date and time"
                                renderInput={(props) => <TextField {...props} variant="standard" />}
                                value={moment(value as string, 'YYYY-MM-DDTHH:mm:ss.sssZ')}
                                onChange={(newValue) => {
                                    const newValueString = moment(newValue).format('YYYY-MM-DDTHH:mm:ss.sssZ')
                                    onChange(newValueString)
                                }}
                            />
                        </LocalizationProvider>
                    )}
                />
            </Grid>
        </Grid>
    )
}

export default ScenarioSpecification;