
import { Card, Grid, Typography } from "@mui/material";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AutoSizer, List } from "react-virtualized";
import TimeDistribution from "../distributions/TimeDistribution";
import { JsonData } from "../formData";


interface AllIntermediateEventsProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

const AllIntermediateEvents = (props: AllIntermediateEventsProps) => {
    const { formState: { control: formControl, formState: { errors } }, setErrorMessage } = props
    const { fields } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: 'event_distribution'
    })
    
    const renderRow = ({ index, key, style }: any) => {
        const item = fields[index]
        const eventIdKey = item.event_id

        const currentErrors = errors?.event_distribution?.[index]
        const distrErrors = {
            distribution_name: currentErrors?.distribution_name,
            distribution_params: currentErrors?.distribution_params
        }

        return <Grid key={`${key}`} item xs={12} style={style}>
            <Card elevation={5} sx={{ m: 1, p: 1 }}>
                <Grid container item xs={12} sx={{ p: 1}}>
                    <Grid key={`${key}NameGrid`} item xs={12}>
                        <Typography key={`${key}Name`} variant="h6" align="left">
                            {eventIdKey}
                        </Typography>
                    </Grid>
                    <TimeDistribution
                        formState={props.formState}
                        objectNamePath={`event_distribution.${index}`}
                        errors={distrErrors}
                        setErrorMessage={setErrorMessage}
                    />
                </Grid>
            </Card>
        </Grid>
    }

    return (
        <Grid item xs={12} container spacing={2}>
            <Grid item container xs={12} style={{ minHeight: "60vh" }}>
                <AutoSizer>
                    {({ width, height }) => {
                        return <List
                            width={width}
                            height={height}
                            rowHeight={240}
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
