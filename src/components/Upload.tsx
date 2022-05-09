import { useState } from 'react';
import { FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';
import paths from '../router/paths'
import CustomizedSnackbar from './results/CustomizedSnackbar';
import CustomDropzoneArea from './upload/CustomDropzoneArea';
import axios from '../axios';
import { LoadingButton } from '@mui/lab';

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
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate()

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

    const updateErrorMessage = (text: string) => {
        setLoading(false)
        setErrorMessage(text)
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
            updateErrorMessage("Please provide the correct selection for the files")
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
            // call API to get json params
            const formData = new FormData()
            formData.append("logsFile", selectedLogsFile as Blob)
            formData.append("bpmnFile", selectedBpmnFile as Blob)

            axios.post(
                '/api/parameters',
                formData)
                .then(((res: any) => {
                    const jsonString = JSON.stringify(res.data)
                    var blob = new Blob([jsonString], { type: "application/json" })
                    const discoveredParamsFile = new File([blob], "name", { type: "application/json" })

                    navigate(paths.SIMULATOR_PARAMS_PATH, {
                        state: {
                            bpmnFile: selectedBpmnFile,
                            jsonFile: discoveredParamsFile,
                        }
                    })
                }))
                .catch((error: any) => {
                    updateErrorMessage(error.response.data.displayMessage || "Something went wrong")
                })
        } else {
            navigate(paths.SIMULATOR_PARAMS_PATH, {
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
        updateErrorMessage("")
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
                        Continue
                    </LoadingButton>
                </Grid>
            </Grid>
            <CustomizedSnackbar
                message={errorMessage}
                onSnackbarClose={onSnackbarClose}
            />
        </>
    );
}

export default Upload;