import axios from "../axios";

export const simulate = async (startDate: string, numProcesses: number,
    newJsonFile: Blob | File, bpmnFile: Blob | File
    ) => {
    const formData = new FormData()
    formData.append("startDate", startDate)
    formData.append("numProcesses", numProcesses.toString())
    formData.append("simScenarioFile", newJsonFile as Blob)
    formData.append("modelFile", bpmnFile as Blob)

    return await axios.post(
        '/api/simulate',
        formData)
};