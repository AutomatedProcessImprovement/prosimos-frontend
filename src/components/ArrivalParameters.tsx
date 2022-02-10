import { Grid, Paper, TableContainer } from "@mui/material";
import AddButtonToolbar from "./AddButtonToolbar";
import CalendarItem from "./CalendarItem";

interface ArrivalParametersProps {

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

const ArrivalParameters = (props: ArrivalParametersProps) => {
    return (
        <Grid container spacing={2}>
            <AddButtonToolbar
                onClick={() => console.log("f")}
                labelName="Add new calendar"
            />
            <TableContainer component={Paper}>
                <CalendarItem
                    items={example}/>
            </TableContainer>
        </Grid>
    );
}

export default ArrivalParameters;