import { Grid, Typography } from "@mui/material";

const NoEventsCard = () => {
    return (
        <Grid item xs={12} sx={{ mt: 5 }}>
            <Typography key={"noEventsTypo"} variant="h6" align="center">
                No intermediate events defined in the BPMN model
            </Typography>
        </Grid>
    )
}

export default NoEventsCard;