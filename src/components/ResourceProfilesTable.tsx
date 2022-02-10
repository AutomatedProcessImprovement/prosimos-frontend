import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddButtonToolbar from "./AddButtonToolbar";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { JsonData } from "./SimulationParameters";

const REQUIRED_ERROR_MESSAGE = "Cannot be empty"

interface ResourceProfilesTableProps {
    poolUuid: string
    formState: UseFormReturn<JsonData, object>
    errors: any
}

const ResourceProfilesTable = (props: ResourceProfilesTableProps) => {
    const { control: formControl, trigger } = props.formState
    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `resource_profiles.${props.poolUuid}.resource_list`
    })

    const onResourceProfileDelete = (index: number) => {
        remove(index)
    }

    const onResourceAdd = async () => {
        const arePrevResourcesValid = await trigger(`resource_profiles.${props.poolUuid}.resource_list`)

        if (!arePrevResourcesValid) return

        let nextResourceNum = 1
        let [lastResource] = fields.slice(-1)

        if (lastResource) {
            const lastResourceId = lastResource.id
            nextResourceNum = Number(Number(lastResourceId.split('_').pop()!) + 1)
        }

        append({
            id: props.poolUuid + "_" + nextResourceNum,
            name: "",
            cost_per_hour: "",
            amount: ""
        })
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
                    {fields.map((childrenRow: any, index: any) => {
                        const isError = props.errors && props.errors[index]
                        const nameError = isError && props.errors[index].name
                        const costPerHourError = isError && props.errors[index].cost_per_hour
                        const amountError = isError && props.errors[index].amount

                        return <TableRow key={childrenRow.id} hover>
                            <TableCell>
                                <Controller
                                    name={`resource_profiles.${props.poolUuid}.resource_list.${index}.name` as const}
                                    control={formControl}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            error={nameError !== undefined}
                                            helperText={(nameError?.type === "required") ? REQUIRED_ERROR_MESSAGE : ""}
                                            variant="standard"
                                            placeholder="Resource Name"
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Controller
                                    name={`resource_profiles.${props.poolUuid}.resource_list.${index}.cost_per_hour`}
                                    control={formControl}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            error={costPerHourError !== undefined}
                                            helperText={(costPerHourError?.type === "required") ? REQUIRED_ERROR_MESSAGE : ""}
                                            variant="standard"
                                            inputProps={{
                                                min: 0
                                            }}
                                            style={{ width: "50%" }}
                                            placeholder="Cost"
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Controller
                                    name={`resource_profiles.${props.poolUuid}.resource_list.${index}.amount`}
                                    control={formControl}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            error={amountError !== undefined}
                                            helperText={(amountError?.type === "required") ? REQUIRED_ERROR_MESSAGE : ""}
                                            variant="standard"
                                            inputProps={{
                                                min: 0
                                            }}
                                            style={{ width: "50%" }}
                                            placeholder="Amount"
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    onClick={() => onResourceProfileDelete(index)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}

export default ResourceProfilesTable;
