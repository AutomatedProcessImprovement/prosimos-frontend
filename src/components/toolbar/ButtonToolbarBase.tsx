import { Button } from "@mui/material";

interface ButtonToolbarBaseProps {
    onClick: () => void
    labelName: string
    startIcon: React.ReactNode
    variant: "text" | "outlined"
}

const ButtonToolbarBase = (props: ButtonToolbarBaseProps) => {
    return (
        <Button
            variant={props.variant}
            startIcon={props.startIcon}
            onClick={props.onClick}
            size="small"
        >
            {props.labelName}
        </Button>
    )
}

export default ButtonToolbarBase;