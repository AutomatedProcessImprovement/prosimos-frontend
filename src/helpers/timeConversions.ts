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
    SECONDS = 1,
    MINUTES = 60,
    HOURS = 3600,
    DAYS = 86400,
    WEEKS = 604800,
    MONTHS = 2628000,
    YEARS = 31536000
  }

export const convertTime = (value: number, from: TimeUnit, to: TimeUnit): number => {
    const timeInSeconds = value * from;
    const convertedTime = timeInSeconds / to;
    return convertedTime;
}

export const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
