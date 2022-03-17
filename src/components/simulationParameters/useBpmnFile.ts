import { useEffect, useState } from "react";
import BpmnModdle from "bpmn-moddle";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { AllModelTasks, Gateways, SequenceElements } from '../modelData';

const useBpmnFile = (bpmnFile: any) => {
    const [xmlData, setXmlData] = useState<string>("")
    const [tasksFromModel, setTasksFromModel] = useState<AllModelTasks>({})
    const [gateways, setGateways] = useState<Gateways>({})
    console.log("general bpmn file")

    useEffect(() => {
        console.log("useEffect bpmn file")
        const bpmnFileReader = new FileReader()
        bpmnFileReader.readAsText(bpmnFile)
        bpmnFileReader.onloadend = () => {
            const importXml = async () => {
                const fileData = bpmnFileReader.result as string
                console.log(fileData)
                setXmlData(fileData)

                const modeler = new BpmnModeler()
                const result = await modeler.importXML(fileData)
                const { warnings } = result;
                console.log(warnings);

                // moddle
                const moddle = new BpmnModdle()
                const res = await moddle.fromXML(fileData)
                console.log(res)

                const elementRegistry = modeler.get('elementRegistry')
                console.log(elementRegistry)
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
                console.log(tasks)

                // const resources = elementRegistry.map((e: { type: any; }) => e.type)
                // console.log(resources)

                const gateways = elementRegistry
                    .filter((e: { type: string; }) => e.type === "bpmn:ExclusiveGateway")
                    .reduce((acc: any, current: { id: any; businessObject: any, type: any }) => {
                        const childs = current.businessObject.outgoing.reduce((acc: {}, item: any) => (
                            {
                                ...acc,
                                [item.id]: {
                                    name: item.name
                                }
                            }
                        ), {} as SequenceElements)

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