import { Button, ButtonGroup, createStyles, Grid, Theme } from "@mui/material";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { useLocation, useNavigate } from "react-router-dom";
import ResourceUtilization from "./ResourceUtilization";
import ScenarioStatistics from "./ScenarioStatistics";
import TaskStatistics from "./TaskStatistics";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useEffect, useState } from "react";
import axios from './../../axios';
import CustomizedSnackbar from "./CustomizedSnackbar";
import paths from "../../router/paths";

const styles = (theme: Theme) => createStyles({
    resultsGrid: {
        marginTop: "2vh!important"
    }
})

interface SimulationResult {
    "Resource Utilization": any,
    "Individual Task Statistics": any,
    "Overall Scenario Statistics": any,
    "LogFileName": string
}

interface ResultLocationState {
    output: SimulationResult
    modelFile: Blob,
    scenarioProperties: Blob
}

type SimulationResultsProps = WithStyles<typeof styles>

const SimulationResults = (props: SimulationResultsProps) => {
    const { classes } = props
    const navigate = useNavigate()
    const { state } = useLocation()
    const { output, modelFile, scenarioProperties } = state as ResultLocationState
    const [logFileName, setLogFileName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        setLogFileName(output["LogFileName"])
    }, [output]);

    const onLogFileDownload = () => {
        axios
            .get(`/api/file?filePath=${logFileName}`)
            .then((data: any) => {
                const mimeType = "text/csv"
                const blob = new Blob([data.data], { type: mimeType })
                const url = URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.download = "logs"
                link.href = url

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            })
            .catch((error: any) => {
                console.log(error.response)
                setErrorMessage(error.response.data.displayMessage)
            })
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
    };

    const onEditScenario = () => {
        navigate(paths.SIMULATOR_PARAMS_PATH, {
            state: {
                bpmnFile: modelFile,
                jsonFile: scenarioProperties
            }
        })
    };

    const onUploadNewModel = () => {
        navigate(paths.SIMULATOR_UPLOAD_PATH)
    };

    return (<>
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={2}
            className={classes.resultsGrid}
        >
            <Grid container item xs={10}>
                <Grid item xs={6} justifyContent="flex-start">
                    <ButtonGroup>
                        <Button
                            onClick={onEditScenario}
                        >Edit scenario</Button>
                        <Button
                            onClick={onUploadNewModel}
                        >Upload new model</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item container xs={6} justifyContent="flex-end">
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        onClick={onLogFileDownload}
                        size="small"
                    >
                        Download logs
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={10}>
                <TaskStatistics
                    data={output["Individual Task Statistics"]}
                />
            </Grid>
            <Grid item xs={10}>
                <ResourceUtilization
                    data={output["Resource Utilization"]}
                />
            </Grid>
            <Grid item xs={10}>
                <ScenarioStatistics
                    data={output["Overall Scenario Statistics"]}
                />
            </Grid>
        </Grid>
        <CustomizedSnackbar
            message={errorMessage}
            onSnackbarClose={onSnackbarClose}
        />
    </>)
}

export default withStyles(styles)(SimulationResults);
