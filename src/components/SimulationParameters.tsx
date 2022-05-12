import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { Button, ButtonGroup, createStyles, Grid, Step, StepButton, Stepper, Theme } from '@mui/material';
import { WithStyles, withStyles } from '@material-ui/core/styles';
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
import useNewModel from './simulationParameters/useNewModel';

const styles = (theme: Theme) => createStyles({
    simParamsGrid: {
        marginTop: "2vh!important"
    },
    stepper: {
        marginTop: "3vh!important"
    }
})

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
    numProcesses?: number
    start_date?: string
}

const fromContentToBlob = (values: any) => {
    const content = JSON.stringify(values)
    const blob = new Blob([content], { type: "text/plain" })
    return blob
};

type SimulationParametersProps = WithStyles<typeof styles>

const SimulationParameters = (props: SimulationParametersProps) => {
    const { classes } = props
    const { state } = useLocation()
    const { bpmnFile, jsonFile, numProcesses, start_date } = state as LocationState

    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            num_processes: numProcesses || 10,
            start_date: start_date || moment().format("YYYY-MM-DDTHH:mm:ss.sssZ")
        }
    })

    const [activeStep, setActiveStep] = useState(0)
    const [fileDownloadUrl, setFileDownloadUrl] = useState("")
    const [errorSnack, setErrorSnack] = useState("")
    const linkDownloadRef = useRef<HTMLAnchorElement>(null)

    const { xmlData, tasksFromModel, gateways } = useBpmnFile(bpmnFile)
    const { jsonData } = useJsonFile(jsonFile)

    const { formState } = useFormState(tasksFromModel, gateways, jsonData)
    const { formState: { errors, isValid, isSubmitted, submitCount }, getValues } = formState

    const { onUploadNewModel } = useNewModel()

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
            <Grid container alignItems="center" justifyContent="center" className={classes.simParamsGrid}>
                <Grid item xs={10}>
                    <Grid container item xs={12}>
                        <Grid item xs={6} justifyContent="flex-start">
                            <ButtonGroup>
                                <Button
                                    onClick={onUploadNewModel}
                                >Upload new model</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item container xs={6} justifyContent="flex-end">
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={(_e) => onDownload()}
                            >Download as a .json</Button>
                            <a
                                style={{ display: "none" }}
                                download={"json-file-name.json"}
                                href={fileDownloadUrl}
                                ref={linkDownloadRef}
                            >Download json</a>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} className={classes.stepper} alignItems="center" justifyContent="center" >
                        <Stepper nonLinear alternativeLabel activeStep={activeStep}>
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

export default withStyles(styles)(SimulationParameters);
