import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface ConfirmationPopupProperties {
    title?: String
    message: String,
    modalOpen: boolean,
    onConfirm: () => void
    onCancel: () => void
}

export const ConfirmationDialog = (props: ConfirmationPopupProperties) => {
    const {title, message, modalOpen, onConfirm, onCancel } = props

    return (
    <Dialog open={modalOpen} onClose={onCancel}>
      <DialogTitle>{title ?? "Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} autoFocus>Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};