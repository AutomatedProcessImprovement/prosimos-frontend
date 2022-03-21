import { Button, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import ResourceUtilization from "./ResourceUtilization";
import ScenarioStatistics from "./ScenarioStatistics";
import TaskStatistics from "./TaskStatistics";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useEffect, useState } from "react";
import axios from 'axios';
import CustomizedSnackbar from "./CustomizedSnackbar";

interface SimulationResultsProps {

}

interface SimulationResult {
    "Resource Utilization": any,
    "Individual Task Statistics": any,
    "Overall Scenario Statistics": any,
    "LogFileName": string
}

interface ResultLocationState {
    output: SimulationResult
}

const SimulationResults = (props: SimulationResultsProps) => {
    const { state } = useLocation()
    const { output } = state as ResultLocationState
    const [logFileName, setLogFileName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        setLogFileName(output["LogFileName"])
    }, [output]);

    const onLogFileDownload = () => {
        axios
            .get(`http://localhost:5000/file?filePath=${logFileName}`)
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

    return (<>
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={2}
        >
            <Grid item container xs={8}>
                <Grid item xs={2}>
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
            <Grid item xs={8}>
                <TaskStatistics
                    data={output["Individual Task Statistics"]}
                />
            </Grid>
            <Grid item xs={8}>
                <ResourceUtilization
                    data={output["Resource Utilization"]}
                />
            </Grid>
            <Grid item xs={8}>
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

export default SimulationResults;