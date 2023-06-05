import { Grid } from "@mui/material";
import { FieldArrayPath, FieldArrayWithId } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import AddButtonBase from "../toolbar/AddButtonBase";
import TimePeriodGridItem from "./TimePeriodGridItem";
import { List, AutoSizer } from 'react-virtualized';
import { useEffect, useState, useRef, useMemo } from "react";
import { ModelType } from "./ModelType";

interface TimePeriodGridItemsWithAddProps<FieldValues> {
    fields: any//FieldArrayWithId<FieldValues, FieldArrayPath<FieldValues>, "key">[]
    formState: UseFormReturn<FieldValues, object>
    objectFieldNamePart: keyof FieldValues
    modelType?: ModelType
    onTimePeriodRemove: (index: number) => void
    onTimePeriodAdd: () => void
}

const TimePeriodGridItemsWithAdd = <FieldValues,>(props: TimePeriodGridItemsWithAddProps<FieldValues>) => {
    const { fields, objectFieldNamePart } = props
    const [isRowAdded, setIsRowAdded] = useState(false)
    const listRef = useRef<List>(null)

    const onTimePeriodAdd = () => {
        setIsRowAdded(true)
        props.onTimePeriodAdd()
    };

    useEffect(() => {
        if (isRowAdded) {
            if (listRef.current) {
                listRef.current.scrollToRow(fields.length)
            }
            setIsRowAdded(false)
        }
    }, [fields, isRowAdded]);

    const displayedTimePeriods = useMemo(() => {
        return fields.filter((item: any) => item.isDisplayed !== false);
      }, [fields]);

    const renderRow = ({ index, key, style }: any) => {
        const isWithoutDeleteButton = (fields.length === 1 && index === 0)
        const item = fields[index]

        if (!item.isDisplayed) {
            return null;
          }

        return (
            <Grid item xs={12} key={`resource_calendar_${index}`} style={style}>
                <TimePeriodGridItem
                    key={item.key}
                    formState={props.formState}
                    modelType={props.modelType}
                    objectFieldName={`${objectFieldNamePart}.${index}`}
                    isWithDeleteButton={!isWithoutDeleteButton}
                    timePeriodIndex={index}
                    onDelete={props.onTimePeriodRemove}
                />
            </Grid>
        )
    };

    return (
        <Grid item xs={12} container spacing={2}>
            <Grid item container xs={12} style={{ minHeight: "100vh" }}>
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
                    labelName="new time period"
                    onClick={onTimePeriodAdd}
                    tooltipText="Add new time period"
                />
            </Grid>
        </Grid>
    )
}

export default TimePeriodGridItemsWithAdd;
