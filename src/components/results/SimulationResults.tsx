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
    "ResourceUtilization": any,
    "IndividualTaskStatistics": any,
    "OverallScenarioStatistics": any,
    "LogsFilename": string
    "StatsFilename": string
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
    const [logsFilename, setLogsFilename] = useState("")
    const [statsFilename, setStatsFilename] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        setLogsFilename(output["LogsFilename"])
        setStatsFilename(output["StatsFilename"])
    }, [output]);

    const onLogFileDownload = () => {
        downloadSimulationFile(logsFilename)
    };

    const onStatsDownload = () => {
        downloadSimulationFile(statsFilename)
    };

    const downloadSimulationFile = (filename: string) => {
        axios
            .get(`/api/simulationFile?fileName=${filename}`)
            .then((data: any) => {
                const mimeType = "text/csv"
                const blob = new Blob([data.data], { type: mimeType })
                const url = URL.createObjectURL(blob)

                const link = document.createElement('a')
                const category = filename.split("_")[0]
                link.download = category
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
                    <ButtonGroup>
                        <Button
                            variant="outlined"
                            startIcon={<FileDownloadIcon />}
                            onClick={onStatsDownload}
                            size="small"
                        >
                            Download stats
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<FileDownloadIcon />}
                            onClick={onLogFileDownload}
                            size="small"
                        >
                            Download logs
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Grid item xs={10} className={classes.resultsGrid}>
                <TaskStatistics
                    data={output["IndividualTaskStatistics"]}
                />
            </Grid>
            <Grid item xs={10} className={classes.resultsGrid}>
                <ResourceUtilization
                    data={output["ResourceUtilization"]}
                />
            </Grid>
            <Grid item xs={10} className={classes.resultsGrid}>
                <ScenarioStatistics
                    data={output["OverallScenarioStatistics"]}
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
