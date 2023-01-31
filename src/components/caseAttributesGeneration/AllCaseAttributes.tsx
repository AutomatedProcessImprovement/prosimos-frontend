import { Grid } from "@mui/material"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { JsonData } from "../formData"
import ContinuousCaseAttr from "./ContinuosCaseAttr"
import DiscreteCaseAttr from "./DiscreteCaseAttr"

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

    console.log(fields)

    const getCaseAttrComponent = (itemType: string, itemIndex: number): JSX.Element => {
        let componentToReturn = <></>
        switch(itemType) {
            case "discrete":
                componentToReturn = <DiscreteCaseAttr
                    formState={props.formState}
                    setErrorMessage={props.setErrorMessage}
                    itemIndex={itemIndex}
                />
                break
            case "continuous":
                componentToReturn = <ContinuousCaseAttr/>
                break
        }

        return componentToReturn
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
