import { useState } from 'react';
import { Button, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';
import paths from '../router/paths'

enum Source {
    empty,
    existing,
    logs
} 

const Upload = () => {
    const [selectedBpmnFile, setSelectedBpmnFile] = useState<any>();
    const [selectedJsonFile, setSelectedJsonFile] = useState<any>();
    const [simParamsSource, setSimParamsSource] = useState<Source>(Source.empty);

    const navigate = useNavigate()

    const onBpmnFileChange = (file: any) => {
        setSelectedBpmnFile(file)
    };

    const onJsonFileChange = (file: any) => {
        setSelectedJsonFile(file)
        setSimParamsSource(Source.existing)
    };

    const onContinueClick = () => {
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

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={3} className="UploadContainer">
            <Grid item xs={12}>
                <Typography variant="h6">
                    Prosimos
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} >
                        <Paper elevation={5} sx={{ p: 3, minHeight: '12vw' }}>
                            <FileUploader
                                ext="bpmn"
                                onFileChange={onBpmnFileChange}
                                showHeader={true}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={5} sx={{ p: 3, minHeight: '12vw' }}>
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
    );
}

export default Upload;