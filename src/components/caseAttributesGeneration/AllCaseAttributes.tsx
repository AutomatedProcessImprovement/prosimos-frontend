import { Grid } from "@mui/material"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { JsonData } from "../formData"
import DiscreteCaseAttr from "./DiscreteCaseAttr"
import ContinuousCaseAttr from "./ContinuousCaseAttr"

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
            />
        )
    }

    return <Grid container item xs={12}>{
        fields.map((item, itemIndex) => (
            <Grid item xs={12}>
                {getCaseAttrComponent(item.type, itemIndex)}
            </Grid>
        ))
    }</Grid>
}

export default AllCaseAttributes;
