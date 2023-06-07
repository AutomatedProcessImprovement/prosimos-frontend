import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

interface CalendarFuzzyGranuleDialogProps {
    modalOpen: boolean
    onCancel: () => void
    onConfirm: (timeUnit: string, timeValue: number) => void
    title?: string
    message: string
    isDialogTextShown?: boolean
    currentTimeUnit?:string
    currentTimeValue?:number
}

const CalendarFuzzyGranuleDialog = (props: CalendarFuzzyGranuleDialogProps) => {
    const {currentTimeUnit, currentTimeValue} = props

    const [timeUnit, setTimeUnit] = useState<string>(currentTimeUnit || "seconds");
    const [timeValue, setTimeValue] = useState<number>(currentTimeValue || 1);

    const {message, modalOpen, onCancel, onConfirm } = props
    const [title, setTitle] = useState<string>()
    const [isDialogContentTextShown, setIsDialogContentTextShown] = useState(true)

    const onTimeUnitChange = (event:any) => {
        setTimeUnit(event.target.value)
    }

    useEffect(() => {
        if (props.title !== undefined && title !== props.title) {
            setTitle(props.title)
        }
    }, [props.title, title])

    useEffect(() => {
        if (props.isDialogTextShown !== undefined && isDialogContentTextShown !== props.isDialogTextShown) {
            setIsDialogContentTextShown(props.isDialogTextShown)
        }
    }, [props.isDialogTextShown, isDialogContentTextShown])

    return (
        <Dialog open={modalOpen} onClose={onCancel} fullWidth maxWidth="sm">
            <DialogTitle>{title ?? "Confirmation"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogContent>          
                <Select
                    label="Select time unit"
                    value={timeUnit}
                    variant="standard"
                    required
                    fullWidth
                    onChange={onTimeUnitChange}
                    >
                    <MenuItem value="seconds">Seconds</MenuItem>
                    <MenuItem value="minutes">Minutes</MenuItem>
                    <MenuItem value="hours">Hours</MenuItem>
                </Select>
            <DialogContent>
            </DialogContent>
                <TextField
                    label="Time value"
                    type="number"
                    value={timeValue}
                    inputProps={{
                        step: "1",
                        min: "1",
                    }}  
                    variant="standard"
                    required
                    autoFocus
                    fullWidth
                    onChange={(e) => setTimeValue(parseInt(e.target.value))}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={() => onConfirm(timeUnit, timeValue)}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CalendarFuzzyGranuleDialog;