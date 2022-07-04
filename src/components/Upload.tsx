import { useState, useEffect } from 'react';
import { AlertColor, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';
import paths from '../router/paths'
import CustomizedSnackbar from './results/CustomizedSnackbar';
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import axios from '../axios';
import { LoadingButton } from '@mui/lab';
import { useInterval } from 'usehooks-ts'

enum Source {
    empty,
    existing,
    logs
}

const Upload = () => {
    const [selectedBpmnFile, setSelectedBpmnFile] = useState<File | null>(null);
    const [selectedParamFile, setSelectedParamFile] = useState<File | null>(null);
    const [selectedLogsFile, setSelectedLogsFile] = useState<File | null>(null);
    const [simParamsSource, setSimParamsSource] = useState<Source>(Source.empty);
    const [snackMessage, setSnackMessage] = useState("");
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)
    const [loading, setLoading] = useState(false);
    const [isPollingEnabled, setIsPollingEnabled] = useState(false)
    const [pendingTaskId, setPendingTaskId] = useState("")
    const [discoveredFileName, setDiscoveredFileName] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        axios
            .get(`/api/simulationFile?fileName=${discoveredFileName}`)
            .then((result: any) => {
                const jsonString = JSON.stringify(result.data)
                var blob = new Blob([jsonString], { type: "application/json" })
                const discoveredParamsFile = new File([blob], "name", { type: "application/json" })

                navigate(paths.SIMULATOR_SCENARIO_PATH, {
                    state: {
                        bpmnFile: selectedBpmnFile,
                        jsonFile: discoveredParamsFile,
                    }
                })
            })
    }, [discoveredFileName])

    useInterval(
        () => {
            axios
                .get(`/api/task?taskId=${pendingTaskId}`)
                .then((result: any) => {
                    const dataJson = result.data
                    if (dataJson.TaskStatus === "SUCCESS") {
                        setIsPollingEnabled(false)

                        const taskResponseJson = dataJson.TaskResponse
                        setDiscoveredFileName(taskResponseJson['discovery_res_filename'])
                        setLoading(false)
                    }
                })
                .catch((error: any) => {
                    console.log(error)
                    console.log(error.response)
                    setErrorMessage(error.response.data.displayMessage || "Something went wrong")
                })
        },
        isPollingEnabled ? 3000 : null
    );

    const onJsonFileChange = (file: File) => {
        setSelectedParamFile(file)
        setSimParamsSource(Source.existing)

        // clear an alternative option
        if (selectedLogsFile !== undefined) {
            setSelectedLogsFile(null)
        }
    };

    const onLogFileChange = (file: File) => {
        setSelectedLogsFile(file)
        setSimParamsSource(Source.logs)

        // clear an alternative option
        if (selectedParamFile !== undefined) {
            setSelectedParamFile(null)
        }
    };

    const setInfoMessage = (value: string) => {
        updateSnackMessage(value)
        setSnackColor("info")
    };

    const setErrorMessage = (value: string) => {
        updateSnackMessage(value)
        setSnackColor("error")
    };

    const updateSnackMessage = (text: string) => {
        setSnackMessage(text)
    };

    // validate that selected option and appropriate file selection matches
    // or that empty option selected (the one that doesn't require file)
    const isNeededFileProvided = () => {
        const isBpmnFileProvided = !!selectedBpmnFile
        let isJsonFileValidInput = false

        switch (simParamsSource) {
            case Source.empty:
                isJsonFileValidInput = true
                break;
            case Source.existing:
                isJsonFileValidInput = !!selectedParamFile
                break;
            case Source.logs:
                isJsonFileValidInput = !!selectedLogsFile
                break;
        }

        if (!isBpmnFileProvided || !isJsonFileValidInput) {
            updateSnackMessage("Please provide the correct selection for the files")
            return false
        }

        return true
    };

    const onContinueClick = () => {
        setLoading(true)

        if (!isNeededFileProvided()) {
            return
        }

        if (simParamsSource === Source.logs) {
            setInfoMessage("Discovery started...")

            // call API to get json params
            const formData = new FormData()
            formData.append("logsFile", selectedLogsFile as Blob)
            formData.append("bpmnFile", selectedBpmnFile as Blob)

            axios.post(
                '/api/discovery',
                formData)
                .then(((result: any) => {
                    const dataJson = result.data
                    if (dataJson.TaskId) {
                        setIsPollingEnabled(true)
                        setPendingTaskId(dataJson.TaskId)
                    } else {

                    }
                }))
                .catch((error: any) => {
                    console.log(error)
                    updateSnackMessage(error?.response?.data?.displayMessage || "Something went wrong")
                    setLoading(false)
                    onSnackbarClose()
                })
        } else {
            navigate(paths.SIMULATOR_SCENARIO_PATH, {
                state: {
                    bpmnFile: selectedBpmnFile,
                    jsonFile: selectedParamFile,
                }
            })
        }
    };

    const onSimParamsSourceChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
        const newSourceId = parseInt(value)
        setSimParamsSource(newSourceId)

        // on option change, remove the previously selected files
        if (Source[newSourceId] === Source[Source.empty]) {
            setSelectedLogsFile(null)
            setSelectedParamFile(null)
        } else if (Source[newSourceId] === Source[Source.logs]) {
            setSelectedParamFile(null)
        } else {
            setSelectedLogsFile(null)
        }
    };

    const onSnackbarClose = () => {
        updateSnackMessage("")
    };

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={4} style={{ paddingTop: '10px' }} className="centeredContent">
                <Grid item xs={9}>
                    <Grid item>
                        <Typography variant="subtitle1">
                            To run a simulation, upload a process model and a simulation scenario.
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" align="left">
                                            Process Model
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomDropzoneArea
                                            acceptedFiles={[".bpmn"]}
                                            setSelectedBpmnFile={setSelectedBpmnFile}
                                            setErrorMessage={setErrorMessage}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6} className="simulationScenarioContainer">
                            <Paper elevation={5} sx={{ p: 3, minHeight: '30vw' }}>
                                <Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" align="left">
                                            Simulation Scenario
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioGroup
                                            value={simParamsSource}
                                            onChange={onSimParamsSourceChange}
                                        >
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel value={Source.empty} control={<Radio />} label="Create a simulation scenario manually" />
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel value={Source.existing} control={<Radio />} label="Upload a simulation scenario" />
                                                    <FileUploader
                                                        file={selectedParamFile}
                                                        startId="existing_params_file"
                                                        ext=".json"
                                                        onFileChange={onJsonFileChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel value={Source.logs} control={<Radio />} label="Discover a simulation scenario from the log" />
                                                    <FileUploader
                                                        file={selectedLogsFile}
                                                        startId="logs_file"
                                                        ext=".xes, .csv"
                                                        onFileChange={onLogFileChange}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <LoadingButton
                        variant="contained"
                        onClick={onContinueClick}
                        loading={loading}
                    >
                        Specify Scenario Parameters
                    </LoadingButton>
                </Grid>
            </Grid>
            {snackMessage && <CustomizedSnackbar
                message={snackMessage}
                onSnackbarClose={onSnackbarClose}
                severityLevel={snackColor}
            />}
        </>
    );
}

export default Upload;
