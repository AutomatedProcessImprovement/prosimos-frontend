import { Button, Grid, Paper, TableContainer } from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import AddButtonToolbar from "./AddButtonToolbar";
import CalendarItem from "./calendars/CalendarItem";

interface ResourceCalendarsProps {

}

interface TimePeriod {
    from: string
    to: string
    beginTime: string
    endTime: string
}

export interface ResourceCalendar {
    id: string
    time_periods: TimePeriod[]
}

export interface AllResourceCalendars {
    calendars: ResourceCalendar[]
}

const example = [
    {
        id: "first schedule",
        time_periods: [
            {
                from: "MONDAY",
                to: "FRIDAY",
                beginTime: "09:00:00.000",
                endTime: "17:00:00.000"
            },
            {
                from: "SATURDAY",
                to: "SATURDAY",
                beginTime: "09:00:00.000",
                endTime: "13:00:00.000"
            }
        ]
    },
    {
        id: "second schedule",
        time_periods: [
            {
                from: "MONDAY",
                to: "THURSDAY",
                beginTime: "09:00:00.000",
                endTime: "17:00:00.000"
            },
            {
                from: "SATURDAY",
                to: "SATURDAY",
                beginTime: "09:00:00.000",
                endTime: "13:00:00.000"
            }
        ]
    }
]

const ResourceCalendars = (props: ResourceCalendarsProps) => {
    // TODO: will be removed once the logic merged with the main form
    const formState = useForm<AllResourceCalendars>({
        defaultValues: { calendars: example }
    })

    const { control: formControl } = formState

    const { fields, append: appendCalendarsFields, remove: removeCalendarsFields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "calendars"
    })

    const { handleSubmit } = formState
    console.log(fields)

    const onAddNewCalendar = () => {
        appendCalendarsFields({
            id: "default schedule",
            time_periods: [
                {
                    from: "MONDAY",
                    to: "THURSDAY",
                    beginTime: "09:00:00.000",
                    endTime: "17:00:00.000"
                },
                {
                    from: "SATURDAY",
                    to: "SATURDAY",
                    beginTime: "09:00:00.000",
                    endTime: "13:00:00.000"
                }
            ]
        })
    }

    const onSubmit = (data: any) => console.log(data)

    return (
        <form>
        <Grid container spacing={2}>
            <AddButtonToolbar
                onClick={onAddNewCalendar}
                labelName="Add new calendar"
            />
            <TableContainer component={Paper}>
                <CalendarItem
                    calendarsState={fields}
                    formState={formState}/>
            </TableContainer>
        </Grid>
        <Grid item xs={12}>
            <Button
                onClick={handleSubmit(onSubmit)}>
                Submit calendars
            </Button>
        </Grid>
        </form>
    );
}

export default ResourceCalendars;