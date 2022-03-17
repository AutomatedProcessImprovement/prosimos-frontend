import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { JsonData, TaskResourceDistribution } from "../formData";
import { AllModelTasks } from "../modelData";

const useFormState = (tasksFromModel: AllModelTasks, jsonData?: JsonData) => {
    const [data, setData] = useState({})

    const formState = useForm<JsonData>({
        mode: "onBlur" // validate on blur
    })
    const { handleSubmit, reset, formState: { errors } } = formState

    useEffect(() => {
        if (jsonData !== undefined) {
            const existingTasksInJson = jsonData?.task_resource_distribution ?? []
            const existingTaskIds = existingTasksInJson.map((i) => i.task_id)
            const newTasksFromModel = Object.keys(tasksFromModel).reduce<TaskResourceDistribution[]>((acc, key) => {
                if (existingTaskIds.includes(key))
                    return acc
                
                acc.push({"task_id": key, resources: []})
                return acc
            }, [])
    
            const updData = {
                ...jsonData,
                task_resource_distribution: [
                    ...jsonData?.["task_resource_distribution"] ?? [],
                    ...newTasksFromModel
                ]
            }
    
            setData(updData)
        }
    }, [tasksFromModel, jsonData]);

    useEffect(() => {
        reset(data)
    }, [data, reset]);
    
    return { formState, handleSubmit, errors }
}

export default useFormState;
