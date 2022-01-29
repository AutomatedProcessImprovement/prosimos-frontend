import {useState} from 'react';
import { Grid, Paper, Typography } from "@mui/material";
import FileUploader from './FileUploader';

const Upload = () => {
    const [selectedBpmnFile, setSelectedBpmnFile] = useState<any>();
    const [selectedJsonFile, setSelectedJsonFile] = useState<any>();

    const onBpmnFileChange = (file: any) => {
        setSelectedBpmnFile(file);
        console.log(file)
    };

    const onJsonFileChange = (file: any) => {
        setSelectedJsonFile(file);
    };

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <Typography variant="h6">
                    Prosimos
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} >
                        <Paper elevation={5} sx={{ p: 3}}>
                            <FileUploader
                                ext="bpmn"
                                onFileChange={onBpmnFileChange}
                            />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={5} sx={{ p: 3}}>
                            <FileUploader
                            ext="json"
                            onFileChange={onJsonFileChange} 
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Upload;