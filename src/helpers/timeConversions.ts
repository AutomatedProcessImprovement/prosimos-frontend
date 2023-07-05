import { TimePeriod } from "../components/formData";

export const secondsToNearest = (sec: string | number) => {
    const secNum : number = (typeof sec === 'string') ? parseFloat(sec) : sec

    if (isNaN(secNum)) {
        return ""
    }

    let finalNum, measure
    if (secNum >= 31560000) {           // >= 1 year
        finalNum =  secNum / 31560000
        measure = "year"
    } else if (secNum >= 2628000) {     // >= 1 month
        finalNum =  secNum / 2628000
        measure = "month"
    } else if (secNum >= 86400) {       // >= 1 day
        finalNum =  secNum / 86400
        measure = "day"
    } else if (secNum >= 3600) {        // >= 1 hour
        finalNum =  secNum / 3600
        measure = "hour"
    } else if (secNum >= 60) {          // >= 1 min
        finalNum =  secNum / 60
        measure = "min"
    } else {
        finalNum =  secNum
        measure = "sec"
    }

    return round(finalNum, 2) + " " + isPlural(finalNum, measure)
};

const isPlural = (num: number, timeUnit: string) => {
    if (num >= -1 && num <= 1) {
        return timeUnit
    }
    else {
        return timeUnit + "s"
    }
};

export const round = (num: number, digits: number): number => {
    return +(num).toFixed(digits) 
};


export enum TimeUnit {
    Seconds = 1,
    Minutes = 60,
    Hours = 3600,
    Days = 86400,
    Weeks = 604800,
    Months = 2628000,
    Years = 31536000
  }

export const convertTime = (value: number, from: TimeUnit, to: TimeUnit): number => {
    const timeInSeconds = value * from;
    const convertedTime = timeInSeconds / to;
    return convertedTime;
}

export const DAYS_OF_WEEK = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

type DayNumbers = { [key: string]: number };
export const DAYS_AS_NUMBERS: DayNumbers = {
    "MONDAY": 1,
    "TUESDAY": 2,
    "WEDNESDAY": 3,
    "THURSDAY": 4,
    "FRIDAY": 5,
    "SATURDAY": 6,
    "SUNDAY": 7,
  };

export const generateDaysArray = (from:string, to:string) => 
    Object.keys(DAYS_AS_NUMBERS).slice(DAYS_AS_NUMBERS[from] - 1, DAYS_AS_NUMBERS[to]);;

export interface DayTimePeriod {
    beginTimeMinutes: number,
    endTimeMinutes: number
}

export const isTimeIntersects = (time1:DayTimePeriod, time2:DayTimePeriod) => {
    return time1.beginTimeMinutes < time2.endTimeMinutes && time2.beginTimeMinutes < time1.endTimeMinutes
}

export const hasIntersection = (period1:TimePeriod, period2:TimePeriod) => {
    let period1Days = generateDaysArray(period1.from, period1.to)
    let period2Days = generateDaysArray(period2.from, period2.to)

    let daysIntersection = period1Days.filter(day => period2Days.includes(day))

    if(daysIntersection.length === 0) {
      return false
    }

    let time1:DayTimePeriod = {
      beginTimeMinutes: convertStringTimeToMinutes(period1.beginTime),
      endTimeMinutes: convertStringTimeToMinutes(period1.endTime)
    }

    let time2:DayTimePeriod = {
      beginTimeMinutes: convertStringTimeToMinutes(period2.beginTime),
      endTimeMinutes: convertStringTimeToMinutes(period2.endTime)
    }

    return isTimeIntersects(time1,time2)
  }

export function convertStringTimeToMinutes(time:string) {
    let [hours, minutes] = time.split(':').map(Number);
    return convertTime(hours, TimeUnit.Hours, TimeUnit.Minutes) * 60 + minutes;
  }