import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { EventDistribution, JsonData } from "../formData";
import { AllModelTasks, EventsFromModel, Gateways } from "../modelData";
import { defaultTemplateSchedule, defaultArrivalTimeDistribution, defaultArrivalCalendarArr, defaultResourceProfiles } from "./defaultValues";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MIN_LENGTH_REQUIRED_MSG, REQUIRED_ERROR_MSG, SHOULD_BE_NUMBER_MSG, SUMMATION_ONE_MSG, INVALID_TIME_FORMAT } from "./../validationMessages";
import { round } from "../../helpers/timeConversions";

const useFormState = (tasksFromModel: AllModelTasks, gateways: Gateways, eventsFromModel?: EventsFromModel, jsonData?: JsonData) => {
    const [data, setData] = useState({})

    const taskValidationSchema = useMemo(() => (yup.object().shape({
        resource_profiles: yup.array()
            .of(
                yup.object().shape({
                    id: yup.string(),
                    name: yup.string().required(REQUIRED_ERROR_MSG),
                    resource_list: yup.array()
                        .of(
                            yup.object().shape({
                                id: yup.string(),
                                name: yup.string().required(REQUIRED_ERROR_MSG),
                                cost_per_hour: yup.number().required(REQUIRED_ERROR_MSG),
                                amount: yup.number().typeError(SHOULD_BE_NUMBER_MSG).required(REQUIRED_ERROR_MSG),
                                calendar: yup.string().required(REQUIRED_ERROR_MSG),
                                assignedTasks: yup.array()
                            })
                        )
                        .min(1, MIN_LENGTH_REQUIRED_MSG("resource"))
                })
            )
            .min(1, MIN_LENGTH_REQUIRED_MSG("resource profile")),
        arrival_time_distribution: yup.object().shape({
            distribution_name: yup.string().required(REQUIRED_ERROR_MSG),
            distribution_params: yup.array()
                .of(
                    yup.object().shape({
                        value: yup.number().typeError(SHOULD_BE_NUMBER_MSG).required(REQUIRED_ERROR_MSG)
                    })
                )
                .required()
                .min(2, "At least two required parameters should be provided")
        }),
        arrival_time_calendar: yup.array()
            .of(
                yup.object().shape({
                from: yup.string().required(REQUIRED_ERROR_MSG),
                to: yup.string().required(REQUIRED_ERROR_MSG),
                beginTime: yup.string().timeFormat(INVALID_TIME_FORMAT),
                endTime: yup.string().timeFormat(INVALID_TIME_FORMAT),
            })
            )
            .required()
            .min(1, MIN_LENGTH_REQUIRED_MSG("arrival calendar")),
        gateway_branching_probabilities: yup.array()
            .of(
                yup.object().shape({
                    gateway_id: yup.string().required(),
                    probabilities: yup.array()
                        .of(
                            yup.object().shape({
                                path_id: yup.string().required(),
                                value: yup.number().typeError(SHOULD_BE_NUMBER_MSG).required(REQUIRED_ERROR_MSG)
                            })
                        )
                        .test(
                            'sum',
                            SUMMATION_ONE_MSG,
                            (probs = []) => {
                                const total = probs.reduce((acc, curr) => Number(acc) + Number(curr.value), 0)
                                const rounded = round(total, 5)
                                return rounded === 1;
                            }
                        )
                })
            )
            .required(),
        task_resource_distribution: yup.array()
            .of(
                yup.object().shape({
                    task_id: yup.string().required(),
                    resources: yup.array()
                        .of(
                            yup.object().shape({
                                resource_id: yup.string().required(REQUIRED_ERROR_MSG),
                                distribution_name: yup.string().required(REQUIRED_ERROR_MSG),
                                distribution_params: yup.array()
                                    .of(
                                        yup.object().shape({
                                            value: yup.number().typeError(SHOULD_BE_NUMBER_MSG).required(REQUIRED_ERROR_MSG)
                                        })
                                    )
                                    // .min(2, "At least two required parameters should be provided")
                            })
                        )
                        .min(1, MIN_LENGTH_REQUIRED_MSG("allocated resource"))
                })
            )
            .required(),
        resource_calendars: yup.array()
            .of(
                yup.object().shape({
                    id: yup.string(),
                    name: yup.string().required(REQUIRED_ERROR_MSG),
                    time_periods: yup.array()
                        .of(
                            yup.object().shape({
                                from: yup.string().required(REQUIRED_ERROR_MSG),
                                to: yup.string().required(REQUIRED_ERROR_MSG),
                                beginTime: yup.string().timeFormat(INVALID_TIME_FORMAT),
                                endTime: yup.string().timeFormat(INVALID_TIME_FORMAT),
                            })
                        )
                        .required()
                })
            )
            .required(),
        event_distribution: yup.array()
            .of(
                yup.object().shape({
                    event_id: yup.string().required(REQUIRED_ERROR_MSG),
                    distribution_name: yup.string().required(REQUIRED_ERROR_MSG),
                    distribution_params: yup.array()
                        .of(
                            yup.object().shape({
                                value: yup.number().typeError(SHOULD_BE_NUMBER_MSG).required(REQUIRED_ERROR_MSG)
                            })
                        )
                })
            ),
        batch_processing: yup.array()
            .of(
                yup.object().shape({
                    task_id: yup.string().required(REQUIRED_ERROR_MSG),
                    type: yup.string().required(REQUIRED_ERROR_MSG),
                    batch_frequency: yup.number().typeError(SHOULD_BE_NUMBER_MSG).required(REQUIRED_ERROR_MSG),
                    size_distrib: yup.array().min(1, MIN_LENGTH_REQUIRED_MSG("size distribution")),
                    duration_distrib: yup.array().min(1, MIN_LENGTH_REQUIRED_MSG("duration distribution")),
                    firing_rules: yup.array()
                        .of(
                            yup.array()
                                .of(
                                    yup.object().shape({
                                        attribute: yup.string().required(REQUIRED_ERROR_MSG),
                                        comparison: yup.string().required(REQUIRED_ERROR_MSG),
                                        value: yup.string().required(REQUIRED_ERROR_MSG)
                                    })
                                )
                        )
                })
            )
    })), []);
    
    const formState = useForm<JsonData>({
        resolver: yupResolver(taskValidationSchema),
        mode: "onBlur" // validate on blur
    })
    const { reset } = formState

    useEffect(() => {
        if (jsonData === undefined) {
            // TODO: should we merge tasks if the provided json wasn't correct
            // const existingTasksInJson = jsonData?.task_resource_distribution ?? []
            // const existingTaskIds = existingTasksInJson.map((i) => i.task_id)
            // const newTasksFromModel = Object.keys(tasksFromModel).reduce<TaskResourceDistribution[]>((acc, key) => {
            //     if (existingTaskIds.includes(key))
            //         return acc

            //     acc.push({"task_id": key, resources: []})
            //     return acc
            // }, [])

            const mappedTasksFromModel = Object.keys(tasksFromModel).map((key) => ({
                "task_id": key,
                resources: []
            }))

            const mappedGateways = Object.entries(gateways).map(([key, item]) => {
                return {
                    gateway_id: key,
                    probabilities: Object.keys(item.childs).map((key) => ({
                        path_id: key,
                        value: "0"
                    }))
                }
            })

            let mappedEvents: EventDistribution[] = []
            if (eventsFromModel !== undefined) {
                const eventIdsArr = Object.keys(eventsFromModel)
                mappedEvents = eventIdsArr.map((eventId) => {
                    return {
                        event_id: eventId,
                        ...defaultArrivalTimeDistribution
                    }
                })
            }

            const defaultResourceCalendars = defaultTemplateSchedule(false)
            
            const updData = {
                task_resource_distribution: mappedTasksFromModel,
                resource_calendars: [defaultResourceCalendars],
                gateway_branching_probabilities: mappedGateways,
                arrival_time_distribution: defaultArrivalTimeDistribution,
                arrival_time_calendar: defaultArrivalCalendarArr,
                resource_profiles: defaultResourceProfiles(defaultResourceCalendars.id),
                event_distribution: mappedEvents,
                batch_processing: []
            }
            setData(updData)
        }
    }, [tasksFromModel, jsonData, gateways, eventsFromModel]);

    useEffect(() => {
        reset(data)
    }, [data, reset]);

    useEffect(() => {
        if (jsonData !== undefined) {
            reset(jsonData)
        }
    }, [jsonData, reset]);

    return { formState }
}

export default useFormState;
