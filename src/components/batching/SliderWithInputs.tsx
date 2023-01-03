import { Slider, TextField, Grid } from "@mui/material"
import { ChangeEvent } from "react"

interface SliderWithInputsProps {
    value: number[]
    onChange: any
}

const SliderWithInputs = (props: SliderWithInputsProps) => {
    const {value, onChange} = props

    const handleInputChange = (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            onChangeSlider: any,
            oldRange: number[],
            isFirst: boolean
        ) => {
            const newInputValue = Number(event.target.value)

            const newBetweenValue = isFirst 
                ? [newInputValue, Number(oldRange[1])]
                : [Number(oldRange[0]), newInputValue]

            onChangeSlider(newBetweenValue)
        }

    return (
        <Grid item container xs={12} sx={{ ml: 1.875, mt: 2 }}>
            <Grid item xs={2}>
                <TextField
                    value={value[0]}
                    type="number"
                    onChange={(e) => {
                        handleInputChange(e, onChange, value, true)
                    }}
                    variant="standard"
                    label="Value (sec)"
                    inputProps={{
                        min: 0,
                        max: Number.MAX_VALUE
                    }}
                    // TODO: error and helperText
                />
            </Grid>
            <Grid item xs={7} sx={{ mx: 1 }}>
                <Slider
                    value={value}
                    onChange={onChange}
                    valueLabelDisplay="auto"
                    max={value[1] * 1.5}
                    sx={{ position: "relative", top: "50%", transform: "translateY(-50%)" }}
                />
            </Grid>
            <Grid item xs={2}>
                <TextField
                    value={value[1]}
                    type="number"
                    onChange={(e) => {
                        handleInputChange(e, onChange, value, false)
                    }}
                    variant="standard"
                    label="Value (sec)"
                    inputProps={{
                        min: 0,
                        max: Number.MAX_VALUE
                    }}
                    // TODO: error and helperText
                />
            </Grid>
        </Grid>

    )
}

export default SliderWithInputs;