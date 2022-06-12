import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useTheme } from '@material-ui/core/styles';
import { AlertColor, Badge, Button, ButtonGroup, Grid, Step, StepButton, StepIcon, Stepper, Theme } from '@mui/material';
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
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    const successColor = theme.palette.success.light
    const errorColor = theme.palette.error.light

    const { state } = useLocation()
    const { bpmnFile, jsonFile } = state as LocationState

    const [activeStep, setActiveStep] = useState(0)
    const [fileDownloadUrl, setFileDownloadUrl] = useState("")
    const [snackMessage, setSnackMessage] = useState("")
    const [snackColor, setSnackColor] = useState<AlertColor | undefined>(undefined)
    const [currSimulatedOutput, setCurrSimulatedOutput] = useState<SimulationResult | null>(null)

    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            num_processes: 10,
            start_date: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ")
        }
    })
    const { getValues: getScenarioValues, trigger: triggerScenario, formState: { errors: scenarioErrors} } = scenarioState

    const linkDownloadRef = useRef<HTMLAnchorElement>(null)

    const { tasksFromModel, gateways } = useBpmnFile(bpmnFile)
    const { jsonData } = useJsonFile(jsonFile)

    const { formState } = useFormState(tasksFromModel, gateways, jsonData)
    const { formState: { errors, isValid, isSubmitted, submitCount }, getValues, handleSubmit } = formState
    const [ isScenarioParamsValid, setIsScenarioParamsValid ] = useState(true)

    const { onUploadNewModel } = useNewModel()

    // validate both forms: scenatio params and json fields
    useEffect(() => {
        // isValid doesn't work properly on init
        const isJsonParamsValid = Object.keys(errors)?.length === 0

        if (!isScenarioParamsValid || !isJsonParamsValid) {
            setErrorMessage("There are validation errors")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitted, submitCount]);

    const handleStep = (index: number) => () => {
        setActiveStep(index)
    };

    const setErrorMessage = (value: string) => {
        setSnackColor("error")
        setSnackMessage(value)
    };

    const setInfoMessage = (value: string) => {
        setSnackColor("success")
        setSnackMessage(value)
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
        let currError: any
        let lastStep = false
        switch (index) {
            case 0:
                currError = errors.arrival_time_calendar || errors.arrival_time_distribution || scenarioErrors
                Icon = <SettingsIcon style={styles}/>
                break
            case 1:
                currError = errors.resource_calendars
                Icon = <DateRangeIcon style={styles}/> 
                break
            case 2:
                currError = errors.resource_profiles
                Icon =  <GroupsIcon style={styles}/>
                break
            case 3:
                currError = errors.task_resource_distribution
                Icon = <AssignmentIndIcon style={styles}/>
                break
            case 4:
                currError = errors.gateway_branching_probabilities
                Icon = <CallSplitIcon style={styles}/>
                break
            case 5:
                lastStep = true
                Icon = <BarChartIcon style={styles}/>
                break
            default:
                return <></>
        }

        const getBadgeContent = (areAnyErrors: boolean) => {
            let BadgeIcon: typeof CancelIcon | typeof CheckCircleIcon, color: string
            if (areAnyErrors) {
                BadgeIcon = CancelIcon
                color = errorColor
            } else {
                BadgeIcon = CheckCircleIcon
                color = successColor
            }

            return (<BadgeIcon style={{ marginRight: "-9px", color: color}} />)
        }

        const areAnyErrors = currError && (currError.length > 0 || Object.keys(currError)?.length > 0)
        const finalIcon = 
            (isSubmitted && !lastStep)
            ? ( <Badge 
                    badgeContent={getBadgeContent(areAnyErrors)}
                    overlap="circular"> {Icon} 
                </Badge>
            )
            : Icon

        return <StepIcon
            active={activeStep === index}
            icon={finalIcon}
        />
    };

    const onStartSimulation = async () => {
        setInfoMessage("Simulation started...")
        const isScenarioValid = await triggerScenario()
        setIsScenarioParamsValid(isScenarioValid)

        // scenario params or json params or both are not valid
        if (!isValid || !isScenarioValid) {
            return;
        }

        const newJsonFile = fromContentToBlob(getValues())
        const { num_processes: numProcesses, start_date: startDate } = getScenarioValues()

        simulate(startDate, numProcesses, newJsonFile, bpmnFile)
            .then(((res: any) => {
                setCurrSimulatedOutput(res.data)

                // redirect to results step
                setActiveStep(5)
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
                                    type="submit"
                                    onClick={handleSubmit(onStartSimulation)}
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
                message={snackMessage}
                severityLevel={snackColor}
                onSnackbarClose={onSnackbarClose}
            />
        </form>
    );
}

export default SimulationParameters;
