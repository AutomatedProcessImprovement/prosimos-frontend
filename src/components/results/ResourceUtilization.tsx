import { useEffect, useState } from "react";
import { TableContainer, Paper, Toolbar, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { secondsToNearest } from "../../helpers/timeConversions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    borderRight: {
        borderRight: "1px solid rgba(224, 224, 224, 1)"
    }
}));

interface ResourceUtilizationProps {
    data: any
}

enum COLUMNS_NAME {
    PoolName = "Pool name",
    ResourceName = "Resource name",
    UtilizationRatio = "Utilization Ratio",
    TasksAllocated = "Tasks Allocated",
    WorkedTime = "Worked Time (seconds)",
    AvailableTime = "Available Time (seconds)"
}

const ResourceUtilization = (props: ResourceUtilizationProps) => {
    const { data } = props
    const [processedData, setProcessedData] = useState(data)
    const classes = useStyles()

    useEffect(() => {
        const processed = data.map((item: any) => {
            const upd = Object.entries(item).reduce((acc: {}, [key, value]: any) => {
                let formatedValue = value

                if (typeof value == "number" && (key === COLUMNS_NAME.WorkedTime || key === COLUMNS_NAME.AvailableTime)) {
                    formatedValue = secondsToNearest(value)
                } else if (key === COLUMNS_NAME.UtilizationRatio) {
                    formatedValue = value.toFixed(3)
                }
                
                return {
                    ...acc,
                    [key]: formatedValue
                }
            }, {})

            return upd
        })

        setProcessedData(processed)
    }, [data])

    return (
        <TableContainer component={Paper}>
            <Toolbar >
                <Typography
                    variant="h6"
                >
                    Resource Utilization
                </Typography>
            </Toolbar>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={1}>
                            Pool Name
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Resource Name
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Utilization Ratio
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Tasks Allocated
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Worked Time
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Available Time
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processedData.map((row: any) => (
                        <TableRow key={`${row["Resource ID"]}`} hover>
                            <TableCell component="th" scope="row" className={classes.borderRight}>{row[COLUMNS_NAME.PoolName]}</TableCell>
                            <TableCell className={classes.borderRight}>{row[COLUMNS_NAME.ResourceName]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{row[COLUMNS_NAME.UtilizationRatio]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{row[COLUMNS_NAME.TasksAllocated]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{row[COLUMNS_NAME.WorkedTime]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{row[COLUMNS_NAME.AvailableTime]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ResourceUtilization;
