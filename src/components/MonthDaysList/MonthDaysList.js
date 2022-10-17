import React from "react";
import { isDayContainCurrentEvent } from "../../helpers";
import { CalendarCell } from "../CalendarCell/CalendarCell";

export const MonthDaysList = ({
  startDay,
  totalDays,
  events,
  openModalFormHandler,
  today,
  setDisplayMode,
}) => {
  const day = startDay.clone().subtract(1, "day");
  const daysMap = [...Array(totalDays)].map(() => day.add(1, "day").clone());
  return daysMap.map((dayItem) => (
    <CalendarCell
      today={today}
      key={dayItem.unix()}
      events={events.filter((event) =>
        isDayContainCurrentEvent(event, dayItem)
      )}
      openModalFormHandler={openModalFormHandler}
      dayItem={dayItem}
      setDisplayMode={setDisplayMode}
    />
  ));
};
