import { Box, Collapse, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData, ResourceMap, ResourcePool } from "../formData";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ResourceDistribution from "./ResourceDistribution";
import { AllModelTasks } from "../modelData";
import AddButtonBase from "../toolbar/AddButtonBase";
import { defaultResourceAllocationDist } from "../simulationParameters/defaultValues";

const TASK_RESOURCE_DISTR = "task_resource_distribution"
interface ResourceAllocationProps {
    tasksFromModel: AllModelTasks
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    }
    setErrorMessage: (value: string) => void
}

interface RowProps {
    taskName: string
    allocationIndex: number
    allowedResources: { [key: string]: { name: string } }
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    }
    setErrorMessage: (value: string) => void
}

const Row = (props: RowProps) => {
    const { allocationIndex, taskName, allowedResources, setErrorMessage } = props
    const { formState: { control: formControl } } = props
    const [openModule, setOpenModule] = useState(false);

    const { fields, append } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `${TASK_RESOURCE_DISTR}.${allocationIndex}.resources`
    })

    const onResourceAllocationAdd = () => {
        if (!allowedResources || Object.keys(allowedResources).length === 0) {
            setErrorMessage("Provide resource profiles before proceeding")
            return
        }
        
        append(defaultResourceAllocationDist)
    }

    return (
        <React.Fragment>
            <TableRow hover>
                <TableCell style={{ width: "62px" }}>
                    <IconButton
                        size="small"
                        onClick={() => setOpenModule(!openModule)}
                    >
                        {openModule ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography>
                        {taskName}
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openModule} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Grid container spacing={2}>
                                {fields.map((resourceDistr, index) => (
                                    <Grid item xs={12} key={`resource_distr_${allocationIndex}_${index}`}>
                                        <ResourceDistribution
                                            formState={props.formState}
                                            resourceDistr={resourceDistr}
                                            allocationIndex={allocationIndex}
                                            resourceIndex={index}
                                            allowedResources={allowedResources}
                                        />
                                    </Grid>
                                ))}
                                <Grid item xs={12}>
                                    <Paper elevation={5} sx={{ p: 2 }}>
                                        <Grid>
                                            <AddButtonBase
                                                labelName="Add a new resource allocation"
                                                onClick={onResourceAllocationAdd}
                                            />
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const ResourceAllocation = (props: ResourceAllocationProps) => {
    const { tasksFromModel } = props

    const { control: formControl, getValues } = props.formState
    const { fields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: TASK_RESOURCE_DISTR
    })

    const profiles = getValues("resource_profiles")?.reduce((acc: ResourceMap, currProfile: ResourcePool) => {
        const resources = currProfile.resource_list?.reduce((accResource, item) => ({
            ...accResource,
            [item.id]: { name: item.name }
        }), {})

        return {
            ...acc,
            ...resources
        } as ResourceMap
    }, {})

    return (
        <Grid container spacing={2}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Task</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map((allocation, index) => {
                            const currentTask = tasksFromModel[allocation.task_id]

                            return <Row key={allocation.task_id}
                                taskName={currentTask.name}
                                allocationIndex={index}
                                allowedResources={profiles}
                                formState={props.formState}
                                errors={props.errors}
                                setErrorMessage={props.setErrorMessage}
                            />
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default ResourceAllocation;
