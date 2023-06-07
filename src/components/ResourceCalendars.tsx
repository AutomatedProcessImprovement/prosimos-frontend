import { Grid, MenuItem, TextField, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { GranuleSize, JsonData } from './formData'
import { defaultTemplateSchedule } from './simulationParameters/defaultValues'
import { MIN_LENGTH_REQUIRED_MSG } from './validationMessages'
import DeleteButtonToolbar from "./toolbar/DeleteButtonToolbar"
import AddButtonToolbar from "./toolbar/AddButtonToolbar"
import CalendarNameDialog from "./profiles/CalendarNameDialog"
import { useSharedStyles } from "./sharedHooks/useSharedStyles"
import { collectAllAssignedCalendars } from "./calendars/assignedCalendarsCollector"
import { ModelType } from "./calendars/ModelType"
import ModelTypeSelect from "./calendars/ModelTypeSelect"
import { ConfirmationDialog } from "./calendars/ConfirmationDialog"
import CalendarFuzzyGranuleDialog from "./calendars/CalendarFuzzyGranuleDialog"
import { TimeUnit, convertTime, DAYS_OF_WEEK } from "../helpers/timeConversions"
import WeekdayFilterCheckbox from "./calendars/WeekdayFilterCheckbox"
import TimePeriodList from "./calendars/TimePeriodList"
import ButtonToolbarBase from "./toolbar/ButtonToolbarBase"
import EditIcon from '@mui/icons-material/Edit';


interface ResourceCalendarsProps {
    formState: UseFormReturn<JsonData, object>
    modelType: ModelType
    handleModelTypeChange: (modelType: ModelType, granuleSize?:GranuleSize) => void
    setErrorMessage: (value: string) => void
}

const ResourceCalendars = (props: ResourceCalendarsProps) => {
    const classes = useSharedStyles()
    const { formState: { control: formControl, getValues }, formState, setErrorMessage } = props
    const [currCalendarIndex, setCurrCalendarIndex] = useState<number>()
    const [currCalendarKey, setCurrCalendarKey] = useState<string>("")
    const [isNameDialogOpen, setIsNameDialogOpen] = useState<boolean>(false)
    const [assignedCalendars, setAssignedCalendars] = useState<Set<string>>(new Set())
    const [weekdayFilter, setWeekdayFilter] = useState<Array<string>>(DAYS_OF_WEEK);
    const [nextModelType, setNextModelType] = useState<ModelType>()
    const [isChangeModelTypeDialogOpen, setIsChangeModelTypeDialogOpen] = useState(false);


    const { fields: allCalendars, prepend: prependCalendarFields, remove: removeCalendarsFields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resource_calendars"
    })

    const {modelType, handleModelTypeChange} = props
    

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

    const onModelTypeChangeDialogOpen = (event:any) => {
        setIsChangeModelTypeDialogOpen(true)
        const nextModelType = event.target.value
        setNextModelType(nextModelType) 
    }

    const onModelTypeChangeDialogClose = () => {
        setIsChangeModelTypeDialogOpen(false)
    }

    const handleWeekdayFilterChange = (event: any) => {

        const selected = event.target.value as string[];
        if (selected.length > 0) {
            const sortedSelected = DAYS_OF_WEEK.filter(day => selected.includes(day));
            setWeekdayFilter(sortedSelected);
        }
    }

    const handleCalendarSelectChange = (event: any) => {
        const selectedCalendarIndex = event.target.value
        updateCurrCalendar(Number(selectedCalendarIndex))
    }

    const isValidTimeInSeconds = (timeInSeconds: number, oneDayInSeconds: number): boolean => {
        return timeInSeconds > 0 && timeInSeconds <= oneDayInSeconds && oneDayInSeconds % timeInSeconds === 0;
    }
    
    const createGranuleSize = (timeUnit: string, timeValue: number): GranuleSize => {
        return {
            time_unit: timeUnit, 
            value: timeValue
        };
    }

    const handleTimeAndValueSubmission = (timeUnit: string, timeValue: number) => {
        const timeInSeconds = convertTime(timeValue, TimeUnit[timeUnit.toUpperCase() as keyof typeof TimeUnit], TimeUnit.Seconds);
        const timeInDay = TimeUnit.Days

        if(isValidTimeInSeconds(timeInSeconds, timeInDay)) {
            const granuleSize = createGranuleSize(timeUnit, timeValue);
            handleModelTypeChange(nextModelType || ModelType.FUZZY, granuleSize)
            setIsChangeModelTypeDialogOpen(false)
        } 
        else {
            setErrorMessage("Invalid granule size. The size should be greater than 1 second, less than 1 day, and 1 day should be divisible by this size without a remainder.")
        }
    } 

    const handleCrispSubmission = (nextModelType: ModelType) => {
        handleModelTypeChange(nextModelType)
        setIsChangeModelTypeDialogOpen(false)
    }

    const handleEditGranuleChangeButtonClick = () => {
        setNextModelType(ModelType.FUZZY)
        setIsChangeModelTypeDialogOpen(true)
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
                <Grid container item xs={3}>
                    <Grid item xs={10}>
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
                <Grid container item xs={2}>
                    <Grid item xs={9} className={classes.centeredGrid}>   
                    <WeekdayFilterCheckbox
                        label="Weekday"
                        value={weekdayFilter}
                        onChange={handleWeekdayFilterChange}
                    />           
                    </Grid>
                </Grid>
                <Grid container item xs={3} spacing={2}>
                    <Grid item xs={4} className={classes.centeredGrid}>   
                        <ModelTypeSelect
                            label="Model type"
                            value={modelType}
                            onChange={onModelTypeChangeDialogOpen}
                        />             
                    </Grid>
                    { modelType === ModelType.FUZZY &&
                    <Grid item xs={6} className={classes.centeredGrid}>   
                            <ButtonToolbarBase
                                onClick={handleEditGranuleChangeButtonClick}
                                labelName="Edit granule size"
                                startIcon={<EditIcon/>}
                                variant="text"
                                tooltipText="Edit granule size"
                            />
                    </Grid>}
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
                        weekdayFilter={weekdayFilter}
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
                onConfirm={ () => { handleCrispSubmission(nextModelType) }}
                onCancel={onModelTypeChangeDialogClose}
            />}
            {isChangeModelTypeDialogOpen && nextModelType === ModelType.FUZZY && <CalendarFuzzyGranuleDialog 
                modalOpen={isChangeModelTypeDialogOpen}
                message="Specify granule size for the Fuzzy model."
                onConfirm={handleTimeAndValueSubmission}
                onCancel={onModelTypeChangeDialogClose}
            />}
        </Grid>
    )
}

export default ResourceCalendars;
