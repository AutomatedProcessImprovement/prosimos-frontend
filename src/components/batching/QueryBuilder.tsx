import clsx from "clsx";
import {
    useFieldArray,
    Controller,
    get,
    UseFormReturn
} from "react-hook-form";

import {
    TextField,
    MenuItem,
    Chip,
    IconButton,
    Tooltip,
    FormHelperText,
    Theme
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import QueryGroupIcon from '@mui/icons-material/AccountTreeRounded';
import QueryConditionIcon from '@mui/icons-material/FunctionsRounded';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import { exampleSchema, typeOperatorMap } from "./schemas";
import { JsonData } from "../formData";
import WeekdaySelect from "../calendars/WeekdaySelect";
import SliderWithInputs from "./SliderWithInputs";

export type CondType = "number" | "string" | "array" | "boolean";
export type CondOperator =
    | "$gt"
    | "$gte"
    | "$lte"
    | "$lt"
    | "$eq"
    | "$ne"
    | "$in"
    | "$nin";
export type GroupOperator = "$and" | "$or";

export type FormFields = {
    query: {
        type: string;
        operator: string;
        items: (QueryBuilderGroup | QueryBuilderCondition)[];
    };
}

export type QueryBuilderConditionData = {
    field?: string;
    type?: CondType;
    operator?: CondOperator;
    value?: number | string | string[] | boolean;
}
export type QueryBuilderCondition = {
    type: "cond";
    data: QueryBuilderConditionData;
};

export type QueryBuilderGroupItems = {
    [key: number]: Omit<QueryBuilderGroup, ''> | QueryBuilderCondition
}

export type OneQueryBuilderGroup = {
    type: "group";
    operator: GroupOperator;
    items: Array<QueryBuilderCondition>;
    defaultValues?: DefaultValues;
};

export type DefaultValues = {
    type: "group";
    operator: GroupOperator;
}

export type QueryBuilderGroup = {
    type: "group";
    operator: GroupOperator;
    items: Array<OneQueryBuilderGroup | QueryBuilderCondition>;
    defaultValues?: DefaultValues;
};

export type QueryGroupType = {
    [K in GroupOperator]?: Array<QueryGroupType | QueryConditionType>;
};

export type QueryConditionType = {
    [key: string]: {
        [N in CondOperator]?: number | string | string[] | boolean;
    };
};

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

type Join<K, P> = K extends string | number ?
    P extends string | number ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;

type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T] : ""

type TFormFields = Paths<FormFields>;

// TODO return type
// export const parseQueryBuilderForm = (
//     query: QueryBuilderGroup | QueryBuilderCondition
// ): any => {
//     if (query.type === "group") {
//         return {
//             [query.operator]: Object.values(query.items).map((item) => parseQueryBuilderForm(item))
//         } as QueryGroupType;
//     } else if (query.type === "cond") {
//         return {
//             [query.data.field!]: {
//                 [query.data.operator!]: query.data.value
//             }
//         };
//     } else {
//         throw new Error("Unknown query type when parsing query builder group.");
//     }
// };

// TODO return type
// export const queryJsonToBuilderForm = (
//     query: QueryGroupType | QueryConditionType | null,
//     schema: QueryBuilderSchema
// ): any => {
//     if (!!query?.$and || !!query?.$or) {
//         const group = query as QueryGroupType;
//         const operator = Object.keys(group)[0] as GroupOperator;
//         return {
//             type: "group",
//             operator,
//             items: group[operator]!.map((item) =>
//                 queryJsonToBuilderForm(item, schema)
//             )
//         };
//     } else if (Object.keys(query || {}).length) {
//         const cond = query as QueryConditionType;
//         const field = Object.keys(cond)[0];
//         const operator = Object.keys(cond[field])[0] as CondOperator;
//         const value = cond[field][operator];
//         const type = schema[field]?.type;

//         // TODO consider throwing an error or returning nothing if no `type` mapped

//         return {
//             type: "cond",
//             data: { field, operator, type, value }
//         };
//     }
// };

const useQueryBuilderStyles = makeStyles(
    (theme: Theme) => ({
        group: {},
        groupControls: {},
        nested: {
            paddingLeft: 30
        },
        cond: {
            display: "flex"
        },
        item: {
            position: "relative",

            "&:first-child:before": {
                top: -8,
                height: 50
            },
            "&::before, &:not(:last-child)::after": {
                height: 20,
                // borderColor: theme.palette.secondary.light,
                borderStyle: "solid",
                borderWidth: `0 0 1px 1px`,
                content: `''`,
                left: -15,
                // left: 40,
                position: "absolute",
                width: 13
            },
            "&:not(:last-child)::after": {
                height: "50%",
                left: -15,
                bottom: 0,
                borderBottom: "none"
            },
            "&$group": {
                "&::before": {
                    height: 30
                },
                "&::first-child::before": {
                    height: 27
                },
                "&:not(:last-child)::after": {
                    height: `calc(100% - 23px)`
                },
                "&::last-child::before": {
                    height: 27
                },
                "&::last-child::after": {
                    height: `calc(100% - 23px)`
                }
            },
            "&$cond": {
                "&::before": {
                    height: 45
                },
                "&:first-child::before": {
                    top: -4,
                    height: 49
                },
                "&:not(:last-child)::after": {
                    height: `calc(100% - 38px)`
                }
            }
        }
    }),
    {
        name: "QueryBuilder"
    }
);

const defaultValues = {
    // query: {
    //     type: "group",
    //     operator: "$or",
    //     items: [
    //         { type: "cond", data: { field: "", operator: undefined, value: [] } } as QueryBuilderCondition,
    //         { type: "group", operator: "$or", items: [
    //             { type: "cond", data: { field: "", operator: undefined, value: [] } }
    //         ]} as QueryBuilderGroup
    //     ] as Array<QueryBuilderGroup | QueryBuilderCondition>
    // }
    query: [
        [
            { type: "cond", data: { field: "", operator: undefined, value: [] } } as QueryBuilderCondition,
            { type: "cond", data: { field: "", operator: undefined, value: [] } } as QueryBuilderCondition,
        ],
        [
            { type: "cond", data: { field: "", operator: undefined, value: [] } } as QueryBuilderCondition,
        ],
        [
            { type: "cond", data: { field: "", operator: undefined, value: [] } } as QueryBuilderCondition,
        ]
    ]
};

interface QueryBuilderProps {
    formState: UseFormReturn<JsonData, object>
    taskIndex: number
}

export const QueryBuilder = (props: QueryBuilderProps) => {
    const { formState, taskIndex } = props 

    return (
        <QueryGroup 
            name={`batch_processing.${taskIndex}.firing_rules`}
            formState={formState}
        />
    );
};

interface QueryGroupProps {
    name: string;
    formState: any;
    depth?: number;
    onRemove?: () => any;
}

export type FieldsPath = "query.items" | `query.items.${number}.items` | `query.items.${number}.items.${number}.items`

export const QueryGroup = (allProps: QueryGroupProps) => {
    const {
        name,
        formState,
        depth = 0,
        onRemove,
        ...props
    } = allProps
    const classes = useQueryBuilderStyles();

    const arrayPath = name
    const { control, formState: { errors }, setError, clearErrors } = formState
    const { fields, append, remove } = useFieldArray({
        control,
        name: arrayPath
    });

    const err = get(errors, arrayPath, null);

    return (
        <div className={clsx({ [classes.item]: depth > 0 }, classes.group)}
            {...props}
        >
            <div className={classes.groupControls}>
                {/* <Controller
                    name={typePath}
                    control={control}
                    defaultValue={defaultValues.type || "unknown"}
                    render={({
                        field
                    }) => <input type="hidden" {...field} />}
                /> */}

                {depth === 0
                    ? <Chip label="OR" variant="outlined" />
                    : <Chip label="AND" variant="outlined" />}

                {/* maximum group depth */}
                {depth >= 1 ? null : (
                    <Tooltip title="Add Logical Group">
                        <IconButton
                            onClick={() => {
                                clearErrors(arrayPath);
                                append([[
                                    { attribute: "", comparison: undefined, value: [] },
                                ]]);
                            }}
                        >
                            <QueryGroupIcon />
                        </IconButton>
                    </Tooltip>
                )}

                <Tooltip title="Add Condition">
                    <IconButton
                        onClick={() => {
                            clearErrors(arrayPath);
                            append([
                                { attribute: "", comparison: undefined, value: [] },
                            ]);
                        }}
                    >
                        <QueryConditionIcon />
                    </IconButton>
                </Tooltip>

                {onRemove ? (
                    <Tooltip title="Remove This Group">
                        <IconButton onClick={onRemove}>
                            <RemoveIcon />
                        </IconButton>
                    </Tooltip>
                ) : null}
            </div>

            {!err ? null : (
                <FormHelperText error style={{ marginBottom: 4 }}>
                    {err.message}
                </FormHelperText>
            )}

            <div className={classes.nested}>
                {fields.map((field, index) => {
                    // isMultipleStatements = True and allKeysNum = True in case we have Group
                    // otherwise, we have only one statement in the group which equals to just condition
                    const allKeysNum = Object.keys(field).every(v => (v === 'id') ? true : !isNaN(Number(v)))
                    const isMultipleStatements = Object.keys(field).length > 1

                    return allKeysNum && isMultipleStatements ? (
                        <QueryGroup
                            key={field.id}
                            depth={depth + 1}
                            name={`${name}.${index}`}
                            formState={formState}
                            onRemove={() => remove(index)}
                        />
                    ) : (
                        <QueryCondition
                            key={field.id}
                            formState={formState}
                            name={`${name}.${index}`}
                            onRemove={() => remove(index)}
                        />
                    )
                })}
            </div>
        </div>
    );
};

interface QueryConditionProps {
    name: string;
    formState: any;
    onRemove: () => any;
}

const QueryCondition = (allProps: QueryConditionProps) => {
    const { name,
        formState,
        onRemove,
        ...props } = allProps
    
    const { control, watch, formState: { errors } } = formState
    const classes = useQueryBuilderStyles();

    // const conditionDataPath = [...name, "data"];
    const conditionFieldName = `${name}.attribute` //[...conditionDataPath, "field"].join(".") as TFormFields;
    const conditionOperatorName = `${name}.comparison` // [...conditionDataPath, "operator"].join(".") as TFormFields;
    const conditionValueName = `${name}.value` // [...conditionDataPath, "value"].join(".") as TFormFields;

    const conditionFieldError = get(errors, conditionFieldName, null);
    const conditionOperatorError = get(errors, conditionOperatorName, null);
    const conditionValueError = get(errors, conditionValueName, null);

    // watch the value of the field
    const fieldValue = watch(conditionFieldName);
    const operatorValue = watch(conditionOperatorName);

    // dynamic operator and values
    const fieldTypeSchema = (exampleSchema as any)[fieldValue];
    const typeOperator = (typeOperatorMap as any)[fieldTypeSchema?.type];
    const valueOpts = (typeOperator as any)?.[operatorValue];

    const getHelperTextForInputValue = () => {
        const errorMessage = conditionValueError?.message
        if (errorMessage !== undefined) {
            return errorMessage
        }
        
        if (fieldTypeSchema.type === 'hour') {
            return "Enter value from 0 to 24"
        }
    }

    return (
        <div className={clsx(classes.item, classes.cond)}
            {...props}
        >
            {/* <Controller
                control={control}
                name={[...name, "type"].join(".") as TFormFields}
                defaultValue="cond"
                render={({field}) => <input type="hidden" {...field} />}
            /> */}

            <Controller
                control={control}
                name={conditionFieldName}
                defaultValue={""}
                rules={{ required: "Required" }}
                render={({
                    field: { onChange, value }
                }) => (
                    <TextField
                        select
                        label="Field"
                        style={{ width: 220 }}
                        margin="normal"
                        error={!!conditionFieldError}
                        helperText={conditionFieldError?.message}
                        onChange={onChange}
                        value={value}
                        variant="standard"
                    >
                        <MenuItem value="">None</MenuItem>
                        {Object.keys(exampleSchema).map((value, index, array) => {
                            const item = (exampleSchema as any)[value]; // TODO key of product schema
                            return (
                                <MenuItem key={value} value={value}>
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                )}
            />

            {fieldValue === "" || !typeOperator ? null : (
                <>
                    <Controller
                        key={typeOperator.label}
                        control={control}
                        name={conditionOperatorName}
                        defaultValue={""}
                        rules={{ required: "Required" }}
                        render={({
                            field: { onChange, value }
                        }) => (
                            <TextField
                                select
                                label="Operator"
                                margin="normal"
                                style={{ width: 220, marginLeft: 15 }}
                                error={!!conditionOperatorError}
                                helperText={conditionOperatorError?.message}
                                onChange={onChange}
                                value={value}
                                variant="standard"
                            >
                                <MenuItem value="">None</MenuItem>
                                {Object.keys(typeOperator).map((value, index, array) => {
                                    const item = (typeOperator as any)[value]; // TODO key of product schema
                                    return (
                                        <MenuItem key={value} value={value}>
                                            {item.label}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        )}
                    />

                    {fieldTypeSchema.type === 'weekday' ?
                        <Controller
                            // name={`${objectFieldName}.to` as Path<FieldValues>}
                            name={conditionValueName}
                            control={control}
                            // rules={{ required: REQUIRED_ERROR_MSG }}
                            render={({ field }) => (
                                <WeekdaySelect
                                    field={field}
                                    label="Value"
                                    style={{ ml: 1.875, mt: 2, flex: 1 }}
                                    // fieldError={(currErrors as any)?.to}
                                />
                            )}
                        />

                    : valueOpts?.multiple ? (
                        <Controller
                            key={`${typeOperator.label}-multiple`}
                            control={control}
                            name={conditionValueName}
                            defaultValue={[]}
                            rules={{
                                validate: {
                                    minLength: (value) =>
                                        value.length === 0 ? "Must have at least one value." : true
                                }
                            }}
                            render={({
                                field: { onChange, value }
                            }) => {
                                return <SliderWithInputs 
                                    value={value}
                                    onChange={onChange}
                                />
                            }}
                        />
                    ) : (
                        <Controller
                            key={`${typeOperator.label}-single`}
                            control={control}
                            name={conditionValueName}
                            defaultValue={""}
                            rules={{ required: "Required" }}
                            render={({
                                field: { onChange, value }
                            }) => (
                                <TextField
                                    label="Value"
                                    margin="normal"
                                    type={fieldTypeSchema.type === "number" ? "number" : "text"}
                                    onChange={(e) => {
                                        fieldTypeSchema.type === "number"
                                            ? onChange(Number(e.target.value))
                                            : onChange(e.target.value);
                                    }}
                                    style={{ flex: 1, marginLeft: 15 }}
                                    error={!!conditionValueError}
                                    helperText={getHelperTextForInputValue()}
                                    value={value}
                                    variant="standard"
                                />
                            )}
                        />
                    )}
                </>
            )}

            <span
                style={{
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    margin: `16px 0 30px 10px`
                }}
            >
                <Tooltip title="Remove Condition">
                    <IconButton onClick={onRemove}>
                        <RemoveIcon />
                    </IconButton>
                </Tooltip>
            </span>
        </div>
    );
};
