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
    const [selectedBpmnFile, setSelectedBpmnFile] = useState<File>();
    const [selectedParamFile, setSelectedParamFile] = useState<File>();
    const [selectedLogsFile, setSelectedLogsFile] = useState<File>();
    const [simParamsSource, setSimParamsSource] = useState<Source>(Source.empty);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate()

    const onJsonFileChange = (file: File) => {
        setSelectedParamFile(file)
        setSimParamsSource(Source.existing)
        // clear an alternative option
        if (selectedLogsFile !== undefined) {
            setSelectedLogsFile(file)
        }
    };

    const onLogFileChange = (file: File) => {
        setSelectedLogsFile(file)
        setSimParamsSource(Source.logs)
        // clear an alternative option
        if (selectedParamFile !== undefined) {
            setSelectedParamFile(file)
        }
    };

    const isNeededFileProvided = () => {
        const isBpmnFileProvided = !!selectedBpmnFile
        let isJsonFileValidInput = false
        switch(simParamsSource) {
            case Source.empty:
                isJsonFileValidInput = true
                break;
            case Source.existing:
                // if json file is provided, we treat it as valid
                isJsonFileValidInput = !!selectedParamFile
                break;
            case Source.logs:
                isJsonFileValidInput = !!selectedLogsFile
                break;
        }

        if (!isBpmnFileProvided || !isJsonFileValidInput) {
            setErrorMessage("Please provide the correct selection for the files")
            return false
        }

        return true
    };

    const onContinueClick = () => {
        setLoading(true)

        if (!isNeededFileProvided()){
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
                console.log(error.response)
                setErrorMessage(error.response.data.displayMessage)
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
        setSimParamsSource(parseInt(value))
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
    };

    return (
        <>
            <Grid container alignItems="center" justifyContent="center" spacing={3} className="UploadContainer">
                <Grid item xs={12}>
                    <Typography variant="h6">
                        Prosimos
                    </Typography>
                </Grid>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} >
                            <Paper elevation={5} sx={{ p: 3, minHeight: '25vw' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" align="left">
                                            Upload your .BPMN file
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

                        <Grid item xs={12} md={6}>
                            <Paper elevation={5} sx={{ p: 3, minHeight: '25vw' }}>
                                <Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" align="left">
                                            Configure simulation parameters
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RadioGroup
                                            value={simParamsSource}
                                            onChange={onSimParamsSourceChange}
                                        >
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel value={Source.empty} control={<Radio />} label="Load simulation parameters from scratch" />
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel value={Source.existing} control={<Radio />} label="Use existing simulation parameters" />
                                                    <FileUploader
                                                        startId="existing_params_file"
                                                        ext=".json"
                                                        onFileChange={onJsonFileChange}
                                                        showHeader={false}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel value={Source.logs} control={<Radio />} label="Generate the simulation parameters based on logs" />
                                                    <FileUploader
                                                        startId="logs_file"
                                                        ext=".xes, .csv"
                                                        onFileChange={onLogFileChange}
                                                        showHeader={false}
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