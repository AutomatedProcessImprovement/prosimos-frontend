import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";

interface TaskStatisticsProps {
    data: any
}

const SECTIONS_ORDER = [
    "Duration",
    "Waiting Time",
    "Processing Time",
    "Cost"
]

const TaskStatistics = (props: TaskStatisticsProps) => {
    const { data } = props
    const [processedData, setProcessedData] = useState(data)

    useEffect(() => {
        const processed = data.map((item: any) => {
            const upd = Object.entries(item).reduce((acc: {}, [key, value]: any) => {
                const shouldValueBeUpdated = (typeof value == "number" && key !== "Count")
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

    const getGroupedValues = (row: any, keyName: string) => (
        <React.Fragment key={`${keyName}_groupedValues`}>
            <TableCell align="right">{row[`Min ${keyName}`]}</TableCell>
            <TableCell align="right">{row[`Avg ${keyName}`]}</TableCell>
            <TableCell align="right">{row[`Max ${keyName}`]}</TableCell>
            <TableCell align="right">{row[`Total ${keyName}`]}</TableCell>
        </React.Fragment>
    )

    const getSubHeaders = (index: number) => (
        <React.Fragment key={`subheader_${index}`}>
            <TableCell align="right">Min</TableCell>
            <TableCell align="right">Avg</TableCell>
            <TableCell align="right">Max</TableCell>
            <TableCell align="right">Total</TableCell>
        </React.Fragment>
    )

    return (
        <TableContainer component={Paper}>
            <Toolbar >
                <Typography
                    variant="h6"
                >
                    Individual Task Statistics
                </Typography>
            </Toolbar>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={1}>
                            Name
                        </TableCell>
                        <TableCell align="center" colSpan={1}>
                            Count
                        </TableCell>
                        {SECTIONS_ORDER.map((keyName: string) => (
                            <TableCell key={`${keyName}_headcell`} align="center" colSpan={4}>
                                {keyName}
                            </TableCell>
                        ))}
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        {SECTIONS_ORDER.map((val: string, index: number) =>
                            getSubHeaders(index)
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processedData.map((row: any, index: number) => (
                        <TableRow
                            key={`${row["Name"]}_${index}`}
                        >
                            <TableCell component="th" scope="row">{row["Name"]}</TableCell>
                            <TableCell align="right">{row["Count"]}</TableCell>
                            {SECTIONS_ORDER.map((keyName: string) => (
                                getGroupedValues(row, keyName)
                            ))}
                            <TableCell></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TaskStatistics;