import React, { useState } from "react";
import {
    Box, Collapse, Grid, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { JsonData } from "./SimulationParameters";

interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: string
    amount: string
}

interface ResourceProfile {
    [resourceTypeUid: string]: {
        name: string,
        resourceList: ResourceInfo[]
    }
}

interface ResourceProfilesProps {
    resourceProfiles: ResourceProfile
    onParamFormUpdate: (paramSectionName: keyof JsonData, updatedValue: any) => void
}

function Row(props: { row: any; resourceTypeUid: any; }) {
    const { row, resourceTypeUid } = props
    console.log(row)
    const [openModule, setOpenModule] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell style={{ width: "62px" }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenModule(!openModule)}
                    >
                        {openModule ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>({row.resource_list.length})</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={openModule} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    <TableRow>
                                        <TableCell
                                            style={{ paddingBottom: 0, paddingTop: 0, borderBottom: "none" }}
                                            colSpan={6}
                                        >
                                            <Box margin={1}>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Name</TableCell>
                                                            <TableCell>Cost per hour</TableCell>
                                                            <TableCell>Amount</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {row.resource_list.map((childrenRow: any) => (
                                                            <TableRow key={childrenRow.name}>
                                                                <TableCell>{childrenRow.name}</TableCell>
                                                                <TableCell>{childrenRow.cost_per_hour}</TableCell>
                                                                <TableCell>{childrenRow.amount}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const ResourceProfiles = (props: ResourceProfilesProps) => {
    const [resourceProfiles, setResourceProfiles] = useState(props.resourceProfiles)

    return (
        <form>
            <Grid container spacing={2}>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead></TableHead>
                        <TableBody>
                            {Object.entries(resourceProfiles).map(([resourceTypeUid, row]) => (
                                <Row key={resourceTypeUid} row={row} resourceTypeUid={resourceTypeUid} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </form>
    )
}

export default ResourceProfiles;