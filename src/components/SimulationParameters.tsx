import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import axios from './../axios';
import { Button, ButtonGroup, Grid, Step, StepButton, Stepper } from '@mui/material';
import { JsonData, ScenarioProperties } from './formData';
import AllGatewaysProbabilities from './gateways/AllGatewaysProbabilities';
import ResourcePools from './ResourcePools';
import ResourceCalendars from './ResourceCalendars';
import ResourceAllocation from './resource_allocation/ResourceAllocation';
import BPMNModelViewer from './model/BPMNModelViewer';
import CaseCreation from './caseCreation/CaseCreation';
import paths from '../router/paths';
import useBpmnFile from './simulationParameters/useBpmnFile';
import useJsonFile from './simulationParameters/useJsonFile';
import useFormState from './simulationParameters/useFormState';
import CustomizedSnackbar from './results/CustomizedSnackbar';

const tabs_name = {
    CASE_CREATION: "Case Creation",
    RESOURCE_CALENDARS: "Resource Calendars",
    RESOURCES: "Resources",
    RESOURCE_ALLOCATION: "Resource Allocation",
    // ARRIVAL_TIME_PARAMS: "Arrival Time Parameters",
    BRANCHING_PROB: "Branching Probabilities",
    MODEL_VIEWER: "Model Viewer"
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
    const navigate = useNavigate()

    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            num_processes: 10,
            start_date: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ")
        }
    })
    const { getValues: getScenarioValues } = scenarioState

    const [activeStep, setActiveStep] = useState(0)
    const [fileDownloadUrl, setFileDownloadUrl] = useState("")
    const [errorSnack, setErrorSnack] = useState("")
    const linkDownloadRef = useRef<HTMLAnchorElement>(null)

    const { state } = useLocation()
    const { bpmnFile, jsonFile } = state as LocationState
    const { xmlData, tasksFromModel, gateways } = useBpmnFile(bpmnFile)
    const { jsonData } = useJsonFile(jsonFile)

    const { formState, handleSubmit } = useFormState(tasksFromModel, gateways, jsonData)
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

    const onSubmit = (data: JsonData) => {
        const newJsonFile = fromContentToBlob(getValues())
        
        const { num_processes, start_date } = getScenarioValues()
        const formData = new FormData()
        formData.append("xmlFile", bpmnFile as Blob)
        formData.append("jsonFile", newJsonFile as Blob)
        formData.append("startDate", start_date)
        formData.append("numProcesses", num_processes.toString())

        axios.post(
            '/api/prosimos',
            formData)
        .then(((res: any) => {
            navigate(paths.SIMULATOR_RESULTS_PATH, {
                state: {
                    output: res.data,
                }
            })
        }))
        .catch((error: any) => {
            console.log(error.response)
            setErrorMessage(error.response.data.displayMessage)
        })
    };

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
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                                <Button
                                    type="submit"
                                    onClick={handleSubmit(onSubmit)}
                                >Submit</Button>
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