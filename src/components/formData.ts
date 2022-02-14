export interface JsonData {
    resource_profiles: ResourcePool[]
    arrival_time_distribution: ProbabilityDistribution
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

export interface ResourcePool {
    id: string,
    name: string,
    resource_list: ResourceInfo[]
}

export interface ResourceInfo {
    id: string,
    name: string,
    cost_per_hour: string
    amount: string
    timetable: string
    assignedTasks: string []
}

export interface ProbabilityDistribution {
    distribution_name: string
    distribution_params: { value: number }[]
}

export interface ProbabilityDistributionForResource extends ProbabilityDistribution {
    resource_id: string
}
