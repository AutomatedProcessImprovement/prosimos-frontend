import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton, Link, Toolbar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddButtonToolbar from "../toolbar/AddButtonToolbar";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { CalendarMap, JsonData, ResourceCalendar } from "../formData";
import ModifyCalendarDialog, { ModalInfo } from "./ModifyCalendarDialog";

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
    })

    const { append: appendCalendar } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resource_calendars"
    })

    const onResourceProfileDelete = (index: number) => {
        if (fields.length === 1) {
            setErrorMessage("At least one resource should be provided")
            return
        }

        remove(index)
    }

    const getIdForNewResource = (poolUuid: string, lastElem: any) => {
        let nextResourceNum = 1
        let [lastResource] = lastElem

        if (lastResource) {
            const lastResourceId = lastResource.id
            nextResourceNum = Number(Number(lastResourceId.split('_').pop()!) + 1)
        }

        return poolUuid + "_" + nextResourceNum
    }

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
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

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
    }

    return (
        <React.Fragment>
            <Toolbar sx={{ justifyContent: "flex-end", marginLeft: "auto" }}>
                <AddButtonToolbar
                    labelName="Add new resource"
                    onClick={onResourceAdd}
                />
            </Toolbar>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Cost per hour</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Calendar</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((childrenRow: any, index: any) => {
                        const isError = errors?.[index] //errors !== undefined && errors[index] !== undefined
                        const nameError = isError && errors?.[index].name
                        const costPerHourError = isError && errors?.[index].cost_per_hour
                        const amountError = isError && errors?.[index].amount

                        return <TableRow key={childrenRow.id} hover>
                            <TableCell>
                                <Controller
                                    name={`resource_profiles.${resourcePoolIndex}.resource_list.${index}.name`}
                                    control={formControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={nameError !== undefined}
                                            helperText={nameError?.message || ""}
                                            variant="standard"
                                            placeholder="Resource Name"
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
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
                                            style={{ width: "50%" }}
                                            placeholder="Cost"
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Controller
                                    name={`resource_profiles.${resourcePoolIndex}.resource_list.${index}.amount`}
                                    control={formControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            error={amountError !== undefined}
                                            helperText={amountError?.message || ""}
                                            variant="standard"
                                            inputProps={{
                                                min: 0
                                            }}
                                            style={{ width: "50%" }}
                                            placeholder="Amount"
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
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
                                            {calendars[calendarId]}
                                        </Link>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => onResourceProfileDelete(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    })}
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
