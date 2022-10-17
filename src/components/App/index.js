import React, { useEffect, useState } from "react";
import moment from "moment";
import styled from "styled-components";
import Monitor from "../Monitor/Monitor";
import { DISPLAY_MODE_DAY, DISPLAY_MODE_MONTH } from "../../helpers/constants";
import CalendarGrid from "../CalendarGrid/CalendarGrid";
import { DayShowComponent } from "../DayShowComponent";
import {
  ButtonsWrapper,
  ButtonWrapper,
  EventBody,
  EventTitle,
} from "../../containers/StyledComponents";

const ShadowWrapper = styled("div")`
  min-width: 850px;
  height: 702px;
  border-top: 1px solid #737374;
  border-left: 1px solid #464648;
  border-right: 1px solid #464648;
  border-bottom: 2px solid #464648;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px #1a1a1a, 0 8px 20px 6px #888;
  display: flex;
  flex-direction: column;
`;

const FormPositionWrapper = styled("div")`
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled(ShadowWrapper)`
  width: 320px;
  min-width: 320px;
  height: 132px;
  background-color: #1e1f21;
  color: #dddddd;
  box-shadow: unset;
`;

const url = process.env.API_URL ? process.env.API_URL : "http://localhost:3001";

const totalDays = 42; 
const defaultEvent = {
  title: "",
  description: "",
  date: moment().format("X"),
};

function App() {
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODE_MONTH);

  moment.updateLocale("en", { week: { dow: 1 } });
  const [today, setToday] = useState(moment());
  const startDay = today.clone().startOf(DISPLAY_MODE_MONTH).startOf("week");

  const prevHandler = () =>
    setToday((prev) => prev.clone().subtract(1, displayMode));
  const todayHandler = () => setToday(moment());
  const nextHandler = () =>
    setToday((prev) => prev.clone().add(1, displayMode));

  const [method, setMethod] = useState(null);
  const [isShowForm, setShowForm] = useState(false);
  const [event, setEvent] = useState(null);

  const [events, setEvents] = useState([]);
  const startDayQuery = startDay.clone().format("X");
  const endDayQuery = startDay.clone().add(totalDays, "days").format("X");
  useEffect(() => {
    fetch(`${url}/events?date_gte=${startDayQuery}&date_lte=${endDayQuery}`)
      .then((res) => res.json())
      .then((res) => setEvents(res));
  }, [today]);

  const openFormHandler = (methodName, eventForUpdate, dayItem) => {
    setEvent(eventForUpdate || { ...defaultEvent, date: dayItem.format("X") });
    setMethod(methodName);
  };

  const openModalFormHandler = (methodName, eventForUpdate, dayItem) => {
    setShowForm(true);
    openFormHandler(methodName, eventForUpdate, dayItem);
  };

  const cancelButtonHandler = () => {
    setShowForm(false);
    setEvent(null);
  };

  const changeEventHandler = (text, field) => {
    setEvent((prevState) => ({
      ...prevState,
      [field]: text,
    }));
  };

  const eventFetchHandler = () => {
    const fetchUrl =
      method === "Update" ? `${url}/events/${event.id}` : `${url}/events`;
    const httpMethod = method === "Update" ? "PATCH" : "POST";

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (method === "Update") {
          setEvents((prevState) =>
            prevState.map((eventEl) => (eventEl.id === res.id ? res : eventEl))
          );
        } else {
          setEvents((prevState) => [...prevState, res]);
        }
        cancelButtonHandler();
      });
  };

  const removeEventHandler = () => {
    const fetchUrl = `${url}/events/${event.id}`;
    const httpMethod = "DELETE";

    fetch(fetchUrl, {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setEvents((prevState) =>
          prevState.filter((eventEl) => eventEl.id !== event.id)
        );
        cancelButtonHandler();
      });
  };

  return (
    <>
      {isShowForm ? (
        <FormPositionWrapper onClick={cancelButtonHandler}>
          <FormWrapper onClick={(e) => e.stopPropagation()}>
            <EventTitle
              value={event.title}
              onChange={(e) => changeEventHandler(e.target.value, "title")}
              placeholder="Title"
            />
            <EventBody
              value={event.description}
              onChange={(e) =>
                changeEventHandler(e.target.value, "description")
              }
              placeholder="Description"
            />
            <ButtonsWrapper>
              <ButtonWrapper onClick={cancelButtonHandler}>
                Cancel
              </ButtonWrapper>
              <ButtonWrapper onClick={eventFetchHandler}>
                {method}
              </ButtonWrapper>
              {method === "Update" ? (
                <ButtonWrapper danger onClick={removeEventHandler}>
                  Remove
                </ButtonWrapper>
              ) : null}
            </ButtonsWrapper>
          </FormWrapper>
        </FormPositionWrapper>
      ) : null}
      <ShadowWrapper>
        <Monitor
          today={today}
          prevHandler={prevHandler}
          todayHandler={todayHandler}
          nextHandler={nextHandler}
          setDisplayMode={setDisplayMode}
          displayMode={displayMode}
        />
        {displayMode === "month" ? (
          <CalendarGrid
            startDay={startDay}
            today={today}
            totalDays={totalDays}
            events={events}
            openModalFormHandler={openModalFormHandler}
            setDisplayMode={setDisplayMode}
          />
        ) : null}

        {displayMode === DISPLAY_MODE_DAY ? (
          <DayShowComponent
            today={today}
            events={events}
            selectedEvent={event}
            setEvent={setEvent}
            changeEventHandler={changeEventHandler}
            cancelButtonHandler={cancelButtonHandler}
            eventFetchHandler={eventFetchHandler}
            removeEventHandler={removeEventHandler}
            method={method}
            openFormHandler={openFormHandler}
          />
        ) : null}
      </ShadowWrapper>
    </>
  );
}

export default App;
