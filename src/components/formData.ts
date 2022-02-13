import { ResourcePool } from "./ResourcePools";

export interface JsonData {
    resource_profiles: ResourcePool
    arrival_time_distribution: {}
    arrival_time_calendar: []
    gateway_branching_probabilities: GatewayBranchingProbability[]
    task_resource_distribution: {}
    resource_calendars: {}
}

export interface GatewayBranchingProbability {
    gateway_id: string,
    probabilities: Probability[]
}

export interface Probability {
    path_id: string
    value: number
}