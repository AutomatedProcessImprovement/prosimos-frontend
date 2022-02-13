import { useState } from 'react';
import { Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import AllGatewaysProbabilities from './AllGatewaysProbabilities';
import { useEffect } from 'react';
import ResourcePools from './ResourcePools';
import { useForm } from 'react-hook-form';
import ResourceCalendars from './ResourceCalendars';
import { JsonData } from './formData';

const tabs_name = {
    RESOURCE_PROFILES: "Resource Profiles",
    RESOURCE_CALENDARS: "Resource Calendars",
    ARRIVAL_PARAMS: "Arrival Parameters",
    ARRIVAL_TIME_DISTR: "Arrival Time Distribution",
    ARRIVAL_TIME_CALENDAR: "Arrival Time Calendar",
    BRANCHING_PROB: "Branching Probabilities",
    RESOURCE_ALLOCATION: "Resource Allocation"
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
    const formState = useForm<JsonData>();
    const { handleSubmit, reset, formState: { errors } } = formState

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

    useEffect(() => {
        reset(jsonData)
    }, [jsonData, reset])

    const onParamFormUpdate = (paramSectionName: keyof JsonData, updatedValue: any) => {
        setJsonData({
            ...jsonData,
            [paramSectionName]: updatedValue
        } as JsonData)
    }

    const onSubmit = (data: any) => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

        <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={9}>
                <Grid item xs={12}>
                    <Box
                        sx={{ flexGrow: 1, display: 'flex' }}
                    >
                            <Tabs value={value}
                                onChange={handleTabChange}
                                variant="scrollable"
                                orientation="vertical">
                                <Tab label={tabs_name.RESOURCE_PROFILES} wrapped {...tabProps(0)} />
                                <Tab label={tabs_name.RESOURCE_CALENDARS} wrapped {...tabProps(1)} />
                                <Tab label={tabs_name.RESOURCE_ALLOCATION} wrapped {...tabProps(2)} />
                                <Tab label={tabs_name.ARRIVAL_TIME_CALENDAR} wrapped {...tabProps(3)} />
                                <Tab label={tabs_name.ARRIVAL_TIME_DISTR} wrapped {...tabProps(4)} />
                                <Tab label={tabs_name.BRANCHING_PROB} wrapped {...tabProps(5)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                {
                                    (jsonData?.resource_profiles !== undefined)
                                        ? <ResourcePools
                                            resourcePools={jsonData.resource_profiles}
                                            onParamFormUpdate={onParamFormUpdate}
                                            formState={formState}
                                            errors={errors}/>
                                        : <Typography>No resource profiles</Typography>
                                }
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <ResourceCalendars/>
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
                                        ? <AllGatewaysProbabilities
                                            formState={formState}
                                            errors={errors} />
                                        : <Typography>No branching</Typography>
                                }
                            </TabPanel>

                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit">
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Grid>
        </form>
    );
}

export default SimulationParameters;