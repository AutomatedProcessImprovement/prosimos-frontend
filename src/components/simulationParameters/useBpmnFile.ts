import { useEffect, useState } from "react";
import BpmnModdle from "bpmn-moddle";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { AllModelTasks, Gateways, SequenceElements } from '../modelData';

const useBpmnFile = (bpmnFile: any) => {
    const [xmlData, setXmlData] = useState<string>("")
    const [tasksFromModel, setTasksFromModel] = useState<AllModelTasks>({})
    const [gateways, setGateways] = useState<Gateways>({})

    const getTargetTaskNameForGateway = (item: any, elementRegistry: any) => {
        let taskName = ""
        if (item.name === undefined) {
            const flowObjId = item.targetRef.id
            const el = elementRegistry._elements[flowObjId]?.element
            if (el?.type === "bpmn:Task") {
                taskName = el.businessObject.name
            }
        }

        return taskName
    };

    useEffect(() => {
        const bpmnFileReader = new FileReader()
        bpmnFileReader.readAsText(bpmnFile)
        bpmnFileReader.onloadend = () => {
            const importXml = async () => {
                const fileData = bpmnFileReader.result as string
                setXmlData(fileData)

                const modeler = new BpmnModeler()
                const result = await modeler.importXML(fileData)
                const { warnings } = result;

                // moddle
                const moddle = new BpmnModdle()
                const res = await moddle.fromXML(fileData)

                const elementRegistry = modeler.get('elementRegistry')

                const tasks = elementRegistry
                    .filter((e: { type: string; }) => e.type === 'bpmn:Task')
                    .reduce((acc: {}, t: any) => (
                        {
                            ...acc,
                            [t.id]: { 
                                name: t.businessObject.name,
                                resource: JSON.parse(t.businessObject.documentation[0].text).resource
                            } 
                        }
                    ), {})
                setTasksFromModel(tasks)
                
                const gateways = elementRegistry
                    .filter((e: { type: string; }) => e.type === "bpmn:ExclusiveGateway")
                    .reduce((acc: any, current: { id: any; businessObject: any, type: any }) => {
                        const bObj = current.businessObject
                        if (bObj.gatewayDirection !== "Diverging" && bObj.outgoing.length < 2) {
                            return acc
                        }

                        const childs = bObj.outgoing.reduce((acc: {}, item: any) => {
                            let taskName = getTargetTaskNameForGateway(item, elementRegistry)

                            return {
                                ...acc,
                                [item.id]: {
                                    name: item.name ?? taskName
                                }
                            }
                        }, {} as SequenceElements)

                        return {
                            ...acc,
                            [current.id]: {
                                type: current.type,
                                name: current.businessObject.name,
                                childs: childs
                            }
                        }
                    }, {} as Gateways)
                setGateways(gateways)
            }

            try {
                importXml()
            }
            catch (err: any) {
                console.log(err.message, err.warnings);
            }
        }
    }, [bpmnFile]);

    return { xmlData, tasksFromModel, gateways }
}

export default useBpmnFile;