import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Button, ButtonGroup, Grid, Tab, Tabs, Typography } from '@mui/material';
import { JsonData } from './formData';
import AllGatewaysProbabilities from './AllGatewaysProbabilities';
import ResourcePools from './ResourcePools';
import ResourceCalendars from './ResourceCalendars';
import ArrivalTimeDistr from './ArrivalTimeDistr';
import ResourceAllocation from './resource_allocation/ResourceAllocation';
import BpmnModeler from "bpmn-js/lib/Modeler";
import { ModelTask } from './modelData';

const tabs_name = {
    RESOURCE_PROFILES: "Resource Profiles",
    RESOURCE_CALENDARS: "Resource Calendars",
    ARRIVAL_TIME_PARAMS: "Arrival Time Parameters",
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
    const formState = useForm<JsonData>({
        mode: "onBlur" // validate on blur
    })
    const { handleSubmit, reset, formState: { errors } } = formState

    const [value, setValue] = useState(0)
    const [jsonData, setJsonData] = useState<JsonData>()
    const [fileDownloadUrl, setFileDownloadUrl] = useState<string>("")
    const linkDownloadRef = useRef<HTMLAnchorElement>(null)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    };

    const { state } = useLocation()
    const { bpmnFile, jsonFile } = state as LocationState
    const [xmlData, setXmlData] = useState()
    const [tasksFromModel, setTasksFromModel] = useState<ModelTask[]>([])

    useEffect(() => {
        const bpmnFileReader = new FileReader()
        bpmnFileReader.readAsText(bpmnFile)
        bpmnFileReader.onloadend = () => {
            const importXml = async () => {
                const fileData = bpmnFileReader.result as string
                const modeler = new BpmnModeler()
                const result = await modeler.importXML(fileData)
                setXmlData(result)

                const { warnings } = result;
                console.log(warnings);

                // moddle
                // const moddle = new BpmnModdle()
                // const res = await moddle.fromXML(fileData)
                // console.log(res)

                const elementRegistry = modeler.get('elementRegistry');
                const tasks = elementRegistry
                    .filter((e: { type: string; }) => e.type === 'bpmn:Task')
                    .map((t: any)=> (
                        {
                            id: t.id,
                            name: t.businessObject.name
                        }
                    ))
                setTasksFromModel(tasks)
            }

            try {
                importXml()
            }
            catch (err: any) {
                console.log(err.message, err.warnings);
            }
        }
    }, [bpmnFile])

    useEffect(() => {
        const jsonFileReader = new FileReader();
        jsonFileReader.readAsText(jsonFile, "UTF-8")
        jsonFileReader.onload = e => {
            if (e.target?.result && typeof e.target?.result === 'string') {
                const rawData = JSON.parse(e.target.result)
                setJsonData(rawData)
            }
        }
    }, [jsonFile])

    useEffect(() => {
        reset(jsonData)
    }, [jsonData, reset])

    useEffect(() => {
        if (fileDownloadUrl !== "" && fileDownloadUrl !== undefined) {
            linkDownloadRef.current?.click()
            URL.revokeObjectURL(fileDownloadUrl);
        }
    }, [fileDownloadUrl])

    const onSubmit = (data: JsonData) => console.log(data);

    const onDownload = (data: JsonData) => {
        const content = JSON.stringify(data)
        const blob = new Blob([content], { type: "text/plain" })
        const fileDownloadUrl = URL.createObjectURL(blob);
        setFileDownloadUrl(fileDownloadUrl)
    }

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
                                <Tab label={tabs_name.RESOURCE_PROFILES} wrapped {...tabProps(0)} />
                                <Tab label={tabs_name.RESOURCE_CALENDARS} wrapped {...tabProps(1)} />
                                <Tab label={tabs_name.RESOURCE_ALLOCATION} wrapped {...tabProps(2)} />
                                <Tab label={tabs_name.ARRIVAL_TIME_PARAMS} wrapped {...tabProps(3)} />
                                <Tab label={tabs_name.BRANCHING_PROB} wrapped {...tabProps(4)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                {
                                    (jsonData?.resource_profiles !== undefined)
                                        ? <ResourcePools
                                            formState={formState}
                                            errors={errors} />
                                        : <Typography>No resource profiles</Typography>
                                }
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <ResourceCalendars
                                    formState={formState}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <ResourceAllocation
                                    tasksFromModel={tasksFromModel}
                                    formState={formState}
                                    errors={errors}
                                />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <ArrivalTimeDistr
                                    formState={formState}
                                    errors={errors} />
                            </TabPanel>
                            <TabPanel value={value} index={4}>
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
                </Grid>
            </Grid>
        </form>
    );
}

export default SimulationParameters;