import { useState } from 'react';
import { Grid, Typography, Input, Button } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploaderProps {
    startId: string
    ext?: string
    onFileChange: (file: any) => void
    showHeader: boolean
}

const FileUploader = (props: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<any>();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const onFileChange = (event: any) => {
        const selectedFile = event.target.files[0]
        setSelectedFile(selectedFile)
        setIsFilePicked(true)
        props.onFileChange(selectedFile)
    };
    
    return (<>
        {props.showHeader && <Grid>
            <Typography variant="body1">
                {`Add a .${props.ext} file`}
            </Typography>
        </Grid>}
        <Grid>
            <label htmlFor={props.startId + "-file"}>
                <Input
                    type="file"
                    inputProps={props.ext !== undefined ? { accept: props.ext } : {}}
                    style={{ display: 'none' }}
                    id={props.startId + "-file"}
                    onChange={onFileChange}
                />
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadFileIcon />}>
                    Choose File
                </Button>
            </label>
        </Grid>
        {
            isFilePicked && (
                <Grid>
                    <p>Loaded file: {selectedFile && selectedFile.name}</p>
                </Grid>
            )
        }
    </>)
}

export default FileUploader;