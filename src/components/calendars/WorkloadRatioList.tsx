import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import TimePeriodGridItemsWithAdd from "./TimePeriodGridItemsWithAdd"
import { JsonData } from "../formData"
import { defaultWorkWeekTimePeriod } from "../simulationParameters/defaultValues"
import { DAYS_AS_NUMBERS, DAYS_OF_WEEK, hasIntersection } from "../../helpers/timeConversions"
import { ModelType } from "./ModelType"
import { useFieldArray, UseFormReturn } from "react-hook-form"

interface WorkloadRatioListProps {
    formState: UseFormReturn<JsonData, object>
    calendarIndex: number
    calendarKey: string
    modelType: ModelType    
    weekdayFilter: Array<string>
    setIsResourceCalendarsTimePeriodsValid: Dispatch<SetStateAction<boolean>>
}

const WorkloadRatioList = (props: WorkloadRatioListProps) => {
    const { formState, calendarIndex, calendarKey, modelType, weekdayFilter } = props
    const { control } = formState
    const [index, setIndex] = useState<number>(calendarIndex)
    const [intersections, setIntersections] = useState({});    

    const checkIntersections = (time_periods:any) => {
      let newIntersections:any = []
      props.setIsResourceCalendarsTimePeriodsValid(true)
      
      for(let i = 0; i < time_periods.length; i++) {
        newIntersections[i] = newIntersections[i] || []

        for(let j = i + 1; j < time_periods.length; j++) {
          if(hasIntersection(time_periods[i], time_periods[j])) {
            newIntersections[i].push(time_periods[j]);
            newIntersections[j] = newIntersections[j] || []
            newIntersections[j].push(time_periods[i]);
            props.setIsResourceCalendarsTimePeriodsValid(false)
          }
        }
      }
      setIntersections(newIntersections)
    };

  useEffect(() => {
      const unsub = formState.watch(({ resource_calendars }) => {
          checkIntersections(resource_calendars?.[calendarIndex]?.workload_ratio);
      });
      return () => unsub.unsubscribe();
  }, [formState.watch, calendarIndex, checkIntersections]);

    const { fields: currTimePeriods, append, remove } = useFieldArray({
        keyName: 'key',
        control: control,
        name: `resource_calendars.${index}.workload_ratio`
    })

    const filteredTimePeriods = useMemo(() => {
        const filterRange = weekdayFilter.map((weekday) => DAYS_AS_NUMBERS[weekday]);

        let displayIndex = 0;
      
        return currTimePeriods.map((period) => {
          const periodRange = [];
          let fromDay = DAYS_AS_NUMBERS[period.from];
          let toDay = DAYS_AS_NUMBERS[period.to];
      
          for (let i = fromDay; i <= toDay; i++) {
            periodRange.push(i);
          }
      
          const isDisplayed = periodRange.every(val => filterRange.includes(val));
          let modifiedPeriod
          if (isDisplayed) {
            modifiedPeriod = { ...period, isDisplayed, displayIndex };
            displayIndex++;
          } else {
            modifiedPeriod = { ...period, isDisplayed };
          }
      
          return modifiedPeriod;
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
            let newWorkWeekTimePeriod = defaultWorkWeekTimePeriod
            newWorkWeekTimePeriod.from = weekdayFilter[0];
            newWorkWeekTimePeriod.to = weekdayFilter[0];
            append(newWorkWeekTimePeriod)
        } else {
            append(defaultWorkWeekTimePeriod);
        }
      };
      

    return <TimePeriodGridItemsWithAdd
        key={`resource_calendars.${calendarKey}.workload_ratio`}
        fields={filteredTimePeriods}
        formState={formState}
        modelType={modelType}
        objectFieldNamePart={`resource_calendars.${calendarIndex}.workload_ratio` as unknown as keyof JsonData}
        onTimePeriodRemove={onTimePeriodRemove}
        onTimePeriodAdd={onTimePeriodAdd}
        intersections={intersections}
    />
}

export default WorkloadRatioList