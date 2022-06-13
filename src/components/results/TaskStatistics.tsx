import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import { secondsToNearest } from "../../helpers/timeConversions";
import { makeStyles } from "@material-ui/core/styles";
import { TableCellRightBorder, TableCellLeftRightBorder } from "./StyledTableCells";

const useStyles = makeStyles(() => ({
    stickyFirstColumn: {
        position: 'sticky',
        background: '#fff',
        left: 0,
        zIndex: 1,
    },
    borderTop: {
        borderTop: "1px solid rgba(224, 224, 224, 1)"
    }
}));

interface TaskStatisticsProps {
    data: any
}

enum SECTIONS_ORDER {
    WaitingTime = "Waiting Time",
    ProcessingTime = "Processing Time",
    IdleProcessingTime = "Idle Processing Time",
    CycleTime = "Cycle Time",
    IdleCycleTime = "Idle Cycle Time",
    Cost = "Cost"
}

const TaskStatistics = (props: TaskStatisticsProps) => {
    const { data } = props
    const classes = useStyles()
 
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

    const getGroupedValues = (row: any, keyName: string) => {
        const isTimeValue = (keyName !== SECTIONS_ORDER.Cost) ? true : false
        const values = isTimeValue
        ? [
            { value: secondsToNearest(row[`Min ${keyName}`] as string), measure: "min" },
            { value: secondsToNearest(row[`Avg ${keyName}`] as string), measure: "avg" },
            { value: secondsToNearest(row[`Max ${keyName}`] as string), measure: "max" },
        ]
        : [
            { value: row[`Min ${keyName}`], measure: "min" },
            { value: row[`Avg ${keyName}`], measure: "avg" },
            { value: row[`Max ${keyName}`], measure: "max" },
        ]

        return (
            <React.Fragment key={`${keyName}_groupedValues`}>
                {values.map(({ value, measure}) => {
                    const CellComponent = (measure === "max") ? TableCellRightBorder : TableCell
                    return <CellComponent colSpan={2} align="center" >{value}</CellComponent>
                })}
            </React.Fragment>
        )
    }

    const getSubHeaders = (index: string) => (
        <React.Fragment key={`subheader_${index}`}>
            <TableCell align="center" colSpan={2} >Min</TableCell>
            <TableCell align="center" colSpan={2} >Avg</TableCell>
            <TableCellRightBorder align="center" colSpan={2} >Max</TableCellRightBorder>
        </React.Fragment>
    )

    return (
        <TableContainer component={Paper}>
            <Toolbar className={classes.stickyFirstColumn}>
                <Typography
                    variant="h6"
                >
                    Individual Task Statistics
                </Typography>
            </Toolbar>
            <Table size="small">
                <TableHead>
                    <TableRow className={classes.borderTop}>
                        <TableCellLeftRightBorder align="center" colSpan={1} rowSpan={2} className={`${classes.stickyFirstColumn}`} >
                            Name
                        </TableCellLeftRightBorder>
                        <TableCellRightBorder align="center" colSpan={1} rowSpan={2} >
                            Num of Cases
                        </TableCellRightBorder>
                        {Object.values(SECTIONS_ORDER).map((keyName: string) => (
                            <TableCellRightBorder key={`${keyName}_headcell`} align="center" colSpan={6} >
                                {keyName}
                            </TableCellRightBorder>
                        ))}
                    </TableRow>
                    <TableRow>
                        {Object.keys(SECTIONS_ORDER).map((id: string) =>
                            getSubHeaders(id)
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processedData.map((row: any, index: number) => (
                        <TableRow
                            key={`${row["Name"]}_${index}`}
                            hover
                        >
                            <TableCellLeftRightBorder 
                                component="th"
                                scope="row"
                                align="left"
                                className={`${classes.stickyFirstColumn}`}>{row["Name"]}</TableCellLeftRightBorder>
                            <TableCellRightBorder
                                align="center"
                            >{row["Count"]}</TableCellRightBorder>
                            {Object.values(SECTIONS_ORDER).map((keyName: string) => (
                                getGroupedValues(row, keyName)
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TaskStatistics;