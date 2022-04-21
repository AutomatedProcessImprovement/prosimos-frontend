export interface JsonData {
    resource_profiles: ResourcePool[]
    arrival_time_distribution: ProbabilityDistribution
    arrival_time_calendar: TimePeriod[]
    gateway_branching_probabilities: GatewayBranchingProbability[]
    task_resource_distribution: TaskResourceDistribution[]
    resource_calendars: ResourceCalendar[]
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
    cost_per_hour: number
    amount: number
    calendar: string
    assignedTasks: string []
}

export interface ProbabilityDistribution {
    distribution_name: string
    distribution_params: { value: number }[]
}

export interface ProbabilityDistributionForResource extends ProbabilityDistribution {
    resource_id: string
}

export interface TimePeriod {
    from: string
    to: string
    beginTime: string
    endTime: string
}

export interface ResourceCalendar {
    id: string
    name: string
    time_periods: TimePeriod[]
}

export interface CalendarMap {
    [key: string]: string
}

export interface ResourceMap {
    [resourceId: string]: {
        name: string
    }
}

export interface TaskResourceDistribution {
    task_id: string
    resources: ProbabilityDistributionForResource[]
}

export interface ScenarioProperties {
    num_processes: number
    start_date: string
}
