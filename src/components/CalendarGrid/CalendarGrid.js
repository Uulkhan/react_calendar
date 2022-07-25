import React from "react";
import styled from "styled-components";
import { MonthDaysList } from "../MonthDaysList/MonthDaysList";

const GridWrapperDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 2px;
  background-color: ${(props) => (props.isHeader ? "#1E1F21" : "#4D4C4D")};
  ${(props) => props.isHeader && `border-bottom: 1px solid #4D4C4D`}
`;

const CalendarGrid = ({
  startDay,
  today,
  totalDays,
  events,
  openFormHandler,
}) => {
  return (
    <>
      <GridWrapperDiv isHeader></GridWrapperDiv>
      <GridWrapperDiv>
        <MonthDaysList
          totalDays={totalDays}
          openFormHandler={openFormHandler}
          events={events}
          startDay={startDay}
          today={today}
        />
      </GridWrapperDiv>
    </>
  );
};

export default CalendarGrid;
