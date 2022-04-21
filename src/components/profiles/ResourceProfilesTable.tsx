import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, Toolbar } from "@mui/material";

import AddButtonToolbar from "../toolbar/AddButtonToolbar";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { CalendarMap, JsonData, ResourceCalendar } from "../formData";
import ModifyCalendarDialog, { ModalInfo } from "./ModifyCalendarDialog";
import { AutoSizer } from "react-virtualized";
import { FixedSizeList } from "react-window";
import ActionsColumn from "./ActionsColumn";

const colWidth = ["55%", "15%", "15%", "15%"]

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
    const [isRowAdding, setIsRowAdding] = useState<boolean>(false)
    
    const { 
        formState: { control: formControl, trigger, setValue, getValues, setFocus },
        resourcePoolIndex, calendars, errors, setErrorMessage
    } = props

    const { fields, prepend, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_profiles.${resourcePoolIndex}.resource_list`
    });

    const { append: appendCalendar } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resource_calendars"
    });

    useEffect(() => {
        if (isRowAdding) {
            setFocus(`resource_profiles.${resourcePoolIndex}.resource_list.1.name`)
            setIsRowAdding(false)
        }
    }, [fields, isRowAdding])

    const onResourceProfileDelete = (index: number) => {
        // TODO: after deleting, the table is scrolled to the first row (this behavior is not desired)
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
        if ((errors?.length > 0 && errors?.type !== "min") || (errors?.length > 1 && errors?.type === "min")) {
            setErrorMessage("Verify the correctness of all entered Resource Profiles")
            return
        }

        prepend({
            id: getIdForNewResource(props.poolUuid, fields.slice(-1)),
            name: "",
            cost_per_hour: 0,
            amount: 0,
            calendar: Object.keys(calendars)[0]
        })

        setIsRowAdding(true)

        if (errors?.type === "min")
            trigger('resource_profiles')
    };

    const handleCloseModal = () => {
        setOpenModal(false)
    };

    const handleSaveModal = (r: UpdateResourceCalendarRequest) => {
        let calendarId = ""

        if (r.isNew) {
            const calendar = {
                ...r.calendar,
                id: "sid-" + uuid()
            }
            appendCalendar(calendar)
            calendarId = calendar.id
        } else {
            calendarId = r.calendar.id 
        }

        setValue(
            `resource_profiles.${resourcePoolIndex}.resource_list.${r.resourceListIndex}.calendar`,
            calendarId,
            { shouldDirty: true }
        )
    };

    const renderRow = ({ style, index, data }: any) => {
        const childrenRow = fields[index]

        const isError = errors?.[index]
        const nameError = isError && errors?.[index].name
        const costPerHourError = isError && errors?.[index].cost_per_hour
        const amountError = isError && errors?.[index].amount

        const onViewCalendarClick = () => {
            setDetailModal({
                poolIndex: resourcePoolIndex,
                resourceIndex: index,
                calendarId: getValues(`resource_profiles.${resourcePoolIndex}.resource_list.${index}.calendar`)
            })
            setOpenModal(true)
        }

        return <TableRow key={childrenRow.id} hover style={{ ...style }}>
            <TableCell width={colWidth[0]} style = {{ 
                width: colWidth[0],
                height: "inherit",
                paddingTop: "0px",
                paddingBottom: "0px" }}
            >
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
            <TableCell width={colWidth[1]}>
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
            <TableCell width={colWidth[2]}>
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
            <TableCell width={colWidth[3]}>
                <ActionsColumn
                    onViewCalendarClick={onViewCalendarClick}
                    onDeleteClick={() => onResourceProfileDelete(index)}
                />
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
                        <TableCell width={colWidth[0]}>Name</TableCell>
                        <TableCell width={colWidth[1]}>Cost per hour</TableCell>
                        <TableCell width={colWidth[2]}>Amount</TableCell>
                        <TableCell width={colWidth[3]}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <AutoSizer>
                        {({ height, width }) => (
                            <FixedSizeList
                                width={width}
                                height={height}
                                itemSize={80}
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
