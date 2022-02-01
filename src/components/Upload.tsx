import {useState} from 'react';
import { Button, Grid, Paper, Typography } from "@mui/material";
import FileUploader from './FileUploader';
import { useNavigate } from 'react-router-dom';
import paths from '../router/paths'

const Upload = () => {
    const [selectedBpmnFile, setSelectedBpmnFile] = useState<any>();
    const [selectedJsonFile, setSelectedJsonFile] = useState<any>();

    const navigate = useNavigate()

    const onBpmnFileChange = (file: any) => {
        setSelectedBpmnFile(file);
    };

    const onJsonFileChange = (file: any) => {
        setSelectedJsonFile(file);
    };

    const onContinueClick = () => {
        navigate(paths.SIMULATOR_PARAMS_PATH, {
            state: {
                bpmnFile: selectedBpmnFile,
                jsonFile: selectedJsonFile
            }
        })
    }

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={3}>
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
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={5} sx={{ p: 3, minHeight: '12vw' }}>
                            <FileUploader
                            ext="json"
                            onFileChange={onJsonFileChange} 
                            />
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