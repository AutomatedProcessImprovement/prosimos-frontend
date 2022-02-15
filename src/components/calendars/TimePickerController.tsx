import moment from "moment";
import { Controller, UseFormReturn } from "react-hook-form";
import { LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterMoment from "@mui/lab/AdapterMoment";
import { TextField } from "@mui/material";
import { JsonData } from "../formData";

interface TimePickerControllerProps {
    name: keyof JsonData
    formState: UseFormReturn<JsonData, object>
    label?: string
}

const TimePickerController = (props: TimePickerControllerProps) => {
    const { formState: { control: formControl }, name, label } = props
    
    return (
        <Controller
            name={name}
            control={formControl}
            rules={{ required: true }}
            render={({ 
                field: { onChange, value },
            }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <TimePicker
                        label={label}
                        renderInput={(props) => <TextField {...props} variant="standard" />}
                        views={['hours', 'minutes']}
                        inputFormat={'HH:mm'}
                        mask="__:__"
                        value={moment(value as string, 'HH:mm:ss.SSS')}
                        onChange={(newValue) => {
                            const newValueString = moment(newValue).format('HH:mm:ss.SSS')
                            onChange(newValueString)
                        }}
                    />
                </LocalizationProvider>
            )}
        />
    )
}

export default TimePickerController;