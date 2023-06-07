import { useEffect, useMemo, useState } from "react"
import TimePeriodGridItemsWithAdd from "./TimePeriodGridItemsWithAdd"
import { JsonData } from "../formData"
import { defaultWorkWeekTimePeriod } from "../simulationParameters/defaultValues"
import { DAYS_OF_WEEK } from "../../helpers/timeConversions"
import { ModelType } from "./ModelType"
import { useFieldArray, UseFormReturn } from "react-hook-form"

interface TimePeriodListProps {
    formState: UseFormReturn<JsonData, object>
    calendarIndex: number
    calendarKey: string
    modelType: ModelType    
    weekdayFilter: Array<string>
}

type DayNumbers = { [key: string]: number };
const TimePeriodList = (props: TimePeriodListProps) => {
    const { formState, calendarIndex, calendarKey, modelType, weekdayFilter } = props
    const { control } = formState
    const [index, setIndex] = useState<number>(calendarIndex)

    const { fields: currTimePeriods, append, remove } = useFieldArray({
        keyName: 'key',
        control: control,
        name: `resource_calendars.${index}.time_periods`
    })

    const filteredTimePeriods = useMemo(() => {
        const daysAsNumbers: DayNumbers = {
          "MONDAY": 1,
          "TUESDAY": 2,
          "WEDNESDAY": 3,
          "THURSDAY": 4,
          "FRIDAY": 5,
          "SATURDAY": 6,
          "SUNDAY": 7,
        };
      
        const filterRange = weekdayFilter.map((weekday) => daysAsNumbers[weekday]);
      
        return currTimePeriods.map((period) => {
          const periodRange = [];
          let fromDay = daysAsNumbers[period.from];
          let toDay = daysAsNumbers[period.to];
      
          for (let i = fromDay; i <= toDay; i++) {
            periodRange.push(i);
          }
      
          const isDisplayed = periodRange.every(val => filterRange.includes(val));
      
          return { ...period, isDisplayed };
        });
      }, [currTimePeriods, weekdayFilter, append]);
    
    useEffect(() => {
        if (index !== calendarIndex) {
            setIndex(calendarIndex)
        }
    }, [calendarIndex, index])

    const onTimePeriodRemove = (index: number) => {
        remove(index)
    };

    const onTimePeriodAdd = () => {
        const isMondayToFriday = DAYS_OF_WEEK.slice(0, 5).every(weekday =>
          weekdayFilter.includes(weekday)
        );
      
        if (!isMondayToFriday) {
            let newWrokWeekTimePeriod = defaultWorkWeekTimePeriod
            newWrokWeekTimePeriod.from = weekdayFilter[0];
            newWrokWeekTimePeriod.to = weekdayFilter[0];
            append(newWrokWeekTimePeriod)
        } else {
            append(defaultWorkWeekTimePeriod);
        }
      };
      

    return <TimePeriodGridItemsWithAdd
        key={`resource_calendars.${calendarKey}.time_periods`}
        fields={filteredTimePeriods}
        formState={formState}
        modelType={modelType}
        objectFieldNamePart={`resource_calendars.${calendarIndex}.time_periods` as unknown as keyof JsonData}
        onTimePeriodRemove={onTimePeriodRemove}
        onTimePeriodAdd={onTimePeriodAdd}
    />
}

export default TimePeriodList