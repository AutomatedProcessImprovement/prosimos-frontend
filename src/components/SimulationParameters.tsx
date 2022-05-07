import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { Button, ButtonGroup, Grid, Step, StepButton, Stepper } from '@mui/material';
import { ScenarioProperties } from './formData';
import AllGatewaysProbabilities from './gateways/AllGatewaysProbabilities';
import ResourcePools from './ResourcePools';
import ResourceCalendars from './ResourceCalendars';
import ResourceAllocation from './resource_allocation/ResourceAllocation';
import BPMNModelViewer from './model/BPMNModelViewer';
import CaseCreation from './caseCreation/CaseCreation';
import useBpmnFile from './simulationParameters/useBpmnFile';
import useJsonFile from './simulationParameters/useJsonFile';
import useFormState from './simulationParameters/useFormState';
import CustomizedSnackbar from './results/CustomizedSnackbar';
import SubmitStep from './SubmitStep';

const tabs_name = {
    CASE_CREATION: "Case Creation",
    RESOURCE_CALENDARS: "Resource Calendars",
    RESOURCES: "Resources",
    RESOURCE_ALLOCATION: "Resource Allocation",
    BRANCHING_PROB: "Branching Probabilities",
    PROCESS_MODEL: "Process Model",
    SUBMIT: "Submit"
}

interface LocationState {
    bpmnFile: File
    jsonFile: File
}

const fromContentToBlob = (values: any) => {
    const content = JSON.stringify(values)
    const blob = new Blob([content], { type: "text/plain" })
    return blob
};

const SimulationParameters = () => {
    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            num_processes: 10,
            start_date: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ")
        }
    })

    const [activeStep, setActiveStep] = useState(0)
    const [fileDownloadUrl, setFileDownloadUrl] = useState("")
    const [errorSnack, setErrorSnack] = useState("")
    const linkDownloadRef = useRef<HTMLAnchorElement>(null)

    const { state } = useLocation()
    const { bpmnFile, jsonFile } = state as LocationState
    const { xmlData, tasksFromModel, gateways } = useBpmnFile(bpmnFile)
    const { jsonData } = useJsonFile(jsonFile)

    const { formState } = useFormState(tasksFromModel, gateways, jsonData)
    const { formState: { errors, isValid, isSubmitted, submitCount }, getValues } = formState
    
    useEffect(() => {
        if (isSubmitted && !isValid) {
            setErrorMessage("There are validation errors")
        }
    }, [isValid, isSubmitted, submitCount, errors])

    const handleStep = (index: number) => () => {
        setActiveStep(index)
    };

    const setErrorMessage = (value: string) => {
        setErrorSnack(value)
    };

    useEffect(() => {
        if (fileDownloadUrl !== "" && fileDownloadUrl !== undefined) {
            linkDownloadRef.current?.click()
            URL.revokeObjectURL(fileDownloadUrl);
        }
    }, [fileDownloadUrl]);

    const onDownload = () => {
        const blob = fromContentToBlob(getValues())
        const fileDownloadUrl = URL.createObjectURL(blob);
        setFileDownloadUrl(fileDownloadUrl)
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
    };

    const getStepContent = (index: number) => {
        switch (index) {
            case 0:
                return <CaseCreation
                    scenarioFormState={scenarioState}
                    jsonFormState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case 1:
                return <ResourceCalendars
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case 2:
                return <ResourcePools
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case 3:
                return <ResourceAllocation
                    tasksFromModel={tasksFromModel}
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case 4:
                return <AllGatewaysProbabilities
                    formState={formState}
                    gateways={gateways}
                />
            case 5:
                return <BPMNModelViewer
                    xmlData={xmlData}
                />
            case 6:
                return <SubmitStep
                    formState={formState}
                    scenarioState={scenarioState}
                    setErrorMessage={setErrorMessage}
                    bpmnFile={bpmnFile}
                />
        }
    };

    return (
        <form>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={9}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="center">
                            <ButtonGroup variant="outlined">
                                <Button
                                    type="button"
                                    onClick={(_e) => onDownload()}
                                >Download as a .json</Button>
                                <a
                                    style={{ display: "none" }}
                                    download={"json-file-name.json"}
                                    href={fileDownloadUrl}
                                    ref={linkDownloadRef}
                                >Download json</a>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} mt={2}>
                        <Stepper nonLinear activeStep={activeStep}>
                            {Object.values(tabs_name).map((label, index) => (
                                <Step key={label}>
                                    <StepButton color="inherit" onClick={handleStep(index)}>
                                        {label}
                                    </StepButton>
                                </Step>
                            ))}
                        </Stepper>
                        <Grid container mt={3}>
                            {getStepContent(activeStep)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <CustomizedSnackbar
                message={errorSnack}
                onSnackbarClose={onSnackbarClose}
            />
        </form>
    );
}

export default SimulationParameters;