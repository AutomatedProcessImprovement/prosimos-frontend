import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useTheme } from '@material-ui/core/styles';
import { AlertColor, Badge, Button, ButtonGroup, Grid, Step, StepButton, StepIcon, Stepper, Theme } from '@mui/material';
import { BatchProcessing, FiringRule, JsonData, ScenarioProperties } from './formData';
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
import { getTaskByTaskId, simulate } from '../api/api';
import SimulationResults, { SimulationResult } from './results/SimulationResults';
import paths from "../router/paths";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useInterval } from 'usehooks-ts'
import Tooltip from '@mui/material/Tooltip';
import AllIntermediateEvents from './interEvents/AllIntermediateEvents'
import EventIcon from '@mui/icons-material/Event';
import AllBatching from './batching/AllBatching';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import useTabVisibility, {TABS} from './simulationParameters/useTabVisibility';
import AllCaseAttributes from './caseAttributesGeneration/AllCaseAttributes';

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

const tooltip_desc: { [key: string]: string } = {
    CASE_CREATION: 
        "Describes when (arrival time calendar) and how (arrival time distribution) new process cases can be started",
    RESOURCE_CALENDARS: 
        "Lists the time intervals in which a resource is available to perform a task on a weekly calendar basis",
    RESOURCES:
        "Describes the resources grouped into pools. Specifically, it includes a set of resource pools",
    RESOURCE_ALLOCATION:
        "Maps each task in the process model and the list of resources that can perform it",
    BRANCHING_PROB: 
        "Represents the probability for the process execution to move towards any outgoing flow of each split (inclusive or exclusive) gateway in the process model",
    INTERMEDIATE_EVENTS:
        "Represents the probability for intermediate events present in the business process model",
    BATCHING:
        "Represents the setup needed in order to execute the task in a batched way",
    CASE_ATTRIBUTES:
        "Represents the setup on how case attributes need to be generated",
    SIMULATION_RESULTS: "",
}

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
    const [isPollingEnabled, setIsPollingEnabled] = useState(false)
    const [pendingTaskId, setPendingTaskId] = useState("")

    const scenarioState = useForm<ScenarioProperties>({
        mode: "onBlur",
        defaultValues: {
            num_processes: 100,
            start_date: moment().format("YYYY-MM-DDTHH:mm:ss.sssZ")
        }
    })
    const { getValues: getScenarioValues, trigger: triggerScenario, formState: { errors: scenarioErrors} } = scenarioState

    const linkDownloadRef = useRef<HTMLAnchorElement>(null)

    const { tasksFromModel, gateways, eventsFromModel } = useBpmnFile(bpmnFile)
    const { jsonData, missedElemNum } = useJsonFile(jsonFile, eventsFromModel)

    const { formState } = useFormState(tasksFromModel, gateways, eventsFromModel, jsonData)
    const { formState: { errors, isValid, isSubmitted, submitCount }, getValues, handleSubmit } = formState
    const [ isScenarioParamsValid, setIsScenarioParamsValid ] = useState(true)

    const { visibleTabs } = useTabVisibility(eventsFromModel)

    const { onUploadNewModel } = useNewModel()

    // validate both forms: scenatio params and json fields
    useEffect(() => {
        // isValid doesn't work properly on init
        const isJsonParamsValid = Object.keys(errors)?.length === 0

        if (!isScenarioParamsValid || !isJsonParamsValid) {
            console.log(errors)
            setErrorMessage("There are validation errors")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitted, submitCount]);

    useEffect(() => {
        if (missedElemNum > 0) {
            setInfoMessage(`${missedElemNum} elements from config were ignored due to its absence in the BPMN model.`)
        }
    }, [missedElemNum]);

    const setErrorMessage = (value: string) => {
        setSnackColor("error")
        setSnackMessage(value)
    };

    const setInfoMessage = (value: string) => {
        setSnackColor("info")
        setSnackMessage(value)
    };

    useEffect(() => {
        if (fileDownloadUrl !== "" && fileDownloadUrl !== undefined) {
            linkDownloadRef.current?.click()
            URL.revokeObjectURL(fileDownloadUrl);
        }
    }, [fileDownloadUrl]);

    useInterval(
        () => {
            getTaskByTaskId(pendingTaskId)
                .then((result: any) => {
                    const dataJson = result.data

                    if (dataJson.TaskStatus === "SUCCESS") {
                        setIsPollingEnabled(false)
                        setCurrSimulatedOutput(dataJson.TaskResponse )
                        
                        // redirect to results step
                        setActiveStep(TABS.SIMULATION_RESULTS)

                        // hide info message
                        onSnackbarClose()
                    }
                    else if (dataJson.TaskStatus === "FAILURE") {
                        setIsPollingEnabled(false)

                        console.log(dataJson)
                        setErrorMessage("Simulation Task failed")
                    }
                })
                .catch((error: any) => {
                    setIsPollingEnabled(false)

                    console.log(error)
                    console.log(error.response)
                    const errorMessage = error?.response?.data?.displayMessage || "Something went wrong"
                    setErrorMessage("Task Executing: " + errorMessage)
                })
        },
        isPollingEnabled ? 3000 : null
    );

    const onDownload = () => {
        const blob = getBlobBasedOnExistingInput()
        const fileDownloadUrl = URL.createObjectURL(blob)
        setFileDownloadUrl(fileDownloadUrl)
    };

    const getBlobBasedOnExistingInput = (): Blob => {
        const values = getValues()
        const newTransformedValues = transformBetweenOperations(values)
        const blob = fromContentToBlob(newTransformedValues)

        return blob
    };

    const transformBetweenOperations = (values: JsonData) => {
        const copiedValues = JSON.parse(JSON.stringify(values))
        const batching_info = copiedValues.batch_processing // array per task

        batching_info.forEach((element: BatchProcessing) => {
            _transformBetweenOperatorsPerTask(element.firing_rules)
        })

        return copiedValues
    };

    const _groupByEligibleForBetweenAndNot = (result: [FiringRule[], FiringRule[], FiringRule[]], current: FiringRule): [FiringRule[], FiringRule[], FiringRule[]] => {
        const [ready_res, large_res, others] = result
        if (current.comparison === "between") {
            if (current.attribute === "ready_wt") {
                ready_res.push(current)
            }
            else if (current.attribute === "ready_wt") {
                large_res.push(current)
            }
        } else {
            others.push(current)
        }
    
        return [ready_res, large_res, others]
    }

    const _transformBetweenOperatorsPerTask = (curr_task_batch_rules: FiringRule[][]) => {
        for (var or_rule_index in curr_task_batch_rules) {
            const curr_and_rules = curr_task_batch_rules[or_rule_index]
            const [ready_wt_rules, large_wt_rules, others] = curr_and_rules.reduce(_groupByEligibleForBetweenAndNot, [[], [], []] as [FiringRule[], FiringRule[], FiringRule[]])
            let new_ready_rules : FiringRule[] | undefined = undefined
            let new_large_rules : FiringRule[] | undefined = undefined
            if (ready_wt_rules.length > 0) {
                // expect one BETWEEN rule
                const values = (ready_wt_rules[0]!.value as string[]).map(x =>  Number(x))

                const min_value = Math.min(...values)
                const max_value = Math.max(...values)
                const attr = ready_wt_rules[0].attribute
                
                new_ready_rules = [
                    { attribute: attr, comparison: ">=", value: String(min_value) } as FiringRule, 
                    { attribute: attr, comparison: "<=", value: String(max_value) } as FiringRule
                ]
            }
            else if (large_wt_rules.length > 0) {
                // expect two AND rules here
                const values = ready_wt_rules.map(x =>  Number(x.value))
                const min_value = Math.min(...values)
                const max_value = Math.max(...values)
                const attr = ready_wt_rules[0].attribute
                
                new_ready_rules = [
                    { attribute: attr, comparison: ">=", value: String(min_value) } as FiringRule, 
                    { attribute: attr, comparison: "<=", value: String(max_value) } as FiringRule
                ]
            }

            curr_task_batch_rules[or_rule_index] = [
                ...others,
                ...(new_ready_rules ? new_ready_rules : []),
                ...(new_large_rules ? new_large_rules : [])
            ]
        }
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
    };

    const getStepContent = (index: TABS) => {
        switch (index) {
            case TABS.CASE_CREATION:
                return <CaseCreation
                    scenarioFormState={scenarioState}
                    jsonFormState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case TABS.RESOURCE_CALENDARS:
                return <ResourceCalendars
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case TABS.RESOURCES:
                return <ResourcePools
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case TABS.RESOURCE_ALLOCATION:
                return <ResourceAllocation
                    tasksFromModel={tasksFromModel}
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case TABS.BRANCHING_PROB:
                return <AllGatewaysProbabilities
                    formState={formState}
                    gateways={gateways}
                />
            case TABS.INTERMEDIATE_EVENTS:
                return <AllIntermediateEvents
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                    eventsFromModel={eventsFromModel}
                />
            case TABS.BATCHING:
                return <AllBatching
                    tasksFromModel={tasksFromModel}
                    formState={formState}
                    setErrorMessage={setErrorMessage} />
            case TABS.CASE_ATTRIBUTES:
                return <AllCaseAttributes
                    formState={formState}
                    setErrorMessage={setErrorMessage}
                />
            case TABS.SIMULATION_RESULTS:
                if (!!currSimulatedOutput)
                    return <SimulationResults
                        output={currSimulatedOutput}
                    />

                return <></>
        }
    };
    
    const getStepIcon = (index: TABS): React.ReactNode => {
        const isActiveStep = activeStep === index
        const styles = isActiveStep ? { color: activeColor } : {}

        let Icon: React.ReactNode
        let currError: any
        let lastStep = false
        switch (index) {
            case TABS.CASE_CREATION:
                currError = errors.arrival_time_calendar || errors.arrival_time_distribution || scenarioErrors
                Icon = <SettingsIcon style={styles}/>
                break
            case TABS.RESOURCE_CALENDARS:
                currError = errors.resource_calendars
                Icon = <DateRangeIcon style={styles}/> 
                break
            case TABS.RESOURCES:
                currError = errors.resource_profiles
                Icon =  <GroupsIcon style={styles}/>
                break
            case TABS.RESOURCE_ALLOCATION:
                currError = errors.task_resource_distribution
                Icon = <AssignmentIndIcon style={styles}/>
                break
            case TABS.BRANCHING_PROB:
                currError = errors.gateway_branching_probabilities
                Icon = <CallSplitIcon style={styles}/>
                break
            case TABS.INTERMEDIATE_EVENTS:
                currError = errors.event_distribution
                Icon = <EventIcon style={styles}/>
                break
            case TABS.BATCHING:
                currError = errors.batch_processing
                Icon = <DynamicFeedIcon style={styles}/>
                break
            case TABS.CASE_ATTRIBUTES:
                currError = errors.case_attributes
                // TODO: find appropriate icon
                Icon = <DynamicFeedIcon style={styles}/>
                break
            case TABS.SIMULATION_RESULTS:
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

        const newBlob = getBlobBasedOnExistingInput()
        const { num_processes: numProcesses, start_date: startDate } = getScenarioValues()

        simulate(startDate, numProcesses, newBlob, bpmnFile)
            .then(((result: any) => {
                const dataJson = result.data
                setPendingTaskId(dataJson.TaskId)
                setIsPollingEnabled(true) 
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
                            {Object.entries(visibleTabs.getAllItems()).map(([key, label]: [string, string]) => {
                                const keyEnum = key as keyof typeof TABS
                                const indexNum = TABS[keyEnum]

                                return <Step key={label}>
                                    <Tooltip title={tooltip_desc[key]}>
                                        <StepButton color="inherit" onClick={() => setActiveStep(indexNum)} icon={getStepIcon(indexNum)}>
                                            {label}
                                        </StepButton>
                                    </Tooltip>
                                </Step>
                            })}
                        </Stepper>
                        <Grid container mt={3} style={{ marginBottom: "2%" }}>
                            {getStepContent(activeStep)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {snackMessage && <CustomizedSnackbar
                message={snackMessage}
                severityLevel={snackColor}
                onSnackbarClose={onSnackbarClose}
            />}
        </form>
    );
}

export default SimulationParameters;
