import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { AllResourceCalendars } from "../ResourceCalendars";
import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import TimePeriodItem from "./TimePeriodItem";

interface CalendarItemProps {
    calendarsState: FieldArrayWithId<AllResourceCalendars, "calendars", "key">[]
    formState: UseFormReturn<AllResourceCalendars, object>
}

const CalendarItem = (props: CalendarItemProps) => {
    const { formState, calendarsState } = props

    return (
        <Table>
            <TableHead>
                <TableRow>
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
                    calendarsState.map((calendar, index) => (
                        <TimePeriodItem
                            key={`calendar_${index}_${calendar.key}`}
                            formState={formState}
                            index={index}
                        />
                    ))
                }
            </TableBody>
        </Table>
    );
}

export default CalendarItem;
