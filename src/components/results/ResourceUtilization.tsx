import { useEffect, useState } from "react";
import { TableContainer, Paper, Toolbar, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { millisecondsToNearest } from "../../helpers/timeConversions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    borderRight: {
        borderRight: "1px solid rgba(224, 224, 224, 1)"
    }
}));

interface ResourceUtilizationProps {
    data: any
}

const ResourceUtilization = (props: ResourceUtilizationProps) => {
    const { data } = props
    const [processedData, setProcessedData] = useState(data)
    const classes = useStyles()

    useEffect(() => {
        const processed = data.map((item: any) => {
            const upd = Object.entries(item).reduce((acc: {}, [key, value]: any) => {
                const shouldValueBeUpdated = (typeof value == "number" && key !== "Tasks Allocated")
                const formatedValue = shouldValueBeUpdated ? value.toFixed(1) : value

                return {
                    ...acc,
                    [key]: formatedValue
                }
            }, {})

            return upd
        })

        setProcessedData(processed)
    }, [data])

    const formatSeconds = (seconds: string) => {
        const secNum = parseFloat(seconds)
        const millisecNum = secNum * 1000
        return millisecondsToNearest(millisecNum.toString())
    };

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
                            <TableCell component="th" scope="row" className={classes.borderRight}>{row["Pool name"]}</TableCell>
                            <TableCell className={classes.borderRight}>{row["Resource name"]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{row["Utilization Ratio"]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{row["Tasks Allocated"]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{formatSeconds(row["Worked Time (seconds)"])}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{formatSeconds(row["Available Time (seconds)"])}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ResourceUtilization;
