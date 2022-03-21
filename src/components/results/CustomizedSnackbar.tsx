import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useEffect, useState } from 'react';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CustomizedSnackbarProps {
    message: string
    onSnackbarClose: () => void
}

const CustomizedSnackbar = (props: CustomizedSnackbarProps) => {
    const { message, onSnackbarClose} = props
    const [open, setOpen] = useState(message !== "")
    const [alertMessage, setAlertMessage] = useState(message)

    useEffect(() => {
        if (alertMessage !== message) {
            setOpen(message !== "");
            setAlertMessage(message)
        }
    }, [message, alertMessage])

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
        onSnackbarClose()
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
    );
}

export default CustomizedSnackbar;