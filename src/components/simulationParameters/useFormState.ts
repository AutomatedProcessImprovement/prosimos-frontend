import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { JsonData } from "../formData";

const useJsonFile = (jsonData: any) => {
    const formState = useForm<JsonData>({
        mode: "onBlur" // validate on blur
    })
    const { handleSubmit, reset, formState: { errors } } = formState

    useEffect(() => {
        reset(jsonData)
        console.log("reset")
        console.log(jsonData)
    }, [jsonData, reset]);
    
    return { formState, handleSubmit, errors }
}

export default useJsonFile;