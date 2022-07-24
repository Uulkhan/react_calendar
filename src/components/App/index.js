import moment from "moment";
import { useEffect, useState } from "react";
import styled from "styled-components";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import Header from "../Header/Header";
import Monitor from "../Monitor/Monitor";

const ShadowWrapper = styled.div`
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 2px solid #464648;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px #1a1a1a, 0 8px 20px 6px #888;
`;
const url = "http://localhost:5000/events";
const totalDays = 42;

function App() {
  const [today, setToday] = useState(moment());

  moment.updateLocale("en", { week: { dow: 1 } });
  const startDay = today.clone().startOf("month").startOf("week");

  const prevHandler = () => {setToday((prev) => prev.clone().subtract(1, "month"))};
  const todayHandler = () => {setToday(moment())};
  const nextHandler = () => {setToday((prev) => prev.clone().add(1, "month"))};

  const [events, setEvents] = useState([]);
  const startDayQuery = startDay.clone().format('X');
  const endDayQuery = startDay.clone().add(totalDays,'days').format('X');

  useEffect(()=> {
    fetch(`${url}/?date_gte=${startDayQuery}&date_lte=${endDayQuery}`)
    .then(res=> res.json())
    .then(res => setEvents(res))
  }, [])

  return (
    <ShadowWrapper>
      <Header />
      <Monitor
        today={today}
        prevHandler={prevHandler}
        todayHandler={todayHandler}
        nextHandler={nextHandler}
      />
      <CalendarGrid startDay={startDay} today={today}  totalDays={totalDays}  />
    </ShadowWrapper>
  );
}

export default App;
