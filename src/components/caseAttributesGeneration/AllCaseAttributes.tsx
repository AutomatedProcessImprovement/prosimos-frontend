import { Button, ButtonGroup, Grid, Toolbar } from "@mui/material"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { JsonData } from "../formData"
import DiscreteCaseAttr from "./DiscreteCaseAttr"
import ContinuousCaseAttr from "./ContinuousCaseAttr"
import { defaultDiscreteCaseAttr, defaultContinuousCaseAttr } from "../simulationParameters/defaultValues"
import { AutoSizer, List } from "react-virtualized"
import { useEffect, useRef, useState } from "react"
import NoItemsCard from "../emptyComponents/NoItemsCard"
import { collectUniqueAtrrs } from "./caseAttributesUniqueCollector"

const CASE_ATTRIBUTES_PATH = "case_attributes"

interface AllCaseAttributesProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
}

const AllCaseAttributes = (props: AllCaseAttributesProps) => {
    const { formState: { control: formControl, getValues }, setErrorMessage } = props
    const listRef = useRef<List>(null)
    const [isAnyCaseAttrs, setIsAnyCaseAttrs] = useState(false)
    const [referencedAttrs, setReferencedAttrs] = useState<Set<string>>(new Set())

    const { fields, prepend, remove } = useFieldArray({
        keyName: 'key',
        control: formControl,
        name: `${CASE_ATTRIBUTES_PATH}`
    })

    useEffect(() => {
        const newReferencedAttrs = collectUniqueAtrrs(getValues("prioritisation_rules"))
        if (newReferencedAttrs !== referencedAttrs) {
            setReferencedAttrs(newReferencedAttrs)
        }
    }, [])

    useEffect(() => {
        const isAny = fields.length > 0
        if (isAny !== isAnyCaseAttrs) {
            setIsAnyCaseAttrs(isAny)
        }
    }, [fields])

    const removeByIndex = (index: number) => {
        const itemName = getValues(`case_attributes.${index}.name`)
        const isReferencedInPrioritisationRules = referencedAttrs.has(itemName)
        if (isReferencedInPrioritisationRules) {
            setErrorMessage(
                "Case Attribute is referenced in one or many prioritisation rules. Remove those rules first"
            )
        }
        else {
            remove(index)
        }
    }

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
                remove={removeByIndex}
            />
        )
    }

    const onAddNew = (type: "discrete" | "continuous") => {
        const itemToAdd = (type === "discrete")
            ? defaultDiscreteCaseAttr
            : defaultContinuousCaseAttr

        prepend(itemToAdd)
    }

    const renderRow = ({ index, key, style }: any) => {
        const currCaseAttr = fields[index]

        return (
            <Grid item xs={12} style={{ ...style }} key={currCaseAttr.key}>
                {getCaseAttrComponent(currCaseAttr.type, index)}
            </Grid>
        )
    }

    const getItemListOrEmptyCard = () => {
        return (
            (!isAnyCaseAttrs)
                ? <NoItemsCard
                    noItemsTitle={"No case attributes defined"}
                />
                : (
                    <Grid item xs={12} style={{ minHeight: "56vh" }}>
                        <AutoSizer>
                            {({ width, height }) => {
                                return <List
                                    ref={listRef}
                                    width={width}
                                    height={height}
                                    rowHeight={300}
                                    rowRenderer={renderRow}
                                    rowCount={fields.length}
                                    overscanRowCount={2}
                                />
                            }}
                        </AutoSizer>
                    </Grid>
                )
        )
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
        {getItemListOrEmptyCard()}
    </Grid>
}

export default AllCaseAttributes;
