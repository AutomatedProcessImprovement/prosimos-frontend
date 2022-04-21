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
const OPEN_ROW_HEIGHT = 5.5 * ROW_HEIGHT;

const removeArrayElemByIndex = (index: number, arr: any []) => {
    const copyArray = [...arr]
    for (var i = 0; i < copyArray.length; i++) { 
        if (i === index) { 
            copyArray.splice(i, 1); 
        }
    }

    return copyArray
}

export interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: number
    amount: number
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

const Row = (props: RowProps) => {
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
                    <Controller
                        name={`resource_profiles.${resourcePoolIndex}.name`}
                        control={formControl}
                        rules={{ required: REQUIRED_ERROR_MSG }}
                        render={({ field: { ref, ...others } }) => {
                            return (
                                <TextField
                                    inputRef={ref}
                                    {...others}
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
};

const ResourcePools = (props: ResourcePoolsProps) => {
    const { setErrorMessage } = props
    const { control: formControl, getValues, trigger, setFocus } = props.formState
    const { fields, prepend, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_profiles`
    })
    const [isRowAdding, setIsRowAdding] = useState(false)

    const initialRowSizes = new Array(fields.length).fill(ROW_HEIGHT)
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
            setFocus(`resource_profiles.1.name`)
            setIsRowAdding(false)
        }

      }, [fields, isRowAdding])

    const onNewPoolCreation = async () => {
        const arePrevResourcesValid = await trigger(`resource_profiles`)
        if (!arePrevResourcesValid) {
            setErrorMessage("Verify the correctness of all entered Resource Profiles")
            return
        }

        prepend( {
            id: "sid-" + uuid(),
            name: `Resource Group ${fields.length}`,
            resource_list: []
        })

        setIsRowAdding(true)

        const openRow = false
        setRowOpenState([
            openRow,
            ...rowOpenState,
        ])
        setRowSizes([
            (openRow ? OPEN_ROW_HEIGHT : ROW_HEIGHT),
            ...rowSizes,
        ])

        if (ref.current) {
            ref.current && ref.current!.resetAfterIndex(0);
        }
    };

    const onResourcePoolDeletion = (index: number) => {
        if (fields.length === 1) {
            setErrorMessage(MIN_LENGTH_REQUIRED_MSG("resource profile"))
            return
        }

        remove(index)

        setRowSizes(removeArrayElemByIndex(index, rowSizes))
        setRowOpenState(removeArrayElemByIndex(index, rowOpenState))

        if (ref.current) {
            ref.current && ref.current!.resetAfterIndex(0);
        }
    };

    const getItemSize = (index: number) => {
        return rowSizes[index]
    };

    const handleExpansion = (i: number) => {
        if (ref.current) {
            ref.current && ref.current!.resetAfterIndex(i, false);
        }

        setRowSizes([
            ...rowSizes.slice(0, i),
            rowSizes[i] === ROW_HEIGHT ? OPEN_ROW_HEIGHT : ROW_HEIGHT,
            ...rowSizes.slice(i+1)
        ])

        setRowOpenState([
            ...rowOpenState.slice(0, i),
            !rowOpenState[i],
            ...rowOpenState.slice(i+1),
        ])
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
                            <TableCell style={{ width: "10%" }}></TableCell>
                            <TableCell style={{ width: "70%" }}>Resource Profile</TableCell>
                            <TableCell style={{ width: "20%" }}>Amount</TableCell>
                            <TableCell style={{ width: "10%" }}>Actions</TableCell>
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
