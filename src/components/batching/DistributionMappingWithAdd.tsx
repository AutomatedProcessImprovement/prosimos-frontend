import { useEffect, useState, useRef } from "react";
import { Grid } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import AddButtonBase from "../toolbar/AddButtonBase";
import { List , AutoSizer } from 'react-virtualized';
import DistributionMappingRow from "./DistributionMappingRow";
import { BatchDistrib, JsonData } from "../formData";

type AllowedDistrParamsName = `batch_processing.${number}.duration_distrib`
    | `batch_processing.${number}.size_distrib`

interface DistributionMappingWithAddProps {
    formState: UseFormReturn<JsonData, object>
    objectFieldNamePart: AllowedDistrParamsName
    taskIndex: number
    valueLabel: string
}

const DistributionMappingWithAdd = (props: DistributionMappingWithAddProps) => {
    const { taskIndex, formState: { control }, objectFieldNamePart, valueLabel } = props
    const [isRowAdded, setIsRowAdded] = useState(false)
    const listRef = useRef<List>(null)

    const { fields, append, remove } = useFieldArray({
        keyName: 'key',
        control,
        name: objectFieldNamePart
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

        return (
            <Grid item xs={12} key={key} style={style}> 
                <DistributionMappingRow
                    key={`${key}-row`}
                    formState={props.formState}
                    objectFieldName={`${objectFieldNamePart}.${index}`}
                    isWithDeleteButton={!isWithoutDeleteButton}
                    rowIndex={taskIndex}
                    onDelete={onRowDelete}
                    valueLabel={valueLabel}
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
                    labelName="Add a mapping"
                    onClick={onTimePeriodAdd}
                />
            </Grid>
        </Grid>
    )
}

export default DistributionMappingWithAdd;
