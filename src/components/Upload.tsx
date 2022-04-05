import { useState } from 'react';
import { Button, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';
import paths from '../router/paths'
import CustomizedSnackbar from './results/CustomizedSnackbar';
import CustomDropzoneArea from './upload/CustomDropzoneArea';

enum Source {
    empty,
    existing,
    logs
} 

const Upload = () => {
    const [selectedBpmnFile, setSelectedBpmnFile] = useState<any>();
    const [selectedJsonFile, setSelectedJsonFile] = useState<any>();
    const [simParamsSource, setSimParamsSource] = useState<Source>(Source.empty);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate()

    const onJsonFileChange = (file: any) => {
        setSelectedJsonFile(file)
        setSimParamsSource(Source.existing)
    };

    const isNeededFileProvided = () => {
        const isBpmnFileProvided = (selectedBpmnFile)
        let isJsonFileValidInput = false
        switch(simParamsSource) {
            case Source.empty:
                isJsonFileValidInput = true
                break;
            case Source.existing:
                // if json file is provided, we treat it as valid
                isJsonFileValidInput = selectedJsonFile
                break;                
        }

        if (!isBpmnFileProvided || !isJsonFileValidInput) {
            setErrorMessage("Please provide the correct selection for the files")
            return false
        }

        return true
    };

    const onContinueClick = () => {
        if (!isNeededFileProvided()){
            return
        }

        navigate(paths.SIMULATOR_PARAMS_PATH, {
            state: {
                bpmnFile: selectedBpmnFile,
                jsonFile: selectedJsonFile
            }
        })
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
                                                        ext="json"
                                                        onFileChange={onJsonFileChange}
                                                        showHeader={false}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <FormControlLabel disabled value={Source.logs} control={<Radio />} label="Generate the simulation parameters based on logs" />
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
                    <Button
                        variant="contained"
                        onClick={onContinueClick}>
                        Continue
                    </Button>
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