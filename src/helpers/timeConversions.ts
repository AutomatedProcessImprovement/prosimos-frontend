export const millisecondsToNearest = (ms: string) => {
    const msNum = parseFloat(ms)
    console.log(msNum)

    if (isNaN(msNum)) {
        return ""
    }

    let finalNum, measure
    if (msNum >= 2629800000) {          // >= 1 month
        finalNum =  msNum / 2629800000
        measure = "M"
    } else if (msNum >= 604800000) {    // >= 1 week
        finalNum =  msNum / 604800000
        measure = "wks"
    } else if (msNum >= 3600000) {      // >= 1 hour
        finalNum =  msNum / 3600000
        measure = "hrs"
    } else if (msNum >= 60000) {        // >= 1 min
        finalNum =  msNum / 60000
        measure = "min"
    } else if (msNum >= 1000) {         // >= 1 sec
        finalNum =  msNum / 1000
        measure = "s"
    } else {
        finalNum =  msNum
        measure = "ms"
    }

    return finalNum.toFixed(2) + " " + measure
};
