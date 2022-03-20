import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import axios from 'axios';
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

const tabs_name = {
    SCENARIO_SPECIFICATION: "Scenario Specification",
    RESOURCE_PROFILES: "Resource Profiles",
    RESOURCE_CALENDARS: "Resource Calendars",
    ARRIVAL_TIME_PARAMS: "Arrival Time Parameters",
    BRANCHING_PROB: "Branching Probabilities",
    RESOURCE_ALLOCATION: "Resource Allocation",
    MODEL_VIEWER: "Model Viewer"
}

interface LocationState {
    bpmnFile: any
    jsonFile: any
}

function tabProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
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
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
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

    const [value, setValue] = useState(0)
    const [fileDownloadUrl, setFileDownloadUrl] = useState<string>("")
    const linkDownloadRef = useRef<HTMLAnchorElement>(null)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    };

    const { state } = useLocation()
    const { bpmnFile, jsonFile } = state as LocationState
    const { xmlData, tasksFromModel, gateways } = useBpmnFile(bpmnFile)
    const { jsonData } = useJsonFile(jsonFile)
    
    const { formState, handleSubmit, errors } = useFormState(tasksFromModel, gateways, jsonData)

    useEffect(() => {
        if (fileDownloadUrl !== "" && fileDownloadUrl !== undefined) {
            linkDownloadRef.current?.click()
            URL.revokeObjectURL(fileDownloadUrl);
        }
    }, [fileDownloadUrl]);

    const onSubmit = (data: JsonData) => {
        const { num_processes, start_date } = getScenarioValues()
        axios.post(
            'http://localhost:5000/prosimos',
            { 
                "jsonData": data,
                "numProcesses": num_processes,
                "startDate": start_date,
                "xmlData": xmlData
            }).then(((res: any) => {
                navigate(paths.SIMULATOR_RESULTS_PATH, {
                    state: {
                        output: res.data,
                    }
                })
            })
        )
    };

    const onDownload = (data: JsonData) => {
        const content = JSON.stringify(data)
        const blob = new Blob([content], { type: "text/plain" })
        const fileDownloadUrl = URL.createObjectURL(blob);
        setFileDownloadUrl(fileDownloadUrl)
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={9}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="center">
                            <ButtonGroup variant="outlined">
                                <Button
                                    type="submit"
                                    onClick={handleSubmit(onDownload)}
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
                            <Tabs value={value}
                                onChange={handleTabChange}
                                variant="scrollable"
                                orientation="vertical">
                                <Tab label={tabs_name.SCENARIO_SPECIFICATION} wrapped {...tabProps(0)} /> 
                                <Tab label={tabs_name.RESOURCE_PROFILES} wrapped {...tabProps(0)} />
                                <Tab label={tabs_name.RESOURCE_CALENDARS} wrapped {...tabProps(1)} />
                                <Tab label={tabs_name.RESOURCE_ALLOCATION} wrapped {...tabProps(2)} />
                                <Tab label={tabs_name.ARRIVAL_TIME_PARAMS} wrapped {...tabProps(3)} />
                                <Tab label={tabs_name.BRANCHING_PROB} wrapped {...tabProps(4)} />
                                <Tab label={tabs_name.MODEL_VIEWER} wrapped {...tabProps(5)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <ScenarioSpecification
                                    formState={scenarioState}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <ResourcePools
                                    formState={formState}
                                    errors={errors}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <ResourceCalendars
                                    formState={formState}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <ResourceAllocation
                                    tasksFromModel={tasksFromModel}
                                    formState={formState}
                                    errors={errors}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                                <ArrivalTimeDistr
                                    formState={formState}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                                <AllGatewaysProbabilities
                                    formState={formState}
                                    errors={errors}
                                    gateways={gateways}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={6}>
                                <BPMNModelViewer
                                    xmlData={xmlData}
                                />
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
}

export default SimulationParameters;