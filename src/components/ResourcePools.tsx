import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import {
    Box, Collapse, Grid, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from '@mui/icons-material/Delete';
import { JsonData } from "./SimulationParameters";
import ResourceProfilesTable from "./ResourceProfilesTable";
import AddButtonToolbar from "./toolbar/AddButtonToolbar";
import { Controller, UseFormReturn } from "react-hook-form";


export interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: string
    amount: string
}

export interface ResourcePool {
    [resourceTypeUid: string]: {
        name: string,
        resource_list: ResourceInfo[]
    }
}

interface ResourcePoolsProps {
    resourcePools: ResourcePool
    onParamFormUpdate: (paramSectionName: keyof JsonData, updatedValue: any) => void
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    },
}

interface RowProps {
    resourceTypeUid: string
    onResourcePoolDelete: (resourceTypeUid: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    },
}

function Row(props: RowProps) {
    const { resourceTypeUid, onResourcePoolDelete, formState: { control: formControl, watch } } = props
    const [openModule, setOpenModule] = React.useState(false);

    const { resource_profiles: resourceProfilesErrors } = props.errors
    const resourceListErrors = resourceProfilesErrors && resourceProfilesErrors[resourceTypeUid]

    const resourceListValues = watch(`resource_profiles.${resourceTypeUid}.resource_list`)

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
                        name={`resource_profiles.${resourceTypeUid}.name`}
                        control={formControl}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                variant="standard"
                                placeholder="Pool Name"
                            />
                        )}
                    />
                </TableCell>
                <TableCell>
                    {resourceListValues
                        ? (resourceListValues as ResourceInfo[])
                            .reduce(function (prev, curr) { return Number(prev) + Number(curr.amount) }, 0)
                        : 0
                    }
                </TableCell>
                <TableCell style={{ width: "62px" }}>
                    <IconButton
                        size="small"
                        onClick={e => onResourcePoolDelete(resourceTypeUid, e)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={openModule} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            {resourceTypeUid && <ResourceProfilesTable
                                poolUuid={resourceTypeUid}
                                formState={props.formState}
                                errors={resourceListErrors && resourceListErrors.resource_list}
                            />}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const ResourcePools = (props: ResourcePoolsProps) => {
    const [resourcePools, setResourcePools] = useState(props.resourcePools)

    const onResourcePoolDelete = (resourceTypeUid: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { [resourceTypeUid]: removedValue, ...updatedResourcePools } = props.resourcePools

        setResourcePools(updatedResourcePools)
        props.onParamFormUpdate("resource_profiles", updatedResourcePools)
    }

    const onPoolNameChange = (resourceTypeUid: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const updatedValue = e.target.value
        const updatedPools = {
            ...props.resourcePools,
            [resourceTypeUid]: {
                ...props.resourcePools[resourceTypeUid],
                name: updatedValue
            }
        }

        setResourcePools(updatedPools)
        props.onParamFormUpdate("resource_profiles", updatedPools)
    }

    const onNewPoolCreation = () => {
        const newPoolUuid = "sid-" + uuid()
        const updatedPools = {
            ...props.resourcePools,
            [newPoolUuid]: {
                name: "",
                resource_list: []
            }
        }

        setResourcePools(updatedPools)
        props.onParamFormUpdate("resource_profiles", updatedPools)
    }

    return (
        <Grid container spacing={2}>
            <Toolbar sx={{ justifyContent: "flex-end", marginLeft: "auto" }}>
                <AddButtonToolbar
                    onClick={onNewPoolCreation}
                    labelName="Add new pool"
                />
            </Toolbar>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Resource Profile</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(resourcePools).map(([resourceTypeUid, row]) => (
                            <Row key={resourceTypeUid}
                                resourceTypeUid={resourceTypeUid}
                                onResourcePoolDelete={onResourcePoolDelete}
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

export default ResourcePools;