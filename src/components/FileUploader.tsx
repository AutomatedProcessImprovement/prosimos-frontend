import { useRef, useState } from 'react';
import { Grid, Input, Button } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useEffect } from 'react';

interface FileUploaderProps {
    file: File | null
    startId: string
    ext?: string
    onFileChange: (file: any) => void
}

const FileUploader = (props: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(props.file)
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (props.file !== selectedFile) {
            setSelectedFile(props.file)
            if (props.file === null && inputRef.current) {
                inputRef.current.value = ""
            }
        }
    }, [props.file]);

    const onFileChange = (event: any) => {
        const selectedFile = event.target.files[0]
        setSelectedFile(selectedFile)
        props.onFileChange(selectedFile)
    };
    
    return (<Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12} className="uploadContainer">
            <label htmlFor={props.startId}>
                <Input
                    inputRef={inputRef}
                    type="file"
                    inputProps={props.ext !== undefined ? { accept: props.ext } : {}}
                    style={{ display: 'none' }}
                    id={props.startId}
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
            (selectedFile !== null && selectedFile !== undefined) && (
                <Grid xs={12} className="uploadContainer">
                    <p>Uploaded file: {selectedFile && selectedFile.name}</p>
                </Grid>
            )
        }
    </Grid>)
}

export default FileUploader;