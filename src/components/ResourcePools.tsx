import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import {
    Box, Collapse, Grid, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from '@mui/icons-material/Delete';
import { JsonData } from "./formData";
import ResourceProfilesTable from "./ResourceProfilesTable";
import AddButtonToolbar from "./toolbar/AddButtonToolbar";
import { Controller, useFieldArray, UseFieldArrayRemove, UseFormReturn } from "react-hook-form";
import { REQUIRED_ERROR_MSG } from "./validationMessages";


export interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: string
    amount: string
}

interface ResourcePoolsProps {
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    }
}

interface RowProps {
    resourceTypeUid: string
    resourcePoolIndex: number
    onResourcePoolDelete: UseFieldArrayRemove
    formState: UseFormReturn<JsonData, object>
    errors: {
        [x: string]: any;
    },
}

function Row(props: RowProps) {
    const { resourcePoolIndex } = props

    const { resourceTypeUid, onResourcePoolDelete, formState: { control: formControl, watch } } = props
    const [openModule, setOpenModule] = useState(false);

    const { resource_profiles: resourceProfilesErrors } = props.errors
    const resourceListErrors = resourceProfilesErrors && resourceProfilesErrors[resourcePoolIndex]

    const resourceListValues = watch(`resource_profiles.${resourcePoolIndex}.resource_list`)

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
                        name={`resource_profiles.${resourcePoolIndex}.name`}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                error={resourceListErrors?.name !== undefined}
                                helperText={resourceListErrors?.name?.message}
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
                        onClick={() => onResourcePoolDelete(resourcePoolIndex)}
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
                                resourcePoolIndex={resourcePoolIndex}
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
    const { control: formControl } = props.formState
    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_profiles`
    })

    const onNewPoolCreation = () => {
        append({
            id: "sid-" + uuid(),
            name: "",
            resource_list: []
        })
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
                        {fields.map((profile, index) => (
                            <Row key={profile.id}
                                resourcePoolIndex={index}
                                resourceTypeUid={profile.id}
                                onResourcePoolDelete={remove}
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