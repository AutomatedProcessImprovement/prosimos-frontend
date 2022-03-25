import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import {
    Box, Collapse, Grid, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from '@mui/icons-material/Delete';
import { CalendarMap, JsonData } from "./formData";
import ResourceProfilesTable from "./profiles/ResourceProfilesTable";
import AddButtonToolbar from "./toolbar/AddButtonToolbar";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { MIN_LENGTH_REQUIRED_MSG, REQUIRED_ERROR_MSG } from "./validationMessages";


export interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: string
    amount: string
}

interface ResourcePoolsProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

interface RowProps {
    resourceTypeUid: string
    resourcePoolIndex: number
    onResourcePoolDelete: (index: number) => void
    formState: UseFormReturn<JsonData, object>
    calendars: CalendarMap
    setErrorMessage: (value: string) => void
}

function Row(props: RowProps) {
    const { resourcePoolIndex } = props

    const { resourceTypeUid, onResourcePoolDelete, formState: { control: formControl, watch, formState: { errors } } } = props
    const [openModule, setOpenModule] = useState(false);

    const { resource_profiles: resourceProfilesErrors } = errors as any
    const resourceListErrors = resourceProfilesErrors?.[resourcePoolIndex]
    const areAnyErrors = resourceListErrors?.name !== undefined || resourceListErrors?.resource_list !== undefined
    const errorMessage = resourceListErrors?.name?.message || resourceListErrors?.resource_list?.message

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
                                error={areAnyErrors}
                                helperText={errorMessage}
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
                                errors={resourceListErrors?.resource_list}
                                calendars={props.calendars}
                                setErrorMessage={props.setErrorMessage}
                            />}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const ResourcePools = (props: ResourcePoolsProps) => {
    const { setErrorMessage } = props
    const { control: formControl, getValues } = props.formState
    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_profiles`
    })

    const calendars = getValues("resource_calendars")?.reduce((acc, currItem) => {
        return {
            ...acc,
            [currItem.id]: currItem.name
        }
    }, {} as CalendarMap)

    const onNewPoolCreation = () => {
        append({
            id: "sid-" + uuid(),
            name: "",
            resource_list: []
        })
    }

    const onResourcePoolDeletion = (index: number) => {
        if (fields.length === 1) {
            setErrorMessage(MIN_LENGTH_REQUIRED_MSG("resource profile"))
            return
        }

        remove(index)
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
                                onResourcePoolDelete={onResourcePoolDeletion}
                                formState={props.formState}
                                calendars={calendars}
                                setErrorMessage={setErrorMessage}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default ResourcePools;