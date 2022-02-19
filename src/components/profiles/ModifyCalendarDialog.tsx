import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import CalendarNameDialog from "./CalendarNameDialog";
import TimePeriodGridItem from "../calendars/TimePeriodGridItem";
import { JsonData, ResourceCalendar } from "../formData";
import { UpdateResourceCalendarRequest } from "./ResourceProfilesTable";
import AddButtonBase from "../toolbar/AddButtonBase";

export interface ModalInfo {
    poolIndex: number
    resourceIndex: number
    calendarId: string
}

interface ModifyCalendarDialogProps {
    openModal: boolean
    handleCloseModal: () => void
    handleSaveModal: (r: UpdateResourceCalendarRequest) => void
    detailModal: ModalInfo
    formState: UseFormReturn<JsonData, object>
}

const ModifyCalendarDialog = (props: ModifyCalendarDialogProps) => {
    const {
        openModal, handleCloseModal, handleSaveModal,
        formState: { getValues },
        detailModal: { poolIndex, resourceIndex, calendarId }
    } = props
    const [currCalendarIndex, setCurrCalendarIndex] = useState<number>()
    const [isNameDialogOpen, setIsNameDialogOpen] = useState<boolean>(false)
    const allCalendars = getValues("resource_calendars")

    useEffect(() => {
        const currCalendarIndex = allCalendars.findIndex((item) => item.id === calendarId)
        setCurrCalendarIndex(currCalendarIndex)
    }, [calendarId, allCalendars])

    const currCalendar = (currCalendarIndex !== undefined) ? allCalendars[currCalendarIndex] : {} 
    const formState = useForm<ResourceCalendar>({
        mode: "onBlur", // validate on blur
        defaultValues: currCalendar
    })
    const { formState: { isDirty, dirtyFields }, control: modalFormControl, reset, getValues: getModalValues } = formState

    useEffect(() => {
        const currCalendar = (currCalendarIndex !== undefined) ? allCalendars[currCalendarIndex] : {}
        reset(currCalendar)
    }, [currCalendarIndex, allCalendars, reset])

    const { fields: currTimePeriods, append, remove } = useFieldArray({
        keyName: 'key',
        control: modalFormControl,
        name: `time_periods`
    })

    const handleCalendarSelectChange = (event: any) => {
        const selectedCalendarIndex = event.target.value
        setCurrCalendarIndex(Number(selectedCalendarIndex))
        
        const newSelectedCalendar = allCalendars[selectedCalendarIndex]
        reset(newSelectedCalendar)
    }

    const onModalSave = () => {
        if (isDirty) {
            setIsNameDialogOpen(true)
        } else {
            handleSaveModal({
                isNew: false,
                calendar: getModalValues(),
                resourceListIndex: resourceIndex
            })
            handleCloseModal()
        }
    }

    const onNameDialogClose = () => {
        setIsNameDialogOpen(false)
    }

    const onModalFinalSave = (name: string) => {
        handleSaveModal({
            isNew: isDirty,
            calendar: {
                ...getModalValues(),
                name: name
            },
            resourceListIndex: resourceIndex
        })
        setIsNameDialogOpen(false)
        handleCloseModal()
    }

    const onTimePeriodRemove = (index: number) => {
        remove(index)
    }

    const onTimePeriodAdd = () => {
        append({
            from: "MONDAY",
            to: "THURSDAY",
            beginTime: "09:00:00.000",
            endTime: "17:00:00.000"
        })
    }

    return (
        <Dialog open={openModal} onClose={handleCloseModal}
            PaperProps={{
                sx: {
                    minHeight: "30vh",
                    maxHeight: "40vh"
                }
            }}
        >
            <DialogTitle>Modify calendar</DialogTitle>
            <DialogContent>
                <Grid container width="100%" spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            sx={{ width: "100%" }}
                            label="Calendar"
                            variant="standard"
                            value={currCalendarIndex}
                            onChange={handleCalendarSelectChange}
                            select
                        >
                            {allCalendars.map((item, index) => (
                                <MenuItem
                                    key={`calendar_select_${index}`}
                                    value={index}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} container spacing={2}>
                        {currTimePeriods.map((item, index: number) => {
                            return (
                                <Grid item xs={12} key={`grid_calendar_${currCalendarIndex}_${index}`}>
                                    <TimePeriodGridItem
                                        key={`calendar_${currCalendarIndex}_${index}`}
                                        formState={formState}
                                        objectFieldName={`time_periods.${index}` as unknown as keyof ResourceCalendar}
                                        isWithDeleteButton={true}
                                        timePeriodIndex={index}
                                        onDelete={onTimePeriodRemove}
                                    />
                                </Grid>
                            )
                        })}
                        <Grid item xs={12}>
                            <AddButtonBase
                                labelName="Add a time period"
                                onClick={onTimePeriodAdd}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={onModalSave}>Save</Button>
            </DialogActions>
            {isNameDialogOpen &&
            <CalendarNameDialog
                modalOpen={isNameDialogOpen}
                handleClose={onNameDialogClose}
                handleSubmit={onModalFinalSave}
            />}
        </Dialog>
    )
}

export default ModifyCalendarDialog;
