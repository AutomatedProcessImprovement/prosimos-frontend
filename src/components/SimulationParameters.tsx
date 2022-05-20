import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useTheme } from '@material-ui/core/styles';
import { Button, ButtonGroup, Grid, Step, StepButton, StepIcon, Stepper, Theme } from '@mui/material';
import { ScenarioProperties } from './formData';
import AllGatewaysProbabilities from './gateways/AllGatewaysProbabilities';
import ResourcePools from './ResourcePools';
import ResourceCalendars from './ResourceCalendars';
import ResourceAllocation from './resource_allocation/ResourceAllocation';
import CaseCreation from './caseCreation/CaseCreation';
import useBpmnFile from './simulationParameters/useBpmnFile';
import useJsonFile from './simulationParameters/useJsonFile';
import useFormState from './simulationParameters/useFormState';
import CustomizedSnackbar from './results/CustomizedSnackbar';
import useNewModel from './simulationParameters/useNewModel';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import GroupsIcon from '@mui/icons-material/Groups';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SettingsIcon from '@mui/icons-material/Settings';
import { simulate } from '../api/api';
import SimulationResults, { SimulationResult } from './results/SimulationResults';
import paths from "../router/paths";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles( (theme: Theme) => ({
    simParamsGrid: {
        marginTop: "2vh!important"
    },
    stepperGrid: {
        marginTop: "3vh!important"
    },
    stepper: {
        "& .Mui-active": { color: theme.palette.info.dark }
    }
}));

const tabs_name = {
    CASE_CREATION: "Case Creation",
    RESOURCE_CALENDARS: "Resource Calendars",
    RESOURCES: "Resources",
    RESOURCE_ALLOCATION: "Resource Allocation",
    BRANCHING_PROB: "Branching Probabilities",
    SIMULATION_RESULTS: "Simulation Results"
};

interface LocationState {
    bpmnFile: File
    jsonFile: File
};

const fromContentToBlob = (values: any) => {
    const content = JSON.stringify(values)
    const blob = new Blob([content], { type: "text/plain" })
    return blob
};

const SimulationParameters = () => {
    const classes = useStyles()

    const theme = useTheme()
    const activeColor = theme.palette.info.dark

    const { state } = useLocation()
    const { bpmnFile, jsonFile } = state as LocationState

    const [activeStep, setActiveStep] = useState(0)
    const [fileDownloadUrl, setFileDownloadUrl] = useState("")
    const [errorSnack, setErrorSnack] = useState("")
    const [currSimulatedOutput, setCurrSimulatedOutput] = useState<SimulationResult | null>(null)

    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            num_processes: 10,
            start_date: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ")
        }
    })
    const { getValues: getScenarioValues } = scenarioState

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
                if (!!currSimulatedOutput)
                    return <SimulationResults
                        output={currSimulatedOutput}
                    />

                return <></>
        }
    };

    const getStepIcon = (index: number): React.ReactNode => {
        const isActiveStep = activeStep === index
        const styles = isActiveStep ? { color: activeColor } : {}

        let Icon: React.ReactNode
        switch (index) {
            case 0:
                Icon = <SettingsIcon style={styles}/>
                break
            case 1:
                Icon = <DateRangeIcon style={styles}/>
                break
            case 2:
                Icon = <GroupsIcon style={styles}/>
                break
            case 3:
                Icon = <AssignmentIndIcon style={styles}/>
                break
            case 4:
                Icon = <CallSplitIcon style={styles}/>
                break
            case 5:
                Icon = <BarChartIcon style={styles}/>
                break
            default:
                return <></>
        }

        return <StepIcon
            active={activeStep === index}
            icon={Icon}
        />
    };

    const onStartSimulation = () => {
        const newJsonFile = fromContentToBlob(getValues())
        const { num_processes: numProcesses, start_date: startDate } = getScenarioValues()
        localStorage.setItem("bpmnContent", JSON.stringify(xmlData))

        simulate(startDate, numProcesses, newJsonFile, bpmnFile)
            .then(((res: any) => {
                console.log(res.data)
                setCurrSimulatedOutput(res.data)

                // redirect to results step
                setActiveStep(6)
            }))
            .catch((error: any) => {
                console.log(error.response)
                setErrorMessage(error.response.data.displayMessage)
            })
    };

    const onViewModel = () => {
        window.open(paths.MODEL_VIEWER, '_blank')
    };

    return (
        <form>
            <Grid container alignItems="center" justifyContent="center" className={classes.simParamsGrid}>
                <Grid item xs={10}>
                    <Grid container item xs={12}>
                        <Grid item xs={4} justifyContent="flex-start">
                            <ButtonGroup>
                                <Button
                                    onClick={onUploadNewModel}
                                    startIcon={<ArrowBackIosNewIcon />}
                                >Upload new model</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item container xs={3} justifyContent="center">
                            <ButtonGroup>
                                <Button
                                    onClick={onStartSimulation}
                                >Start Simulation</Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item container xs={5} justifyContent="flex-end">
                            <ButtonGroup>
                                <Button
                                    onClick={onViewModel}>
                                    View Model
                                </Button>
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
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} className={classes.stepperGrid} alignItems="center" justifyContent="center" >
                        <Stepper className={classes.stepper} nonLinear alternativeLabel activeStep={activeStep} connector={<></>}>
                            {Object.values(tabs_name).map((label, index) => (
                                <Step key={label}>
                                    <StepButton color="inherit" onClick={handleStep(index)} icon={getStepIcon(index)}>
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
