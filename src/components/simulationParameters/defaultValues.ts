import { v4 as uuid } from "uuid";
import { ProbabilityDistribution, ProbabilityDistributionForResource, ResourceInfo, ResourcePool, TimePeriod } from "../formData";

const DEFAULT_SCHEDULE_NAME = "default schedule"

export const defaultWorkWeekTimePeriod = {
    from: "MONDAY",
    to: "FRIDAY",
    beginTime: "09:00:00.000",
    endTime: "17:00:00.000"
}

export const defaultTemplateSchedule = (withWeekends: boolean) => {
    const tp = [defaultWorkWeekTimePeriod]

    if (withWeekends) {
        tp.push({
            from: "SATURDAY",
            to: "SATURDAY",
            beginTime: "09:00:00.000",
            endTime: "13:00:00.000"
        })
    }

    return {
        id: "sid-" + uuid(),
        name: DEFAULT_SCHEDULE_NAME,
        time_periods: tp
    }
}

export const defaultResourceProfiles = (calendarUuid: string) => {
    const resourceProfileId = "sid-" + uuid()
    return [{
        id: resourceProfileId,
        name: "Default resource profile",
        resource_list: [{
            id: resourceProfileId + "_1",
            name: "Default resource profile 1",
            cost_per_hour: "0",
            amount: "1",
            calendar: calendarUuid,
            assignedTasks: []
        } as ResourceInfo] as ResourceInfo[]
    } as ResourcePool]
}

export const defaultArrivalTimeDistribution = {
    distribution_name: "",
    distribution_params: [
        { value: 0 },
        { value: 0 }
    ]
} as ProbabilityDistribution

export const defaultArrivalCalendar = {
    from: "",
    to: "",
    beginTime: "",
    endTime: ""
} as TimePeriod

export const defaultArrivalCalendarArr = [defaultArrivalCalendar] as TimePeriod[]

export const defaultResourceAllocationDist = {
    distribution_name: "norm",
    distribution_params: [
        { value: 0 },
        { value: 0 }
    ],
    resource_id: ""
} as ProbabilityDistributionForResource