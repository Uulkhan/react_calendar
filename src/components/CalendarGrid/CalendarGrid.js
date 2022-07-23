import React from "react";
import styled from "styled-components";

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 2px;
  background-color: #4d4c4d;
`;
const CellWrapper = styled.div`
  min-height: 80px;
  min-width: 140px;
  background-color: ${(props) => (props.isWeekday ? "#27282A" : "#1E1F21")};
  color: #dddddd;
`;

const RowInCell = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
`;

const DayWrapper = styled.div`
  height: 31px;
  width: 31px;
  display: flex;
  align-items: center;
  justify-content: center; ;
`;

const CalendarGrid = ({ startDay }) => {
  const totalDays = 42;
  const day = startDay.clone().subtract(1, "day");
  const daysMap = [...Array(totalDays)].map(() => day.add(1, "day").clone());

  console.log(daysMap);
  return (
    <GridWrapper>
      {daysMap.map((dayItem) => (
        <CellWrapper isWeekday={dayItem.day() === 6 || dayItem.day() === 0}>
          <RowInCell justifyContent={"flex-end"}>
            <DayWrapper>{dayItem.format("D")}</DayWrapper>
          </RowInCell>
        </CellWrapper>
      ))}
    </GridWrapper>
  );
};

export default CalendarGrid;
