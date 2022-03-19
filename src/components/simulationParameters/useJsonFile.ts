import { useEffect, useState } from "react";
import { JsonData, ProbabilityDistribution, TimePeriod } from "../formData";

function emptyJsonData(): JsonData {
    return {
        resource_profiles: [],
        arrival_time_distribution: {} as ProbabilityDistribution,
        arrival_time_calendar: {} as TimePeriod,
        gateway_branching_probabilities: [],
        task_resource_distribution: [],
        resource_calendars: []
    }
}

const useJsonFile = (jsonFile: any) => {
    const [jsonData, setJsonData] = useState<JsonData>()

    useEffect(() => {
        if (jsonFile !== undefined && jsonFile !== "") {
            const jsonFileReader = new FileReader();
            jsonFileReader.readAsText(jsonFile, "UTF-8")
            jsonFileReader.onload = e => {
                if (e.target?.result && typeof e.target?.result === 'string') {
                    const rawData = JSON.parse(e.target.result)
                    setJsonData(rawData)
                }
            }
        }
        else {
            setJsonData(emptyJsonData())
        }
    }, [jsonFile]);
    
    return { jsonData }
}

export default useJsonFile;