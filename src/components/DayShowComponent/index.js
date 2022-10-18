import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import moment from "moment";
import {
  isDayContainCurrentEvent,
  isDayContainCurrentTimestamp,
} from "../../helpers";
import {
  ButtonsWrapper,
  ButtonWrapper,
  EventBody,
  EventItemWrapper,
  EventTitle,
} from "../../containers/StyledComponents";
import { ITEMS_PER_DAY, ONE_SECOND } from "../../helpers/constants";

const DayShowWrapper = styled("div")`
  display: flex;
  flex-grow: 1;
  border-top: 1px solid #464648; ;
`;

const EventsListWrapper = styled("div")`
  background-color: #1e1f21;
  color: #dddddd;
  flex-grow: 1;
`;

const EventFormWrapper = styled("div")`
  background-color: #27282a;
  color: #dddddd;
  width: 300px;
  position: relative;
  border-left: 1px solid #464648; ;
`;
const NoEventMsg = styled("div")`
  color: #565759;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
`;

const ScaleWrapper = styled("div")`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  position: relative;
`;

const ScaleCellWrapper = styled("div")`
  flex-grow: 1;
  position: relative;
  &:not(:last-child) {
    border-bottom: 1px solid #464648;
  }
  margin-left: 32px;
`;

const ScaleCellTimeWrapper = styled("div")`
  position: absolute;
  left: -26px;
  top: -6px;
  font-size: 8px;
`;

const ScaleCellEventWrapper = styled("div")`
  min-height: 20px;
`;

const EventItemButton = styled(EventItemWrapper)`
  min-width: ${(props) => props.w}px;
  height: ${(props) => props.h}px;
  width: unset;
  margin-left: 4px;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  display: flex;
  padding: 1px;
  background-color: rgba(93, 95, 99, 0.75);
`;

const SelectEventTimeWrapper = styled("div")`
  padding: 8px 14px;
  border-bottom: 1px solid #464648;
  display: flex;
`;

const ListOfHours = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
  height: 60px;
  overflow-y: scroll;
  color: #000;
  position: absolute;
  left: 2px;
  background-color: rgb(239, 239, 239);
`;

const PositionRelative = styled("div")`
  position: relative;
`;

const HoursButton = styled("button")`
  border: none;
  background-color: unset;
  cursor: pointer;
`;

const RedLine = styled("div")`
  background-color: #f00;
  height: 1px;
  position: absolute;
  left: 0;
  right: 0;
  top: ${(props) => props.position}%;
`;
const DropdownBtn = styled("button")`
  border: none;
  padding: 5px 5px;
  margin-right: 5px;
  border-radius: 3px;
`;
const CreateEventWrapperDiv = styled('div')`
display:flex;
justify-content: center;
`

export const DayShowComponent = ({
  events,
  today,
  selectedEvent,
  changeEventHandler,
  cancelButtonHandler,
  eventFetchHandler,
  method,
  removeEventHandler,
  openFormHandler,
}) => {
  const [heightDiv, setHeightDiv] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    setHeightDiv(ref.current.clientHeight / ITEMS_PER_DAY);
  }, []);

  const eventWidth = 40;
  const eventList = events.filter((event) =>
    isDayContainCurrentEvent(event, today)
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const cells = [...new Array(ITEMS_PER_DAY)].map((_, i) => {
    // const temp = [];
    // eventList.forEach(event => {
    //   // event.date -> '1661295600' -> moment -> timestamp -> H  ? -> 0
    //   if (+moment.unix(+event.date).format('H') === i) {
    //     temp.push(event);
    //   }
    // })
    // return temp;
  });

  const setTimeForEvent = (i) => {
    setShowTimePicker(false);
    const time = moment
      .unix(+selectedEvent.date)
      .hour(i)
      .format("X");
    changeEventHandler(time, "date");
  };

  const setDurationForEvent = (i) => {
    setShowDurationPicker(false);
    changeEventHandler(i, "duration");
  };

  const getTopPosition = (event) => {
    return heightDiv * +moment.unix(+event.date).format("H");
  };

  const getRedLinePosition = () =>
    ((moment().format("X") - today.format("X")) / 86400) * 100;

  const [, setCounter] = useState(0);
  useEffect(() => {
    const timerId = setInterval(() => {
      setCounter((prevState) => prevState + 1);
    }, ONE_SECOND);

    return () => clearInterval(timerId);
  }, []);

  return (
    <DayShowWrapper>
      <EventsListWrapper>
        <ScaleWrapper ref={ref}>
          {isDayContainCurrentTimestamp(moment().format("X"), today) ? (
            <RedLine position={getRedLinePosition()} />
          ) : null}
          {cells.map((eventsList, i) => (
            <ScaleCellWrapper>
              <ScaleCellTimeWrapper>
                {i ? <>{`${i}`.padStart(2, "0")}:00</> : null}
              </ScaleCellTimeWrapper>
              <ScaleCellEventWrapper />
            </ScaleCellWrapper>
          ))}
          {eventList.map((event, i) => (
            <EventItemButton
              w={eventWidth}
              h={heightDiv * event.duration}
              onClick={() => openFormHandler("Update", event)}
              left={32 + (eventWidth + 1) * i}
              top={getTopPosition(event)}
            >
              {event.title}
            </EventItemButton>
          ))}
        </ScaleWrapper>
      </EventsListWrapper>
      <EventFormWrapper>
        {selectedEvent ? (
          <div>
            <EventTitle
              value={selectedEvent.title}
              onChange={(e) => changeEventHandler(e.target.value, "title")}
              placeholder="Title"
            />
            <SelectEventTimeWrapper>
              <PositionRelative>
                <DropdownBtn>
                  {moment.unix(+selectedEvent.date).format("dddd, D MMMM")}
                </DropdownBtn>
              </PositionRelative>
              <PositionRelative>
                <DropdownBtn
                  onClick={() => setShowTimePicker((prevState) => !prevState)}
                >
                  {moment.unix(+selectedEvent.date).format("HH:mm")}
                </DropdownBtn>
                {showTimePicker ? (
                  <ListOfHours>
                    {[...new Array(ITEMS_PER_DAY)].map((_, i) => (
                      <li>
                        <HoursButton onClick={() => setTimeForEvent(i)}>
                          {`${i}`.padStart(2, "0")}:00
                        </HoursButton>
                      </li>
                    ))}
                  </ListOfHours>
                ) : null}
              </PositionRelative>
            </SelectEventTimeWrapper>
            <SelectEventTimeWrapper>
              <PositionRelative>
                <DropdownBtn
                  onClick={() =>
                    setShowDurationPicker((prevState) => !prevState)
                  }
                >
                  {`${selectedEvent.duration}`.padStart(2, "0")}:00
                </DropdownBtn>
                {showDurationPicker ? (
                  <ListOfHours>
                    {[...new Array(ITEMS_PER_DAY)].map((_, i) => (
                      <li>
                        <HoursButton onClick={() => setDurationForEvent(i + 1)}>
                          {`${i + 1}`.padStart(2, "0")}:00
                        </HoursButton>
                      </li>
                    ))}
                  </ListOfHours>
                ) : null}
              </PositionRelative>
            </SelectEventTimeWrapper>
            <EventBody
              value={selectedEvent.description}
              onChange={(e) =>
                changeEventHandler(e.target.value, "description")
              }
              placeholder="Description"
            />
            <ButtonsWrapper>
              <ButtonWrapper onClick={cancelButtonHandler}>
                <span>Cancel</span>
              </ButtonWrapper>
              <ButtonWrapper onClick={eventFetchHandler}>
                {method}
              </ButtonWrapper>
              {method === "Update" ? (
                <ButtonWrapper danger onClick={removeEventHandler}>
                  <span>Remove</span>
                </ButtonWrapper>
              ) : null}
            </ButtonsWrapper>
          </div>
        ) : (
          <>
            <CreateEventWrapperDiv>
              <DropdownBtn
                onClick={() => openFormHandler("Create", null, today)}
              >
                <span>Add new event</span>
              </DropdownBtn>
            </CreateEventWrapperDiv>
            <NoEventMsg>
              <span>No event selected</span>
            </NoEventMsg>
          </>
        )}
      </EventFormWrapper>
    </DayShowWrapper>
  );
};
