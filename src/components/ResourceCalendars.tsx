import { Grid, MenuItem, TextField, Typography } from "@mui/material"
import { useState, useEffect, useMemo } from "react"
import { Controller, FieldArrayWithId, useFieldArray, UseFormReturn } from "react-hook-form"
import TimePeriodGridItemsWithAdd from "./calendars/TimePeriodGridItemsWithAdd"
import { GranuleSize, JsonData } from './formData'
import { defaultTemplateSchedule } from './simulationParameters/defaultValues'
import { MIN_LENGTH_REQUIRED_MSG } from './validationMessages'
import { defaultWorkWeekTimePeriod } from "./simulationParameters/defaultValues";
import DeleteButtonToolbar from "./toolbar/DeleteButtonToolbar"
import AddButtonToolbar from "./toolbar/AddButtonToolbar"
import CalendarNameDialog from "./profiles/CalendarNameDialog"
import { useSharedStyles } from "./sharedHooks/useSharedStyles"
import { collectAllAssignedCalendars } from "./calendars/assignedCalendarsCollector"
import { ModelType } from "./calendars/ModelType"
import ModelTypeSelect from "./calendars/ModelTypeSelect"
import { ConfirmationDialog } from "./calendars/ConfirmationDialog"
import CalendarFuzzyGranuleDialog from "./calendars/CalendarFuzzyGranuleDialog"
import { TimeUnit, convertTime } from "../helpers/timeConversions"
import WeekdayFilterCheckbox from "./calendars/WeekdayFilterCheckbox"


interface ResourceCalendarsProps {
    formState: UseFormReturn<JsonData, object>
    modelType: ModelType
    nextModelType?: ModelType
    handleModelTypeChange: (modelType: ModelType, granuleSize?:GranuleSize) => void
    onModelTypeChangeDialogOpen?: (event: any) => void
    onModelTypeChangeDialogClose: () => void
    isChangeModelTypeDialogOpen?: boolean
    setIsChangeModelTypeDialogOpen?: (value: boolean) => void
    isFuzzyDialogOpen?: boolean
    setIsFuzzyDialogOpen?: (value: boolean, modelType: ModelType) => void
    setErrorMessage: (value: string) => void
}

const ResourceCalendars = (props: ResourceCalendarsProps) => {
    const classes = useSharedStyles()
    const { formState: { control: formControl, getValues }, formState, setErrorMessage } = props
    const [currCalendarIndex, setCurrCalendarIndex] = useState<number>()
    const [currCalendarKey, setCurrCalendarKey] = useState<string>("")
    const [isNameDialogOpen, setIsNameDialogOpen] = useState<boolean>(false)
    const [assignedCalendars, setAssignedCalendars] = useState<Set<string>>(new Set())
    const weekdays = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    const [weekdayFilter, setWeekdayFilter] = useState<Array<string>>(weekdays);

    const { fields: allCalendars, prepend: prependCalendarFields, remove: removeCalendarsFields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resource_calendars"
    })

    const {modelType, nextModelType, handleModelTypeChange} = props
    const {isChangeModelTypeDialogOpen, setIsChangeModelTypeDialogOpen} = props
    const {onModelTypeChangeDialogOpen, onModelTypeChangeDialogClose} = props

    const onNameDialogOpen = () => {
        setIsNameDialogOpen(true)
    };

    useEffect(() => {
        const usedCalendars = collectAllAssignedCalendars(getValues("resource_profiles"))
        if (usedCalendars !== assignedCalendars) {
            setAssignedCalendars(usedCalendars)
        }        
    }, [])

    useEffect(() => {
        // once we get the new number of calendars, we:
        // either created a new one and redirect users to this newly created resource
        // or loading the page for the first time and select the first calendar in the list as an active one
        setCurrCalendarIndex(0)
    }, [allCalendars])

    useEffect(() => {
        // once index of the selected calendar changed,
        // we need to update the key accordingly
        updateCurrKey(currCalendarIndex)
    }, [currCalendarIndex])

    const onDeleteCalendars = () => {
        if (currCalendarIndex === undefined) {
            setErrorMessage("Calendar is not selected")
            return
        }

        if (allCalendars.length === 1) {
            setErrorMessage(MIN_LENGTH_REQUIRED_MSG("calendar"))
            return
        }

        const calendarName = getValues(`resource_calendars.${currCalendarIndex}.name`)
        if (assignedCalendars.has(calendarName)) {
            setErrorMessage("Calendar is assigned to one or many resources. Remove those assignments first")
            return
        }

        removeCalendarsFields(currCalendarIndex)
        updateCurrCalendar(undefined)
    };

    const onNameDialogSave = (name: string) => {
        // nullify selected option
        updateCurrCalendar(undefined)

        // add new calendar as the first one in the list
        const newDefaultResourceCalendar = defaultTemplateSchedule(false, name)
        prependCalendarFields(newDefaultResourceCalendar)

        onNameDialogClose()
    };

    const onNameDialogClose = () => {
        setIsNameDialogOpen(false)
    };

    const handleWeekdayFilterChange = (event: any) => {

        const selected = event.target.value as string[];
        if (selected.length > 0) {
            const sortedSelected = weekdays.filter(day => selected.includes(day));
            setWeekdayFilter(sortedSelected);
        }
    }

    const handleCalendarSelectChange = (event: any) => {
        const selectedCalendarIndex = event.target.value
        updateCurrCalendar(Number(selectedCalendarIndex))
    }

    const updateCurrCalendar = (index?: number) => {
        // update index
        setCurrCalendarIndex(index)

        // update key
        updateCurrKey(index)
    }

    const updateCurrKey = (currIndex?: number) => {
        if (currIndex === undefined) {
            setCurrCalendarKey("")
        } else {
            const calendarKey = allCalendars[currIndex]?.key || ""
            setCurrCalendarKey(calendarKey)
        }
    } 

    return (
        <Grid container width="100%" spacing={2}>
            <Grid container item xs={12}>
                <Grid container item xs={4}>
                    <Grid item xs={9}>
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
                <Grid container item xs={3}>
                    <Grid item xs={9} className={classes.centeredGrid}>   
                    <WeekdayFilterCheckbox
                        label="Weekday"
                        value={weekdayFilter}
                        onChange={handleWeekdayFilterChange}
                    />           
                    </Grid>
                </Grid>
                <Grid item xs={1} className={classes.centeredGrid}>   
                    <ModelTypeSelect
                        label="Model type"
                        value={modelType}
                        onChange={onModelTypeChangeDialogOpen}
                    />             
                </Grid>
                <Grid item xs={2} className={classes.centeredGrid}>
                    <DeleteButtonToolbar
                        onClick={onDeleteCalendars}
                        labelName="Delete selected"
                    />
                </Grid>
                <Grid item xs={2} className={classes.centeredGrid}>
                    <AddButtonToolbar
                        onClick={onNameDialogOpen}
                        labelName="new calendar"
                        variant="text"
                        tooltipText="Add new calendar"
                    />
                </Grid>
            </Grid>
            {(currCalendarIndex === undefined)
                ? <Grid item xs={12} className={classes.centeredGrid} sx={{ p: 2 }}>
                    <Typography>
                        Please select the calendar to see its time periods
                    </Typography>
                </Grid>
                : <Grid item xs={12} sx={{ p: 2 }}>
                    <TimePeriodList
                        key={`resource_calendars.${currCalendarKey}`}
                        formState={formState}
                        modelType={modelType}
                        nextModelType={nextModelType}
                        weekdayFilter={weekdayFilter}
                        handleModelTypeChange={handleModelTypeChange}
                        onModelTypeChangeDialogClose={onModelTypeChangeDialogClose}
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
            {isChangeModelTypeDialogOpen && nextModelType === ModelType.CRISP && <ConfirmationDialog 
                modalOpen={isChangeModelTypeDialogOpen}
                message="Are you sure you want to change model type?"
                onConfirm={ () => { 
                    console.error(`NEXT MODEL TYPE: ${nextModelType}`)
                    handleModelTypeChange(nextModelType)
                }}
                onCancel={onModelTypeChangeDialogClose}
            />}
            {isChangeModelTypeDialogOpen && nextModelType === ModelType.FUZZY && <CalendarFuzzyGranuleDialog 
                modalOpen={isChangeModelTypeDialogOpen}
                message="In order to swtich to FUZZY you need to specify granule size"
                onConfirm={ (timeUnit, timeValue) => { 
                    const timeInSeconds = convertTime(timeValue, TimeUnit[timeUnit.toUpperCase() as keyof typeof TimeUnit], TimeUnit.SECONDS);
                    const oneDayInSeconds = convertTime(1, TimeUnit.DAYS, TimeUnit.SECONDS);
                    if(timeInSeconds > 0 && timeInSeconds <= oneDayInSeconds && oneDayInSeconds % timeInSeconds === 0) {
                        const granuleSize: GranuleSize = {
                            time_unit: timeUnit, 
                            value: timeValue
                        }
                        handleModelTypeChange(nextModelType, granuleSize)
                    } else {
                        setErrorMessage("Invalid granule size. The size should be greater than 1 second, less than 1 day, and 1 day should be divisible by this size without a remainder.")
                    }
                }}
                onCancel={onModelTypeChangeDialogClose}
            />}
        </Grid>
    )
}

interface TimePeriodListProps extends ResourceCalendarsProps {
    calendarIndex: number
    calendarKey: string
    modelType: ModelType    
    nextModelType: any
    weekdayFilter: Array<string>
    handleModelTypeChange: (modelType: ModelType) => void
}

type DayNumbers = { [key: string]: number };
const TimePeriodList = (props: TimePeriodListProps) => {
    const { formState, calendarIndex, calendarKey, modelType, weekdayFilter } = props
    const { control } = formState
    const [index, setIndex] = useState<number>(calendarIndex)

    const { fields: currTimePeriods, append, remove } = useFieldArray({
        keyName: 'key',
        control: control,
        name: `resource_calendars.${index}.time_periods`
    })

    const filteredTimePeriods = useMemo(() => {
        const daysAsNumbers: DayNumbers = {
          "MONDAY": 1,
          "TUESDAY": 2,
          "WEDNESDAY": 3,
          "THURSDAY": 4,
          "FRIDAY": 5,
          "SATURDAY": 6,
          "SUNDAY": 7,
        };
      
        const filterRange = weekdayFilter.map((weekday) => daysAsNumbers[weekday]);
      
        return currTimePeriods.map((period) => {
          const periodRange = [];
          let fromDay = daysAsNumbers[period.from];
          let toDay = daysAsNumbers[period.to];
      
          for (let i = fromDay; i <= toDay; i++) {
            periodRange.push(i);
          }
      
          const isDisplayed = periodRange.every(val => filterRange.includes(val));
      
          return { ...period, isDisplayed };
        });
      }, [currTimePeriods, weekdayFilter, append]);
    
    useEffect(() => {
        if (index !== calendarIndex) {
            setIndex(calendarIndex)
        }
    }, [calendarIndex, index])

    const onTimePeriodRemove = (index: number) => {
        remove(index)
    };

    const onTimePeriodAdd = () => {
        const isMondayToFriday = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].every(weekday =>
          weekdayFilter.includes(weekday)
        );
      
        if (!isMondayToFriday) {
            let newWrokWeekTimePeriod = defaultWorkWeekTimePeriod
            newWrokWeekTimePeriod.from = weekdayFilter[0];
            newWrokWeekTimePeriod.to = weekdayFilter[0];
            append(newWrokWeekTimePeriod)
        } else {
            append(defaultWorkWeekTimePeriod);
        }
      };
      

    return <TimePeriodGridItemsWithAdd
        key={`resource_calendars.${calendarKey}.time_periods`}
        fields={filteredTimePeriods}
        formState={formState}
        modelType={modelType}
        objectFieldNamePart={`resource_calendars.${calendarIndex}.time_periods` as unknown as keyof JsonData}
        onTimePeriodRemove={onTimePeriodRemove}
        onTimePeriodAdd={onTimePeriodAdd}
    />
}


export default ResourceCalendars;
