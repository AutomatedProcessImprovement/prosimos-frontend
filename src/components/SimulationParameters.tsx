import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import axios from './../axios';
import { Box, Button, ButtonGroup, Grid, Tab, Tabs } from '@mui/material';
import { JsonData, ScenarioProperties } from './formData';
import AllGatewaysProbabilities from './gateways/AllGatewaysProbabilities';
import ResourcePools from './ResourcePools';
import ResourceCalendars from './ResourceCalendars';
import ArrivalTimeDistr from './ArrivalTimeDistr';
import ResourceAllocation from './resource_allocation/ResourceAllocation';
import BPMNModelViewer from './model/BPMNModelViewer';
import ScenarioSpecification from './scenario_specification.tsx/ScenarioSpecification';
import paths from '../router/paths';
import useBpmnFile from './simulationParameters/useBpmnFile';
import useJsonFile from './simulationParameters/useJsonFile';
import useFormState from './simulationParameters/useFormState';
import CustomizedSnackbar from './results/CustomizedSnackbar';

const tabs_name = {
    SCENARIO_SPECIFICATION: "Scenario Specification",
    RESOURCE_PROFILES: "Resource Profiles",
    RESOURCE_CALENDARS: "Resource Calendars",
    RESOURCE_ALLOCATION: "Resource Allocation",
    ARRIVAL_TIME_PARAMS: "Arrival Time Parameters",
    BRANCHING_PROB: "Branching Probabilities",
    MODEL_VIEWER: "Model Viewer"
}

interface LocationState {
    bpmnFile: any
    jsonFile: any
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            style={{ width: "100%" }}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

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

    const [tabValue, setTabValue] = useState(0)
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
        console.log(errors)
        if (isSubmitted && !isValid) {
            setErrorMessage("There are validation errors")
        }
    }, [isValid, isSubmitted, submitCount, errors])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
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
        const { num_processes, start_date } = getScenarioValues()
        const formData = new FormData()
        formData.append("xmlFile", bpmnFile)
        formData.append("jsonFile", jsonFile)
        formData.append("startDate", start_date)
        formData.append("numProcesses", num_processes.toString())

        axios.post(
            '/api/prosimos',
            formData
        ).then(((res: any) => {
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
        const content = JSON.stringify(getValues())
        const blob = new Blob([content], { type: "text/plain" })
        const fileDownloadUrl = URL.createObjectURL(blob);
        setFileDownloadUrl(fileDownloadUrl)
    };

    const onSnackbarClose = () => {
        setErrorMessage("")
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
                    <Grid item xs={12}>
                        <Box
                            sx={{ flexGrow: 1, display: 'flex' }}
                        >
                            <Tabs value={tabValue}
                                onChange={handleTabChange}
                                variant="scrollable"
                                orientation="vertical">
                                {Object.values(tabs_name).map((item) => (
                                    <Tab key={item} label={item} wrapped />
                                ))}
                            </Tabs>
                            <TabPanel value={tabValue} index={0}>
                                <ScenarioSpecification
                                    formState={scenarioState}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <ResourcePools
                                    formState={formState}
                                    setErrorMessage={setErrorMessage}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={2}>
                                <ResourceCalendars
                                    formState={formState}
                                    setErrorMessage={setErrorMessage}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={3}>
                                <ResourceAllocation
                                    tasksFromModel={tasksFromModel}
                                    formState={formState}
                                    setErrorMessage={setErrorMessage}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={4}>
                                <ArrivalTimeDistr
                                    formState={formState}
                                    setErrorMessage={setErrorMessage}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={5}>
                                <AllGatewaysProbabilities
                                    formState={formState}
                                    gateways={gateways}
                                />
                            </TabPanel>
                            <TabPanel value={tabValue} index={6}>
                                <BPMNModelViewer
                                    xmlData={xmlData}
                                />
                            </TabPanel>
                        </Box>
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