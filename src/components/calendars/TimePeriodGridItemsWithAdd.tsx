import { Grid } from "@mui/material";
import { FieldArrayPath, FieldArrayWithId } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import AddButtonBase from "../toolbar/AddButtonBase";
import TimePeriodGridItem from "./TimePeriodGridItem";
import { List , AutoSizer } from 'react-virtualized';

interface TimePeriodGridItemsWithAddProps<FieldValues> {
    fields: FieldArrayWithId<FieldValues, FieldArrayPath<FieldValues>, "key">[]
    formState: UseFormReturn<FieldValues, object>
    objectFieldNamePart: keyof FieldValues
    onTimePeriodRemove: (index: number) => void
    onTimePeriodAdd: () => void
}

const TimePeriodGridItemsWithAdd = <FieldValues,>(props: TimePeriodGridItemsWithAddProps<FieldValues>) => {
    const { fields, objectFieldNamePart } = props

    const renderRow = ({ index, key, style }: any) => {
        const isWithoutDeleteButton = (fields.length === 1 && index === 0 )
        const item = fields[index]

        return (
            <Grid item xs={12} key={`resource_calendar_${index}`} style={style}> 
                <TimePeriodGridItem
                    key={item.key}
                    formState={props.formState}
                    objectFieldName={`${objectFieldNamePart}.${index}` as unknown as keyof FieldValues}
                    isWithDeleteButton={!isWithoutDeleteButton}
                    timePeriodIndex={index}
                    onDelete={props.onTimePeriodRemove}
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
                            width={width}
                            height={height}
                            rowHeight={50}
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
                    onClick={props.onTimePeriodAdd}
                />
            </Grid>
        </Grid>
    )
}

export default TimePeriodGridItemsWithAdd;