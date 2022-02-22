export interface ModelTask {
    name: string
    resource: string
}

export interface AllModelTasks {
    [id: string]: ModelTask
}

export interface Gateways {
    [gatewayId: string]: GatewayInfo
}

export interface GatewayInfo {
    type: string
    name: string
    childs: SequenceElements
}

export interface SequenceElements {
    [seqId: string]: {
        name: string
    }
}