import { useEffect, useState, useRef } from "react";
import { Grid } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import AddButtonBase from "../toolbar/AddButtonBase";
import { List , AutoSizer } from 'react-virtualized';
import DistributionMappingRow from "./DistributionMappingRow";
import { BatchDistrib, JsonData } from "../formData";


interface DistributionMappingWithAddProps {
    // fields: FieldArrayWithId<FieldValues, FieldArrayPath<FieldValues>, "key">[]
    formState: UseFormReturn<JsonData, object>
    // objectFieldNamePart: keyof FieldValues
    // onRowRemove: (index: number) => void
    // onRowAdd: () => void
    taskIndex: number
}

const DistributionMappingWithAdd = (props: DistributionMappingWithAddProps) => {
    // const { fields, objectFieldNamePart } = props
    const { taskIndex, formState: { control } } = props
    const [isRowAdded, setIsRowAdded] = useState(false)
    const listRef = useRef<List>(null)

    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control,
        name: `batch_processing.${taskIndex}.size_distrib`
    });

    const onTimePeriodAdd = () => {
        setIsRowAdded(true)
        append({
            key: "1",
            value: 0.5
        } as BatchDistrib)
    };

    const onRowDelete = (index: number) => {
        remove(index)
    };

    useEffect(() => {
        if (isRowAdded) {
            if (listRef.current) {
                listRef.current.scrollToRow(fields.length)
            }
            setIsRowAdded(false)
        }
    }, [fields, isRowAdded]);

    const renderRow = ({ index, key, style }: any) => {
        const isWithoutDeleteButton = (fields.length === 1 && index === 0 )
        const item = fields[index]

        return (
            <Grid item xs={12} key={key} style={style}> 
                <DistributionMappingRow
                    key={`${key}-row`}
                    formState={props.formState}
                    // objectFieldName={`batch_processing.${taskIndex}.size_distrib.${index}`}
                    isWithDeleteButton={!isWithoutDeleteButton}
                    timePeriodIndex={taskIndex}
                    onDelete={onRowDelete}
                    taskIndex={taskIndex}
                    rowIndex={index}
                />
            </Grid>
        )
    };

    return (
        <Grid item xs={12} container spacing={2}>
            <Grid item container xs={12} style={{ minHeight: "30vh" }}>
                <AutoSizer>
                    {({ width, height }) => {
                        return <List
                            ref={listRef}
                            width={width}
                            height={height}
                            rowHeight={70}
                            rowRenderer={renderRow}
                            rowCount={fields.length}
                            overscanRowCount={10}
                        />
                    }}
                </AutoSizer>
            </Grid>
            <Grid item xs={12}>
                <AddButtonBase
                    labelName="Add a time period"
                    onClick={onTimePeriodAdd}
                />
            </Grid>
        </Grid>
    )
}

export default DistributionMappingWithAdd;
