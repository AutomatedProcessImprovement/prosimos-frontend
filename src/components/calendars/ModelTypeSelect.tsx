import { useEffect, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { ModelType } from "./ModelType";

const ModelTypeSelect = (props: any) => {
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const propsMessage = props.fieldError?.message
        if (propsMessage && propsMessage !== errorMessage) {
            setErrorMessage(propsMessage)
        }
    }, [errorMessage, props.fieldError])

    return (
        <TextField 
            sx={props.style ? props.style : { width: "100%" }}
            label={props.label}
            variant="standard"
            onChange={props.onChange}
            select
            value={props.value}
        >
            <MenuItem value={ModelType.CRISP}>Crisp</MenuItem>
            <MenuItem value={ModelType.FUZZY}>Fuzzy</MenuItem>
        </TextField>
    )
}

export default ModelTypeSelect;
