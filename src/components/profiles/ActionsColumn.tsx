import { Grid, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface ActionsColumnProps {
    onViewCalendarClick: () => void
    onDeleteClick: () => void
}

const ActionsColumn = (props: ActionsColumnProps) => {
    const { onViewCalendarClick, onDeleteClick } = props
    return (
        <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item xs={6} >
                <Tooltip title="View calendar group">
                    <IconButton
                        size="small"
                        onClick={onViewCalendarClick}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item xs={6}>
                <Tooltip title="Delete">
                    <IconButton
                        size="small"
                        onClick={onDeleteClick}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    )
}

export default ActionsColumn;