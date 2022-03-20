import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { JsonData } from "../formData";
import { AllModelTasks, Gateways } from "../modelData";
import { defaultTemplateSchedule } from "./defaultValues";

const useFormState = (tasksFromModel: AllModelTasks, gateways: Gateways, jsonData?: JsonData) => {
    const [data, setData] = useState({})

    const formState = useForm<JsonData>({
        mode: "onBlur" // validate on blur
    })
    const { handleSubmit, reset, formState: { errors } } = formState

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
    
            const updData = {
                task_resource_distribution: mappedTasksFromModel,
                resource_calendars: [defaultTemplateSchedule(false)],
                gateway_branching_probabilities: mappedGateways
            }
            setData(updData)
        }
    }, [tasksFromModel, jsonData, gateways]);

    useEffect(() => {
        reset(data)
    }, [data, reset]);

    useEffect(() => {
        if (jsonData !== undefined) {
            reset(jsonData)
        }
    }, [jsonData, reset]);
    
    return { formState, handleSubmit, errors }
}

export default useFormState;
