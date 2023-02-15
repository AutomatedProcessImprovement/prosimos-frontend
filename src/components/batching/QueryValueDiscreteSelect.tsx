import { MenuItem, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import { Controller, FieldError } from "react-hook-form"

interface QueryValueDiscreteSelectProps {
    conditionValueName: string
    fieldError?: FieldError
    formState: any
    allPossibleOptions: string[]
    style: any
}

const QueryValueDiscreteSelect = (props: QueryValueDiscreteSelectProps) => {
    const { control, getValues } = props.formState
    const { conditionValueName, fieldError, allPossibleOptions, style } = props
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const propsMessage = fieldError?.message
        if (propsMessage && propsMessage !== errorMessage) {
            setErrorMessage(propsMessage)
        }
    }, [errorMessage, fieldError])

    useEffect(() => {
        const currValue = getValues(conditionValueName)
        if (!allPossibleOptions.includes(currValue ?? "")) {
            // the value initially provided in the sim scenario - is not valid
            // (it means the case attribute does not have this value as an option)
            setErrorMessage("Invalid value")
        }
    }, [])

    return (
        <Controller
            name={conditionValueName}
            control={control}
            render={({ field: fieldProps }) => (
                <TextField
                    {...fieldProps}
                    sx={style ? style : { width: "100%" }}
                    error={errorMessage !== ""}
                    helperText={errorMessage}
                    label="Value"
                    variant="standard"
                    select
                >
                    {allPossibleOptions.map((item) => (
                        <MenuItem value={item}>{item}</MenuItem>
                    ))}
                </TextField>
            )}
        />
    )
}

export default QueryValueDiscreteSelect;
