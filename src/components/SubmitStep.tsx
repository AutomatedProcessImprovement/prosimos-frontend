import { Button, Grid } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { simulate } from "../api/api";
import paths from "../router/paths";
import { JsonData, ScenarioProperties } from "./formData";

interface SubmitStepProps {
    formState: UseFormReturn<JsonData, object>
    setErrorMessage: (value: string) => void
    scenarioState: UseFormReturn<ScenarioProperties, object>
    bpmnFile: File
}

const SubmitStep = (props: SubmitStepProps) => {
    const navigate = useNavigate()

    const { setErrorMessage, bpmnFile } = props
    const { getValues, handleSubmit } = props.formState
    const { getValues: getScenarioValues } = props.scenarioState

    const fromContentToBlob = (values: any) => {
        const content = JSON.stringify(values)
        const blob = new Blob([content], { type: "text/plain" })
        return blob
    };

    const onSubmit = (data: JsonData) => {
        const newJsonFile = fromContentToBlob(getValues())

        const { num_processes: numProcesses, start_date: startDate } = getScenarioValues()
        simulate(startDate, numProcesses, newJsonFile, bpmnFile)
            .then(((res: any) => {
                navigate(paths.SIMULATOR_RESULTS_PATH, {
                    state: {
                        output: res.data,
                        modelFile: bpmnFile,
                        scenarioProperties: newJsonFile,
                        numProcesses: numProcesses,
                        startDate: startDate
                    }
                })
            }))
            .catch((error: any) => {
                console.log(error.response)
                setErrorMessage(error.response.data.displayMessage)
            })
    };

    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12} className="centeredContent">
                <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                >Submit</Button>
            </Grid>
        </Grid>
    )
}

export default SubmitStep;