import React, { useState } from "react";
import {
    Box, Collapse, Grid, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from '@mui/icons-material/Delete';
import { JsonData } from "./SimulationParameters";
import ResourceProfilesTable from "./ResourceProfilesTable";

export interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: string
    amount: string
}

interface ResourcePool {
    [resourceTypeUid: string]: {
        name: string,
        resource_list: ResourceInfo[]
    }
}

interface ResourcePoolsProps {
    resourcePools: ResourcePool
    onParamFormUpdate: (paramSectionName: keyof JsonData, updatedValue: any) => void
}

interface RowProps {
    row: any
    resourceTypeUid: string
    onResourcePoolDelete: (resourceTypeUid: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onPoolNameChange: (resourceTypeUid: string, e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    onResourceListChange: (resourceTypeUid: string, updatedResourceList: ResourceInfo[]) => void
}

function Row(props: RowProps) {
    const { row, resourceTypeUid, onResourcePoolDelete, onPoolNameChange, onResourceListChange } = props
    const [openModule, setOpenModule] = React.useState(false);

    const onResourceListUpdate = (updatedResourceList: ResourceInfo[]) => {
        onResourceListChange(resourceTypeUid, updatedResourceList)
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
                    <TextField
                        required
                        onChange={e => onPoolNameChange(resourceTypeUid, e)}
                        value={row.name}
                        variant="standard"
                        // style={{ width: "50%" }}
                    />
                </TableCell>
                <TableCell>({row.resource_list.length})</TableCell>
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
                            <ResourceProfilesTable
                                resourceList={row.resource_list}
                                onResourceListUpdate={onResourceListUpdate}
                            />
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
        const {[resourceTypeUid]: removedValue, ...updatedResourcePools} = props.resourcePools

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

    const onResourceListChange = (resourceTypeUid: string, updatedResourceList: ResourceInfo[]) => {
        const updatedPools = {
            ...props.resourcePools,
            [resourceTypeUid]: {
                ...props.resourcePools[resourceTypeUid],
                resource_list: updatedResourceList
            }
        }

        setResourcePools(updatedPools)
        props.onParamFormUpdate("resource_profiles", updatedPools)
    }

    return (
        <form>
            <Grid container spacing={2}>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Pool Name</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(resourcePools).map(([resourceTypeUid, row]) => (
                                <Row key={resourceTypeUid} 
                                    row={row}
                                    resourceTypeUid={resourceTypeUid}
                                    onResourcePoolDelete={onResourcePoolDelete}
                                    onPoolNameChange={onPoolNameChange}
                                    onResourceListChange={onResourceListChange}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </form>
    )
}

export default ResourcePools;