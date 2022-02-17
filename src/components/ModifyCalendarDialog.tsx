import { Dialog, DialogTitle, DialogContent, Grid, TextField, DialogActions, Button, MenuItem } from "@mui/material";
import { useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import TimePeriodGridItem from "./calendars/TimePeriodGridItem";
import { JsonData, ResourceCalendar } from "./formData";
import { UpdateResourceCalendarRequest } from "./ResourceProfilesTable";

export interface ModalInfo {
    poolIndex: number
    resourceIndex: number
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
        detailModal: { poolIndex, resourceIndex }
    } = props
    const [currCalendarIndex, setCurrCalendarIndex] = useState<number>(resourceIndex)

    const allCalendars = getValues("resource_calendars")
    const currCalendar = allCalendars[currCalendarIndex]

    const formState = useForm<ResourceCalendar>({
        defaultValues: currCalendar
    })
    const { formState: modalFormState, control: modalFormControl, reset, getValues: getModalValues } = formState

    console.log(modalFormState.isDirty)

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
        handleSaveModal({
            isNew: modalFormState.isDirty,
            calendarIndex: currCalendarIndex,
            calendar: getModalValues()
        })
    }

    return (
        <Dialog open={openModal} onClose={handleCloseModal}
            PaperProps={{
                sx: {
                    minHeight: "30vh"
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
                            return (<Grid item xs={12}>
                                <TimePeriodGridItem
                                    key={`calendar_${currCalendarIndex}_${index}`}
                                    formState={formState}
                                    objectFieldName={`time_periods.${index}` as unknown as keyof ResourceCalendar}
                                />
                            </Grid>)
                        })}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={onModalSave}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ModifyCalendarDialog;
