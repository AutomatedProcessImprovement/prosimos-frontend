import React, { useEffect, useState } from "react";
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
import { AutoSizer } from "react-virtualized";
import { VariableSizeList } from "react-window";

const ROW_HEIGHT = 80;

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
    style: any
    handleExpansion: (i: number) => void
    rowOpenState: boolean
}

function Row(props: RowProps) {
    const { resourcePoolIndex } = props
    const [resourceListCount, setResourceListCount] = useState(0)
    const { resourceTypeUid, onResourcePoolDelete, formState: { control: formControl, getValues, formState: { errors } } } = props

    const { resource_profiles: resourceProfilesErrors } = errors as any
    const resourceListErrors = resourceProfilesErrors?.[resourcePoolIndex]
    const areAnyErrors = resourceListErrors?.name !== undefined || resourceListErrors?.resource_list !== undefined
    const errorMessage = resourceListErrors?.name?.message || resourceListErrors?.resource_list?.message

    const getResourceCount = (resourceListValues?: ResourceInfo[]) => {
        return resourceListValues
        ? (resourceListValues)
            .reduce(function (prev, curr) { return Number(prev) + Number(curr.amount) }, 0)
        : 0
    };

    useEffect(() => {
        const resourceListValues = getValues(`resource_profiles.${resourcePoolIndex}.resource_list`)
        const count = getResourceCount(resourceListValues)
        setResourceListCount(count)
    }, [getValues, resourcePoolIndex]);

    const onResourceListCountChange = () => {
        const resourceListValues = getValues(`resource_profiles.${resourcePoolIndex}.resource_list`)
        const count = getResourceCount(resourceListValues)
        setResourceListCount(count)
    };

    const onOpenRow = () => {
        props.handleExpansion(
            props.resourcePoolIndex
        )
    };

    const getHeightForRow = () => {
        if (!props.rowOpenState) {
            return { height: "inherit" }
        }
    }

    // const { ref: nameRef, ...inputProps } = register(`resource_profiles.${resourcePoolIndex}.name`);

    return (
        <React.Fragment>
            <TableRow style={{ ...props.style }} >
            <TableRow hover style={getHeightForRow()}>
                <TableCell style={{ width: "10%" }}>
                    <IconButton
                        size="small"
                        onClick={onOpenRow}
                    >
                        {props.rowOpenState ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell style={{ width: "70%" }}>
                    {/* <TextField
                        style={{ width: "100%" }}
                        error={areAnyErrors}
                        helperText={errorMessage}
                        variant="standard"
                        placeholder="Pool Name"
                        inputRef={nameRef}
                        {...inputProps}
                    /> */}
                    <Controller
                        name={`resource_profiles.${resourcePoolIndex}.name`}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field }) => {
                            return (
                                <TextField
                                    {...field}
                                    style={{ width: "100%" }}
                                    error={areAnyErrors}
                                    helperText={errorMessage}
                                    variant="standard"
                                    placeholder="Pool Name"
                                />
                            )
                        }}
                    />
                </TableCell>
                <TableCell style={{ width: "20%" }}>
                    {resourceListCount}
                </TableCell>
                <TableCell style={{ width: "10%" }}>
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
                    <Collapse in={props.rowOpenState} timeout="auto" unmountOnExit>
                        <Box margin={1} height={"45vh"}>
                            {resourceTypeUid && <ResourceProfilesTable
                                resourcePoolIndex={resourcePoolIndex}
                                poolUuid={resourceTypeUid}
                                formState={props.formState}
                                errors={resourceListErrors?.resource_list}
                                calendars={props.calendars}
                                setErrorMessage={props.setErrorMessage}
                                onResourceListCountChange={onResourceListCountChange}
                            />}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            </TableRow>
        </React.Fragment>
    );
}

const ResourcePools = (props: ResourcePoolsProps) => {
    const { setErrorMessage } = props
    const { control: formControl, getValues, trigger } = props.formState
    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_profiles`
    })
    const [isRowAdding, setIsRowAdding] = useState(false)

    const initialRowSizes = new Array(fields.length).fill(true).reduce((acc, item, i) => {
        acc[i] = ROW_HEIGHT;
        return acc;
    }, {})
    const [rowSizes, setRowSizes] = useState<number[]>(initialRowSizes)
    const initialRowState = Array(fields.length).fill(false)
    const [rowOpenState, setRowOpenState] = useState<boolean[]>(initialRowState)

    const ref = React.useRef<VariableSizeList>(null);

    const calendars = React.useCallback(() => getValues("resource_calendars")?.reduce((acc, currItem) => {
        return {
            ...acc,
            [currItem.id]: currItem.name
        }
    }, {} as CalendarMap), [getValues])

    useEffect(() => {
        if (isRowAdding) {
            if (ref?.current) {
                ref.current?.scrollToItem(fields.length-2, "start")
            }
            setIsRowAdding(false)
            // setFieldsLength(fields.length)
        }
      }, [fields, isRowAdding])

    const onNewPoolCreation = async () => {
        const arePrevResourcesValid = await trigger(`resource_profiles`)
        if (!arePrevResourcesValid) {
            setErrorMessage("Verify the correctness of all entered Resource Profiles")
            return
        }

        append({
            id: "sid-" + uuid(),
            name: "",
            resource_list: []
        })

        setIsRowAdding(true)
    };

    const onResourcePoolDeletion = (index: number) => {
        if (fields.length === 1) {
            setErrorMessage(MIN_LENGTH_REQUIRED_MSG("resource profile"))
            return
        }

        remove(index)
    };

    const getItemSize = (index: number) => {
        return rowSizes[index]
    };

    const handleExpansion = (i: number) => {
        if (ref.current) {
            ref.current && ref.current!.resetAfterIndex(i, false);
        }

        setRowSizes({
            ...rowSizes,
            [i]: rowSizes[i] === ROW_HEIGHT ? 5.5 * ROW_HEIGHT : ROW_HEIGHT
        })

        setRowOpenState({
            ...rowOpenState,
            [i]: !rowOpenState[i]
        })
    };

    const renderRow = ({ style, index, data }: any) => {
        const profile = fields[index]

        return (
            <Row key={profile.key}
                style={{...style}}
                resourcePoolIndex={index}
                resourceTypeUid={profile.id}
                onResourcePoolDelete={onResourcePoolDeletion}
                formState={props.formState}
                calendars={calendars()}
                setErrorMessage={setErrorMessage}
                handleExpansion={handleExpansion}
                rowOpenState={rowOpenState[index]}
            />
        )
    };

    return (
        <Grid container spacing={2}>
            <Toolbar sx={{ justifyContent: "flex-end", marginLeft: "auto" }}>
                <AddButtonToolbar
                    onClick={onNewPoolCreation}
                    labelName="Add new pool"
                />
            </Toolbar>

            <TableContainer component={Paper} style={{ width: "100%", height: "60vh" }}>
                <Table style={{ width: "100%", height: "100%" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Resource Profile</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    <AutoSizer>
                        {({ height, width }) => (
                            <VariableSizeList
                                ref={ref}
                                width={width}
                                height={height}
                                itemSize={getItemSize}
                                itemCount={fields.length}
                                itemData={fields}
                                itemKey={(i: number) => fields[i].key}
                                overscanCount={4}
                            >
                                {renderRow}
                            </VariableSizeList>
                        )}
                    </AutoSizer>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

export default ResourcePools;
