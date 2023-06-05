import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

interface CalendarFuzzyGranuleDialogProps {
    modalOpen: boolean
    onCancel: () => void
    onConfirm: (timeUnit: string, timeValue: number) => void
    title?: string
    message: string
    isDialogTextShown?: boolean
}

const CalendarFuzzyGranuleDialog = (props: CalendarFuzzyGranuleDialogProps) => {
    const [timeUnit, setTimeUnit] = useState<string>("seconds");
    const [timeValue, setTimeValue] = useState<number>(1);

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
                fullWidth
                value={timeUnit}
                onChange={onTimeUnitChange}
                >
                <MenuItem value="seconds">Seconds</MenuItem>
                <MenuItem value="minutes">Minutes</MenuItem>
                <MenuItem value="hours">Hours</MenuItem>
            </Select>
            <DialogContent>
            </DialogContent>

            <TextField
                autoFocus
                label="Time value"
                type="number"
                required
                fullWidth
                variant="standard"
                value={timeValue}
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