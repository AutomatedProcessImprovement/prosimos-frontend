import { useEffect, useRef } from 'react';
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
import { Paper } from '@mui/material';

interface ModelViewerProps {
    xmlData: any
}

const BPMNModelViewer = (props: ModelViewerProps) => {
    const { xmlData } = props
    const modelViewerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const bpmnViewer = new BpmnViewer({
            container: "#canvas"
        })
        bpmnViewer.importXML(xmlData)
        const canvas = bpmnViewer.get('canvas')
        canvas.zoom('fit-viewport')
    }, [modelViewerRef, xmlData])

    return (
        <Paper elevation={5} sx={{ p:2 }} style={{ width: "100%" }}>
            <div id="canvas" ref={modelViewerRef} style={{ width: "100%", height: "70vh" }}></div>
        </Paper>
    )
}

export default BPMNModelViewer;
