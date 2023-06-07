import { MenuItem, TextField } from "@mui/material";
import { ModelType } from "./ModelType";

interface ModelTypeSelectProps {
    label: string,
    value: ModelType
    onChange: (event:any) => void
    style?:any
}

const ModelTypeSelect = (props: ModelTypeSelectProps) => {
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
