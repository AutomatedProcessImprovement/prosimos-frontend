import { useState, useEffect } from "react";
import { TableContainer, Paper, Toolbar, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { millisecondsToNearest } from "../../helpers/timeConversions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    borderRight: {
        borderRight: "1px solid rgba(224, 224, 224, 1)"
    }
}));

interface ScenarioStatisticsProps {
    data: any
}

const removeUnderscores = (str: string) => {
    return str.replace(/_/g, ' ')
}

const makeFirstLetterUppercase = (str: string) => {
    return str[0].toUpperCase() + str.slice(1)
}

const ScenarioStatistics = (props: ScenarioStatisticsProps) => {
    const { data } = props
    const [processedData, setProcessedData] = useState([])
    const classes = useStyles()

    useEffect(() => {
        const processed = data.map((item: any) => {
            const upd = Object.entries(item).reduce((acc: {}, [key, value]: any) => {
                if (key === "KPI") {
                    const displayName = makeFirstLetterUppercase(removeUnderscores(value))

                    return {
                        ...acc,
                        "KPI": value,
                        "KPI_display_name": displayName
                    }
                }

                const shouldValueBeUpdated = (typeof value == "number" && key !== "Trace Ocurrences")
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

    return (
        <TableContainer component={Paper}>
            <Toolbar >
                <Typography
                    variant="h6"
                >
                    Scenario Statistics
                </Typography>
            </Toolbar>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={1}>
                            KPI
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Min
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Max
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Average
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Accumulated Value
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Trace Ocurrences
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processedData.map((row: any) => (
                        <TableRow key={`${row["KPI"]}`} hover>
                            <TableCell component="th" scope="row" className={classes.borderRight}>{row["KPI_display_name"]}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{millisecondsToNearest(row["Min"] as string)}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{millisecondsToNearest(row["Max"] as string)}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{millisecondsToNearest(row["Average"] as string)}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{millisecondsToNearest(row["Accumulated Value"] as string)}</TableCell>
                            <TableCell align="center" className={classes.borderRight}>{row["Trace Ocurrences"]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> 
    )
}

export default ScenarioStatistics;