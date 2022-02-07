import { Toolbar, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface AddButtonToolbarProps {
    onClick: () => void
    labelName: string
}

const AddButtonToolbar = (props: AddButtonToolbarProps) => {
    return (
        <Toolbar sx={{ justifyContent: "flex-end", marginLeft: "auto" }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={props.onClick} size="small">
                {props.labelName}
            </Button>
        </Toolbar>
    )
}

export default AddButtonToolbar;