import { useState } from 'react';
import { Grid, Typography, Input, Button } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploaderProps {
    ext: string
    onFileChange: (file: any) => void
    showHeader: boolean
}

const FileUploader = (props: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<any>();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const onFileChange = (event: any) => {
        const selectedFile = event.target.files[0]
        setSelectedFile(selectedFile);
        setIsFilePicked(true);
        props.onFileChange(selectedFile)
    };
    
    return (<>
        {props.showHeader && <Grid>
            <Typography variant="body1">
                {`Add a .${props.ext} file`}
            </Typography>
        </Grid>}
        <Grid>
            <label htmlFor={props.ext + "-file"}>
                <Input
                    type="file"
                    inputProps={{ accept: `.${props.ext}` }}
                    style={{ display: 'none' }}
                    id={props.ext + "-file"}
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