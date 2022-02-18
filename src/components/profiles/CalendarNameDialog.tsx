import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

interface CalendarNameDialogProps {
    modalOpen: boolean
    handleClose: () => void
    handleSubmit: (name: string) => void
}

const CalendarNameDialog = (props: CalendarNameDialogProps) => {
    const [name, setName] = useState<string>("");
    const {modalOpen, handleClose, handleSubmit } = props

    return (
        <Dialog open={modalOpen} onClose={handleClose}>
            <DialogTitle>Modify Calendar</DialogTitle>
            <DialogContent>
            <DialogContentText>
                You have changed the time periods for the existing calendar. Please, provide a name for the newly created calendar
                based on the filled time periods.
            </DialogContentText>
            <TextField
                autoFocus
                label="Calendar Name"
                fullWidth
                variant="standard"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => handleSubmit(name)}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CalendarNameDialog;