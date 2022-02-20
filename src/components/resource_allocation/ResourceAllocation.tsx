import { Box, Collapse, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ResourceDistribution from "./ResourceDistribution";
import { ModelTask } from "../modelData";

const TASK_RESOURCE_DISTR = "task_resource_distribution"

interface ResourceAllocationProps {
    tasksFromModel: ModelTask[]
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    }
}

interface RowProps {
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    },
    allocationIndex: number
}

const Row = (props: RowProps) => {
    const { allocationIndex } = props
    const { formState: { control: formControl } } = props
    const [openModule, setOpenModule] = useState(false);

    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `${TASK_RESOURCE_DISTR}.${allocationIndex}.resources`
    })
        
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
                    <Controller
                        name={`${TASK_RESOURCE_DISTR}.${allocationIndex}.task_id` as unknown as keyof JsonData}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field: { value } }) => (
                            <Typography>
                                {value}
                            </Typography>
                        )}
                    />
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
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const ResourceAllocation = (props: ResourceAllocationProps) => {
    const { control: formControl, getValues } = props.formState
    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: TASK_RESOURCE_DISTR
    })

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
                        {fields.map((allocation, index) => (
                            <Row key={allocation.task_id}
                                allocationIndex={index}
                                formState={props.formState}
                                errors={props.errors}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default ResourceAllocation;
