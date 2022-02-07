import { Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton } from "@mui/material";
import { useState } from "react";
import { ResourceInfo } from "./ResourcePools";
import DeleteIcon from '@mui/icons-material/Delete';

interface ResourceProfilesTableProps {
    resourceList: ResourceInfo[]
    onResourceListUpdate: (updatedResourceList: ResourceInfo[])  => void
}

const ResourceProfilesTable = (props: ResourceProfilesTableProps) => {
    const [resourceProfiles, setResourceProfiles] = useState(props.resourceList)

    const onChange = (propName: keyof ResourceInfo, index: number, e: any) => {
        const updatedProfiles = resourceProfiles.map((profile, pIndex) => 
            (index === pIndex) ?
            { 
                ...profile,
                [propName]: e.target.value
            } :
            profile
        )
        setResourceProfiles(updatedProfiles)
        props.onResourceListUpdate(updatedProfiles)
    }

    const onResourceProfileDelete = (index: number) => {
        const updatedProfiles = [...resourceProfiles.slice(0, index), ...resourceProfiles.slice(index + 1)]
        setResourceProfiles(updatedProfiles)
    }

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Cost per hour</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {resourceProfiles.map((childrenRow: any, index: any) => (
                    <TableRow key={childrenRow.id} hover>
                        <TableCell>
                            <TextField
                                required
                                onChange={e => onChange("name", index, e)}
                                value={childrenRow.name}
                                variant="standard"
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                required
                                type="number"
                                onChange={e => onChange("cost_per_hour", index, e)}
                                value={childrenRow.cost_per_hour}
                                variant="standard"
                                inputProps={{
                                    min: 0
                                }}
                                style = {{width: "40%"}}
                            />
                        </TableCell>
                        <TableCell>
                            <TextField
                                required
                                type="number"
                                onChange={e => onChange("amount", index, e)}
                                value={childrenRow.amount}
                                variant="standard"
                                inputProps={{
                                    min: 0
                                }}
                                style = {{width: "40%"}}
                            />
                        </TableCell>
                        <TableCell>
                            <IconButton
                                size="small"
                                onClick={e => onResourceProfileDelete(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default ResourceProfilesTable;
