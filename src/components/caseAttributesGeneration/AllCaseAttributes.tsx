import { Button, ButtonGroup, Grid, Toolbar } from "@mui/material"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { JsonData } from "../formData"
import DiscreteCaseAttr from "./DiscreteCaseAttr"
import ContinuousCaseAttr from "./ContinuousCaseAttr"
import { defaultArrivalTimeDistribution } from "../simulationParameters/defaultValues"

const CASE_ATTRIBUTES_PATH = "case_attributes"

interface AllCaseAttributesProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void

}

const AllCaseAttributes = (props: AllCaseAttributesProps) => {
    const { formState: { control: formControl }, setErrorMessage } = props

    const { fields, prepend, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `${CASE_ATTRIBUTES_PATH}`
    })

    const getCaseAttrComponent = (itemType: string, itemIndex: number): JSX.Element => {
        const ComponentToReturn = (({ "discrete": DiscreteCaseAttr, "continuous": ContinuousCaseAttr })[itemType] ?? undefined)

        if (ComponentToReturn === undefined) {
            return <div>Invalid type of a case attribute</div>
        }

        return (
            <ComponentToReturn
                formState={props.formState}
                setErrorMessage={props.setErrorMessage}
                itemIndex={itemIndex}
                remove={remove}
            />
        )
    }

    const onAddNew = (type: "discrete" | "continuous") => {
        const itemToAdd = (type === "discrete")
            ? {
                name: "name",
                type: "discrete",
                values: [
                    {
                        key: "option name",
                        value: 1
                    }
                ]
            }
            : {
                name: "name",
                type: "continuous",
                values: {
                    ...defaultArrivalTimeDistribution
                }
            }

        prepend(itemToAdd)
    }

    return <Grid container item xs={12} spacing={2}>
        <Toolbar sx={{ justifyContent: "flex-end", marginLeft: "auto" }}>
            <ButtonGroup>
                <Button
                    onClick={() => onAddNew("discrete")}>
                    Add discrete case attribute
                </Button>
                <Button
                    onClick={() => onAddNew("continuous")}>
                    Add continuous value
                </Button>
            </ButtonGroup>
        </Toolbar>
        <Grid container item xs={12}>{
            fields.map((item, itemIndex) => (
                <Grid item xs={12}>
                    {getCaseAttrComponent(item.type, itemIndex)}
                </Grid>
            ))
        }</Grid>
    </Grid>
}

export default AllCaseAttributes;
