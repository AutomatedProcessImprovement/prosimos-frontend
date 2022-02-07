import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton } from "@mui/material";
import { useState } from "react";
import { ResourceInfo } from "./ResourcePools";
import DeleteIcon from '@mui/icons-material/Delete';
import AddButtonToolbar from "./AddButtonToolbar";

interface ResourceProfilesTableProps {
    poolUuid: string
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
        props.onResourceListUpdate(updatedProfiles)
    }

    const onResourceAdd = () => {
        let nextResourceNum = 1
        let [lastResource] = resourceProfiles.slice(-1)

        if (lastResource) {
            const lastResourceId = lastResource.id
            nextResourceNum = Number(Number(lastResourceId.split('_').pop()!) + 1)
        }

        const updatedProfiles = [
            ...resourceProfiles,
            { 
                id: props.poolUuid + "_" + nextResourceNum,
                name: "",
                cost_per_hour: "",
                amount: ""
            } as ResourceInfo
        ]

        setResourceProfiles(updatedProfiles)
        props.onResourceListUpdate(updatedProfiles)
    }

    return (
        <React.Fragment>
            <AddButtonToolbar
                labelName="Add new resource"
                onClick={onResourceAdd}
                />
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
                                    placeholder="Resource Name"
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
                                    placeholder="Cost"
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
                                    placeholder="Amount"
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
        </React.Fragment>
    );
}

export default ResourceProfilesTable;
