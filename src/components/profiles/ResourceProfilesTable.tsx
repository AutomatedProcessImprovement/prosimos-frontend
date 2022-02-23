import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton, Link, Toolbar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddButtonToolbar from "../toolbar/AddButtonToolbar";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { CalendarMap, JsonData, ResourceCalendar } from "../formData";
import { REQUIRED_ERROR_MSG } from "../validationMessages";
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
}

const ResourceProfilesTable = (props: ResourceProfilesTableProps) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [detailModal, setDetailModal] = useState<ModalInfo>()
    const { formState: { control: formControl, trigger, setValue }, resourcePoolIndex, calendars } = props
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
        remove(index)
    }

    const onResourceAdd = async () => {
        const arePrevResourcesValid = await trigger(`resource_profiles.${resourcePoolIndex}.resource_list`)

        if (!arePrevResourcesValid) return

        let nextResourceNum = 1
        let [lastResource] = fields.slice(-1)

        if (lastResource) {
            const lastResourceId = lastResource.id
            nextResourceNum = Number(Number(lastResourceId.split('_').pop()!) + 1)
        }

        append({
            id: props.poolUuid + "_" + nextResourceNum,
            name: "",
            cost_per_hour: "",
            amount: "",
            calendar: Object.keys(calendars)[0]
        })
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
                        const isError = props.errors && props.errors[index]
                        const nameError = isError && props.errors[index].name
                        const costPerHourError = isError && props.errors[index].cost_per_hour
                        const amountError = isError && props.errors[index].amount

                        return <TableRow key={childrenRow.id} hover>
                            <TableCell>
                                <Controller
                                    name={`resource_profiles.${resourcePoolIndex}.resource_list.${index}.name`}
                                    control={formControl}
                                    rules={{ required: REQUIRED_ERROR_MSG }}
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
                                    rules={{ required: REQUIRED_ERROR_MSG }}
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
                                    rules={{ required: REQUIRED_ERROR_MSG }}
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
