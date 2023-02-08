import { Grid, MenuItem, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import TimePeriodGridItemsWithAdd from "./calendars/TimePeriodGridItemsWithAdd"
import { JsonData } from './formData'
import { defaultTemplateSchedule } from './simulationParameters/defaultValues'
import { MIN_LENGTH_REQUIRED_MSG } from './validationMessages'
import { defaultWorkWeekTimePeriod } from "./simulationParameters/defaultValues";
import DeleteButtonToolbar from "./toolbar/DeleteButtonToolbar"
import AddButtonToolbar from "./toolbar/AddButtonToolbar"
import CalendarNameDialog from "./profiles/CalendarNameDialog"
import { useSharedStyles } from "./sharedHooks/useSharedStyles"


interface ResourceCalendarsProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

const ResourceCalendars = (props: ResourceCalendarsProps) => {
    const { formState } = props
    const classes = useSharedStyles()
    const { control: formControl } = formState
    const { setErrorMessage } = props
    const [currCalendarIndex, setCurrCalendarIndex] = useState<number>()
    const [currCalendarKey, setCurrCalendarKey] = useState<string>("")
    const [isNameDialogOpen, setIsNameDialogOpen] = useState<boolean>(false)

    const { fields: allCalendars, prepend: prependCalendarFields, remove: removeCalendarsFields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resource_calendars"
    })

    const onAddNewCalendar = () => {
        setIsNameDialogOpen(true)
    };

    const onDeleteCalendars = () => {
        if (currCalendarIndex === undefined) {
            setErrorMessage("Calendar is not selected")
            return
        }

        if (allCalendars.length === 1) {
            setErrorMessage(MIN_LENGTH_REQUIRED_MSG("calendar"))
            return
        }

        removeCalendarsFields(currCalendarIndex)
        updateCurrCalendar(undefined)
    };

    const onNameDialogSave = (name: string) => {
        const newDefaultResourceCalendar = defaultTemplateSchedule(false, name)
        prependCalendarFields(newDefaultResourceCalendar)
        updateCurrCalendar(0)
        setIsNameDialogOpen(false)
    };

    const onNameDialogClose = () => {
        setIsNameDialogOpen(false)
    };

    const handleCalendarSelectChange = (event: any) => {
        const selectedCalendarIndex = event.target.value
        updateCurrCalendar(Number(selectedCalendarIndex))
    }

    const updateCurrCalendar = (index: number | undefined) => {
        setCurrCalendarIndex(index)

        if (index === undefined) {
            setCurrCalendarKey("")
        } else {
            const calendarKey = allCalendars[index]?.key || ""
            setCurrCalendarKey(calendarKey)
        }
    }

    return (
        <Grid container width="100%" spacing={2}>
            <Grid container item xs={12}>
                <Grid container item xs={8} className={classes.centeredGrid}>
                    <Grid item xs={8}>
                        <TextField
                            sx={{ width: "100%" }}
                            label="Calendar"
                            variant="standard"
                            value={currCalendarIndex ?? ''}
                            onChange={handleCalendarSelectChange}
                            select
                        >
                            {allCalendars.map((item, index) => {
                                const { key } = item
                                return <MenuItem
                                    key={`calendar_select_${key}`}
                                    value={index}
                                >
                                    {item.name}
                                </MenuItem>
                            })}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid item xs={2} className={classes.centeredGrid}>
                    <DeleteButtonToolbar
                        onClick={onDeleteCalendars}
                        labelName="Delete selected"
                    />
                </Grid>
                <Grid item xs={1} className={classes.centeredGrid}>
                    <AddButtonToolbar
                        onClick={onAddNewCalendar}
                        labelName="Add new"
                        variant="text"
                    />
                </Grid>
            </Grid>
            {(currCalendarIndex === undefined)
                ? <Grid xs={12} className={classes.centeredGrid} sx={{ p: 2 }}>
                    <Typography>
                        Please select the calendar to see its time periods
                    </Typography>
                </Grid>
                : <Grid xs={12} sx={{ p: 2 }}>
                    <TimePeriodList
                        key={`resource_calendars.${currCalendarKey}`}
                        formState={formState}
                        setErrorMessage={setErrorMessage}
                        calendarIndex={currCalendarIndex}
                        calendarKey={currCalendarKey}
                    />
                </Grid>
            }
            {isNameDialogOpen && <CalendarNameDialog
                modalOpen={isNameDialogOpen}
                handleClose={onNameDialogClose}
                handleSubmit={onNameDialogSave}
                dialogTitle="Create Calendar"
                isDialogTextShown={false}
            />}
        </Grid>
    )
}

interface TimePeriodListProps extends ResourceCalendarsProps {
    calendarIndex: number
    calendarKey: string
}

const TimePeriodList = (props: TimePeriodListProps) => {
    const { formState, calendarIndex, calendarKey } = props
    const { control } = formState
    const [index, setIndex] = useState<number>(calendarIndex)

    const { fields: currTimePeriods, append, remove } = useFieldArray({
        keyName: 'key',
        control: control,
        name: `resource_calendars.${index}.time_periods`
    })

    useEffect(() => {
        if (index !== calendarIndex) {
            setIndex(calendarIndex)
        }
    }, [calendarIndex, index])

    const onTimePeriodRemove = (index: number) => {
        remove(index)
    };

    const onTimePeriodAdd = () => {
        append(defaultWorkWeekTimePeriod)
    };

    return <TimePeriodGridItemsWithAdd
        key={`resource_calendars.${calendarKey}.time_periods`}
        fields={currTimePeriods}
        formState={formState}
        objectFieldNamePart={`resource_calendars.${calendarIndex}.time_periods` as unknown as keyof JsonData}
        onTimePeriodRemove={onTimePeriodRemove}
        onTimePeriodAdd={onTimePeriodAdd}
    />
}

export default ResourceCalendars;
