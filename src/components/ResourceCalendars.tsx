import { alpha } from '@mui/material/styles'
import { Box, Button, Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import AddButtonToolbar from "./toolbar/AddButtonToolbar"
import TimePeriodItem from "./calendars/TimePeriodItem"
import DeleteButtonToolbar from './toolbar/DeleteButtonToolbar'


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

const defaultTemplateSchedule = {
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
}

const ResourceCalendars = (props: ResourceCalendarsProps) => {
    // TODO: will be removed once the logic merged with the main form
    const formState = useForm<AllResourceCalendars>({
        defaultValues: { calendars: example }
    })

    const { control: formControl } = formState
    const { handleSubmit } = formState

    const { fields, append: appendCalendarsFields, remove: removeCalendarsFields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "calendars"
    })

    const [selected, setSelected] = useState<readonly string[]>([])

    const onAddNewCalendar = () => {
        appendCalendarsFields(defaultTemplateSchedule)
    }

    const onDeleteCalendars = () => {
        const fieldsNames = fields.reduce((acc, curr) => acc.concat(curr.id), [] as string[])
        const selectedCalsIndex = selected.map((val) => fieldsNames.indexOf(val))

        removeCalendarsFields(selectedCalsIndex)
        setSelected([])
    }

    const onSubmit = (data: any) => console.log(data)

    const handleClick = (name: string) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected: readonly string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }

        setSelected(newSelected)
    }

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelectedIds = fields.map((n) => n.id)
            setSelected(newSelectedIds)
            return
        }

        setSelected([])
    }

    const numSelected = selected.length
    const calendarsCount = fields.length

    return (
        <form>
            <Grid container spacing={2}>
                <Toolbar
                    sx={{
                        width: "100%",
                        pl: { sm: 2 },
                        pr: { xs: 1, sm: 1 },
                        ...(numSelected > 0 && {
                            bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                        }),
                    }}>
                    <Grid container>
                        <Grid item xs={6} justifyContent="flex-start">
                            {numSelected > 0 && (
                                <Typography
                                    color="inherit"
                                >
                                    {selected.length} calendar(s) selected
                                </Typography>
                            )}
                        </Grid>

                        <Grid item container justifyContent="flex-end" xs={6}>
                            {numSelected > 0
                                ? <DeleteButtonToolbar
                                    onClick={onDeleteCalendars}
                                    labelName="Delete"
                                />
                                : <AddButtonToolbar
                                    onClick={onAddNewCalendar}
                                    labelName="Add new calendar"
                                />
                            }
                        </Grid>
                    </Grid>
                </Toolbar>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={numSelected > 0 && numSelected < calendarsCount}
                                        checked={calendarsCount > 0 && numSelected === calendarsCount}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Begin Day</TableCell>
                                <TableCell>End Day</TableCell>
                                <TableCell>Begin Time</TableCell>
                                <TableCell>End Time</TableCell>
                                <TableCell colSpan={2}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                fields.map((calendar, index) => {
                                    const isItemSelected = selected.indexOf(calendar.id) !== -1

                                    return <TimePeriodItem
                                        key={`calendar_${index}_${calendar.key}`}
                                        formState={formState}
                                        index={index}
                                        isItemSelected={isItemSelected}
                                        handleClick={handleClick}
                                    />
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <Button
                    onClick={handleSubmit(onSubmit)}>
                    Submit calendars
                </Button>
            </Grid>
        </form>
    )
}

export default ResourceCalendars;