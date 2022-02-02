import { useState } from 'react';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import GatewayBranchingProb, { GatewayBranchingProbabilities } from './GatewayBranchingProb';
import { useEffect } from 'react';
import ResourceProfiles from './ResourceProfiles';

const tabs_name = {
    RESOURCE_PROFILES: "Resource Profiles",
    RESOURCE_CALENDARS: "Resource Calendars",
    ARRIVAL_TIME_DISTR: "Arrival Time Distribution",
    ARRIVAL_TIME_CALENDAR: "Arrival Time Calendar",
    GATEWAY_BRANCHING_PROB: "Gateway Branching Probabilities",
    TASK_RESOURCE_DISTR: "Task Resource Distribution"
}

interface LocationState {
    bpmnFile: any
    jsonFile: any
}

export interface JsonData {
    resource_profiles: {}
    arrival_time_distribution: {}
    arrival_time_calendar: []
    gateway_branching_probabilities: GatewayBranchingProbabilities
    task_resource_distribution: {}
    resource_calendars: {}
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
    const [value, setValue] = useState(0);
    const [jsonData, setJsonData] = useState<JsonData>();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { state } = useLocation()
    const { bpmnFile, jsonFile } = state as LocationState

    useEffect(() => {
        const fileReader = new FileReader();
        fileReader.readAsText(jsonFile, "UTF-8");
        fileReader.onload = e => {
            if (e.target?.result && typeof e.target?.result === 'string') {
                const rawData = JSON.parse(e.target.result)
                setJsonData(rawData)
            }
        };
    }, [jsonFile])

    const onParamFormUpdate = (paramSectionName: keyof JsonData, updatedValue: any) => {
        setJsonData({
            ...jsonData,
            [paramSectionName]: updatedValue
        } as JsonData)
    }

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={9}>
                <Grid item xs={12}>
                    <Box
                        sx={{ flexGrow: 1, display: 'flex' }}
                    >
                        <Tabs value={value}
                            onChange={handleTabChange}
                            variant="scrollable"
                            aria-label="scrollable wrapped label basic example"
                            orientation="vertical">
                            <Tab label={tabs_name.RESOURCE_PROFILES} wrapped {...tabProps(0)} />
                            <Tab label={tabs_name.RESOURCE_CALENDARS} wrapped {...tabProps(1)} />
                            <Tab label={tabs_name.TASK_RESOURCE_DISTR} wrapped {...tabProps(2)} />
                            <Tab label={tabs_name.ARRIVAL_TIME_CALENDAR} wrapped {...tabProps(3)} />
                            <Tab label={tabs_name.ARRIVAL_TIME_DISTR} wrapped {...tabProps(4)} />
                            <Tab label={tabs_name.GATEWAY_BRANCHING_PROB} wrapped {...tabProps(5)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            {
                                (jsonData?.resource_profiles !== undefined)
                                    ? <ResourceProfiles
                                        resourceProfiles={jsonData.resource_profiles}
                                        onParamFormUpdate={onParamFormUpdate} />
                                    : <Typography>No resource profiles</Typography>
                            }
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            Item Two
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            Item Three
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            Item Three
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            Item Three
                        </TabPanel>
                        <TabPanel value={value} index={5}>
                            {
                                (jsonData?.gateway_branching_probabilities !== undefined)
                                    ? <GatewayBranchingProb
                                        probabilities={jsonData?.gateway_branching_probabilities}
                                        onParamFormUpdate={onParamFormUpdate} />
                                    : <Typography>No branching</Typography>
                            }
                        </TabPanel>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SimulationParameters;