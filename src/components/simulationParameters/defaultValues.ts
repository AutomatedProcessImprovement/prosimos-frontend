import { v4 as uuid } from "uuid";
import { ProbabilityDistribution } from "../formData";

export const defaultTemplateSchedule = (withWeekends: boolean) => {
    const tp = [{
        from: "MONDAY",
        to: "THURSDAY",
        beginTime: "09:00:00.000",
        endTime: "17:00:00.000"
    }]

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
        name: "default schedule",
        time_periods: tp
    }
}

export const defaultArrivalTimeDistribution = () => ({
    distribution_name: "",
    distribution_params: [
        { value: 0 },
        { value: 0 }
    ]
} as ProbabilityDistribution) 