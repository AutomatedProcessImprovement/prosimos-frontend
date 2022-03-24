import { alpha } from '@mui/material/styles'
import { Checkbox, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material"
import { useState } from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import AddButtonToolbar from "./toolbar/AddButtonToolbar"
import TimePeriodTableRows from "./calendars/TimePeriodTableRows"
import DeleteButtonToolbar from './toolbar/DeleteButtonToolbar'
import { JsonData } from './formData'
import { defaultTemplateSchedule } from './simulationParameters/defaultValues'
import { MIN_LENGTH_REQUIRED } from './validationMessages'

interface ResourceCalendarsProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

const ResourceCalendars = (props: ResourceCalendarsProps) => {
    const { control: formControl } = props.formState
    const { setErrorMessage } = props

    const { fields, append: appendCalendarsFields, remove: removeCalendarsFields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: "resource_calendars"
    })

    const [selected, setSelected] = useState<readonly string[]>([])

    const onAddNewCalendar = () => {
        appendCalendarsFields(defaultTemplateSchedule(true))
    }

    const onDeleteCalendars = () => {
        if (fields.length === 1) {
            setErrorMessage(MIN_LENGTH_REQUIRED("calendar"))
            return
        }

        const fieldsNames = fields.reduce((acc, curr) => acc.concat(curr.id), [] as string[])
        const selectedCalsIndex = selected.map((val) => fieldsNames.indexOf(val))

        removeCalendarsFields(selectedCalsIndex)
        setSelected([])
    }

    const handleClick = (calendarId: string) => {
        const selectedIndex = selected.indexOf(calendarId)
        let newSelected: readonly string[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, calendarId)
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

                                return <TimePeriodTableRows
                                    key={`calendar_${index}_${calendar.key}`}
                                    formState={props.formState}
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
    )
}

export default ResourceCalendars;