import { useState, useEffect } from "react";
import { TableContainer, Paper, Toolbar, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { millisecondsToNearest } from "../../helpers/timeConversions";

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
                            <TableCell component="th" scope="row">{row["KPI_display_name"]}</TableCell>
                            <TableCell align="center" >{millisecondsToNearest(row["Min"] as string)}</TableCell>
                            <TableCell align="center">{millisecondsToNearest(row["Max"] as string)}</TableCell>
                            <TableCell align="center">{millisecondsToNearest(row["Average"] as string)}</TableCell>
                            <TableCell align="center">{millisecondsToNearest(row["Accumulated Value"] as string)}</TableCell>
                            <TableCell align="center">{row["Trace Ocurrences"]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> 
    )
}

export default ScenarioStatistics;