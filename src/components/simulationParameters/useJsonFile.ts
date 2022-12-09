import { useEffect, useState } from "react";
import { JsonData } from "../formData";
import { EventsFromModel } from "../modelData";


const useJsonFile = (jsonFile: any, eventsFromModel?: EventsFromModel) => {
    const [missedElemNum, setMissedElemNum] = useState(0)   // shows num of elements that were present in the config
                                                            // but were absent in BPMN model
    const [jsonData, setJsonData] = useState<JsonData>()

    useEffect(() => {
        if (jsonFile !== null && jsonFile !== "" && eventsFromModel !== undefined) {
            const jsonFileReader = new FileReader();
            jsonFileReader.readAsText(jsonFile, "UTF-8")
            jsonFileReader.onload = e => {
                if (e.target?.result && typeof e.target?.result === 'string') {
                    const rawData = JSON.parse(e.target.result)
                    const [missedNum, finalEvents] = getMergeEventsList(eventsFromModel, rawData["event_distribution"])
                    rawData["event_distribution"] = finalEvents

                    setJsonData(rawData)
                    setMissedElemNum(missedNum)
                }
            }
        }
    }, [jsonFile, eventsFromModel]);

    return { jsonData, missedElemNum }
}

/**
 * Merge events from BPMN with the configuration provided in .json file.
 * BPMN overrides the .json.
 * If event exists in BPMN but not in json      - we add it with empty distribution.
 * If an event exists in json but not in BPMN   - we ignore it and show the warning.
 */
const getMergeEventsList = (eventsFromModel: EventsFromModel, eventsConfig: any) => {
    const eventsArr = Object.keys(eventsFromModel)
    if (eventsArr.length === 0)
        return [eventsConfig.length, []] as const

    const allModelEvents: string[] = []
    const finalEvents = eventsArr.map((eventId: string) => {
        allModelEvents.push(eventId)
        const sameEventFromConfig = eventsConfig.find((config: { event_id: string; }) => config.event_id === eventId)
        if (sameEventFromConfig === undefined) {
            return {
                event_id: eventId
            }
        }

        return { ...sameEventFromConfig }
    })

    const difference: string[] = eventsConfig.filter((e: any) => !allModelEvents.includes(e.event_id));
    const missedNum = difference.length

    return [missedNum, finalEvents] as const
}

export default useJsonFile;