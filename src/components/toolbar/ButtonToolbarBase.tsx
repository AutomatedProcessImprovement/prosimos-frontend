import { Button } from "@mui/material";

interface ButtonToolbarBaseProps {
    onClick: () => void
    labelName: string
    startIcon: React.ReactNode
}

const ButtonToolbarBase = (props: ButtonToolbarBaseProps) => {
    return (
        <Button
            variant="outlined"
            startIcon={props.startIcon}
            onClick={props.onClick}
            size="small"
        >
            {props.labelName}
        </Button>
    )
}

export default ButtonToolbarBase;