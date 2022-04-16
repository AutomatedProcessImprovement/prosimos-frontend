import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton, Link, Toolbar, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddButtonToolbar from "../toolbar/AddButtonToolbar";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { CalendarMap, JsonData, ResourceCalendar } from "../formData";
import ModifyCalendarDialog, { ModalInfo } from "./ModifyCalendarDialog";
import { AutoSizer } from "react-virtualized";
import { FixedSizeList } from "react-window";

export interface UpdateResourceCalendarRequest {
    isNew: boolean
    calendar: ResourceCalendar
    resourceListIndex: number
}

interface ResourceProfilesTableProps {
    poolUuid: string
    resourcePoolIndex: number
    formState: UseFormReturn<JsonData, object>
    errors: any
    calendars: CalendarMap
    setErrorMessage: (value: string) => void
    onResourceListCountChange: () => void
}

const ResourceProfilesTable = (props: ResourceProfilesTableProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [detailModal, setDetailModal] = useState<ModalInfo>()
    const { 
        formState: { control: formControl, trigger, setValue }, 
        resourcePoolIndex, calendars, errors, setErrorMessage
    } = props

    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_profiles.${resourcePoolIndex}.resource_list`
    });

    const { append: appendCalendar } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resource_calendars"
    });

    const onResourceProfileDelete = (index: number) => {
        if (fields.length === 1) {
            setErrorMessage("At least one resource should be provided")
            return
        }

        remove(index)
        props.onResourceListCountChange()
    };

    const getIdForNewResource = (poolUuid: string, lastElem: any) => {
        let nextResourceNum = 1
        let [lastResource] = lastElem

        if (lastResource) {
            const lastResourceId = lastResource.id
            nextResourceNum = Number(Number(lastResourceId.split('_').pop()!) + 1)
        }

        return poolUuid + "_" + nextResourceNum
    };

    const onResourceAdd = async () => {
        const lastItemIndex = fields.length - 1
        const arePrevResourcesValid = await trigger(`resource_profiles.${resourcePoolIndex}.resource_list.${lastItemIndex}`) // ?? true

        if (!arePrevResourcesValid) return

        append({
            id: getIdForNewResource(props.poolUuid, fields.slice(-1)),
            name: "",
            cost_per_hour: "",
            amount: "",
            calendar: Object.keys(calendars)[0]
        })

        // re-validate fields in the parent component only if we already have error about array length
        if (errors?.type === "min")
            trigger('resource_profiles')
    };

    const handleCloseModal = () => {
        setOpenModal(false)
    };

    const handleSaveModal = (r: UpdateResourceCalendarRequest) => {
        const calendar = {
            ...r.calendar,
            id: "sid-" + uuid()
        }
        if (r.isNew) {
            appendCalendar(calendar)
            setValue(
                `resource_profiles.${resourcePoolIndex}.resource_list.${r.resourceListIndex}.calendar`, 
                calendar.id,
                { shouldDirty: true })
        } else {
            setValue(
                `resource_profiles.${resourcePoolIndex}.resource_list.${r.resourceListIndex}.calendar`,
                r.calendar.id,
                { shouldDirty: true })
        }
    };

    const renderRow = ({ style, index, data }: any) => {
        const childrenRow = fields[index]

        const isError = errors?.[index]
        const nameError = isError && errors?.[index].name
        const costPerHourError = isError && errors?.[index].cost_per_hour
        const amountError = isError && errors?.[index].amount

        return <TableRow key={childrenRow.id} hover style={style}>
            <TableCell width="40%">
                <Controller
                    name={`resource_profiles.${resourcePoolIndex}.resource_list.${index}.name`}
                    control={formControl}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            style={{ width: "100%" }}
                            error={nameError !== undefined}
                            helperText={nameError?.message || ""}
                            variant="standard"
                            placeholder="Resource Name"
                        />
                    )}
                />
            </TableCell>
            <TableCell width="15%">
                <Controller
                    name={`resource_profiles.${resourcePoolIndex}.resource_list.${index}.cost_per_hour`}
                    control={formControl}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            error={costPerHourError !== undefined}
                            helperText={costPerHourError?.message || ""}
                            variant="standard"
                            inputProps={{
                                min: 0
                            }}
                            style={{ width: "100%" }}
                            placeholder="Cost"
                        />
                    )}
                />
            </TableCell>
            <TableCell width="15%">
                <Controller
                    name={`resource_profiles.${resourcePoolIndex}.resource_list.${index}.amount`}
                    control={formControl}
                    render={({ field: { onChange, ...others }}) => (
                        <TextField
                            {...others}
                            onChange={(e) => {
                                onChange(e)
                                props.onResourceListCountChange()
                            }}
                            type="number"
                            error={amountError !== undefined}
                            helperText={amountError?.message || ""}
                            variant="standard"
                            inputProps={{
                                min: 0
                            }}
                            style={{ width: "100%" }}
                            placeholder="Amount"
                        />
                    )}
                />
            </TableCell>
            <TableCell width="20%">
                <Controller
                    name={`resource_profiles.${resourcePoolIndex}.resource_list.${index}.calendar`}
                    control={formControl}
                    render={({ field: { value: calendarId} }) => (
                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            onClick={(e) => {
                                setDetailModal({
                                    poolIndex: resourcePoolIndex,
                                    resourceIndex: index,
                                    calendarId: calendarId
                                })
                                setOpenModal(true)
                            }}
                        >
                            <Typography>review</Typography>
                        </Link>
                    )}
                />
            </TableCell>
            <TableCell width="10%">
                <IconButton
                    size="small"
                    onClick={() => onResourceProfileDelete(index)}
                >
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    }

    return (
        <React.Fragment>
            <Toolbar sx={{ justifyContent: "flex-end", marginLeft: "auto" }}>
                <AddButtonToolbar
                    labelName="Add new resource"
                    onClick={onResourceAdd}
                />
            </Toolbar>
            <Table size="small" style={{ width: "90%", height: "35vh", margin: "auto" }}>
                <TableHead>
                    <TableRow>
                        <TableCell width="40%">Name</TableCell>
                        <TableCell width="15%">Cost per hour</TableCell>
                        <TableCell width="15%">Amount</TableCell>
                        <TableCell width="20%">Calendar</TableCell>
                        <TableCell width="10%">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <AutoSizer>
                        {({ height, width }) => (
                            <FixedSizeList
                                width={width}
                                height={height}
                                itemSize={65}
                                itemCount={fields.length}
                                itemData={fields}
                                itemKey={(i: number) => fields[i].key}
                                overscanCount={2}
                            >
                                {renderRow}
                            </FixedSizeList>
                        )}
                    </AutoSizer>
                </TableBody>
            </Table>
            {detailModal && <ModifyCalendarDialog
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                handleSaveModal={handleSaveModal}
                detailModal={detailModal}
                formState={props.formState}
            />}
        </React.Fragment>
    );
}

export default ResourceProfilesTable;
