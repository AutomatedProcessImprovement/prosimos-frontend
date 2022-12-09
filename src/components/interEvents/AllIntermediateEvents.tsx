
import { Grid } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AutoSizer, List } from "react-virtualized";
import { JsonData } from "../formData";
import { EventsFromModel } from "../modelData";
import EventCard from "./EventCard";


interface AllIntermediateEventsProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
    eventsFromModel: EventsFromModel
}

const AllIntermediateEvents = (props: AllIntermediateEventsProps) => {
    const { formState: { control: formControl }, 
        setErrorMessage, eventsFromModel } = props

    const { fields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: 'event_distribution'
    })
    
    const renderRow = ({ index, key, style }: any) => {
        return ( 
            <EventCard
                formState={props.formState}
                setErrorMessage={setErrorMessage}
                eventsFromModel={eventsFromModel}
                index={index}
                key={key}
                style={style}
                fields={fields}
        />)
    }

    return (
        <Grid item xs={12} container spacing={2}>
            <Grid item container xs={12} style={{ minHeight: "60vh" }}>
                <AutoSizer>
                    {({ width, height }) => {
                        return <List
                            width={width}
                            height={height}
                            rowHeight={215}
                            rowRenderer={renderRow}
                            rowCount={fields.length}
                            overscanRowCount={5}
                        />
                    }}
                </AutoSizer>
            </Grid>
        </Grid>
    )
}

export default AllIntermediateEvents;
