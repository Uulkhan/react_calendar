import moment from "moment";
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
overflow:hidden;
box-shadow: 0 0 0 1px #1A1A1A, 0 8px 20px 6px #888;
`
function App() {
  // const calendar = []; // is a month

 
  moment.updateLocale('en', {week: {dow: 1}});
  const today = moment();
  const startDay = today.clone().startOf('month').startOf('week');

  // const endDay = moment().endOf('month').endOf('week');

  // const day = startDay.clone();
  // while(!day.isAfter(endDay)){
  //   calendar.push(day.clone());
  //   day.add(1, 'day')
  // }
  
  return (
    <ShadowWrapper>
      <Header/>
      <Monitor today={today}/>
      <CalendarGrid startDay={startDay}/>
    </ShadowWrapper>
  );
}

export default App;
