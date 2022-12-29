import { useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import { FieldArrayWithId, UseFormReturn } from "react-hook-form";
import { List , AutoSizer } from 'react-virtualized';
import DistributionMappingRow from "./DistributionMappingRow";
import { JsonData } from "../formData";
import { AllowedDistrParamsName } from "./DistributionSection"


interface DistributionMappingWithAddProps {
    formState: UseFormReturn<JsonData, object>
    objectFieldNamePart: AllowedDistrParamsName
    taskIndex: number
    valueLabel: string
    isRowAdded: boolean
    setIsRowAdded: any
    fields: FieldArrayWithId<JsonData, AllowedDistrParamsName, "key">[]
    remove: any
}

const DistributionMappingWithAdd = (props: DistributionMappingWithAddProps) => {
    const { taskIndex, formState: { control }, objectFieldNamePart, valueLabel, 
        isRowAdded, setIsRowAdded, fields, remove } = props
    // const [isRowAdded, setIsRowAdded] = useState(false)
    const listRef = useRef<List>(null)

    // const { fields, append, remove } = useFieldArray({
    //     keyName: 'key',
    //     control,
    //     name: objectFieldNamePart
    // });



    const onRowDelete = (index: number) => {
        remove(index)
    };

    useEffect(() => {
        if (isRowAdded) {
            if (listRef.current) {
                console.log("scroll")
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
                    // objectFieldNameBase={objectFieldNamePart} //{`${objectFieldNamePart}.${index}`}
                    objectFieldName={`${objectFieldNamePart}.${index}`}
                    isWithDeleteButton={!isWithoutDeleteButton}
                    rowIndex={index}
                    onDelete={onRowDelete}
                    valueLabel={valueLabel}
                />
            </Grid>
        )
    };

    return (
        <Grid item xs={12} container spacing={2}>
            <Grid item container xs={12} style={{ minHeight: "20vh" }}>
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
        </Grid>
    )
}

export default DistributionMappingWithAdd;
