import React from "react";
import styled from "styled-components";
import moment from "moment";
import {
  ButtonsWrapper,
  ButtonWrapper,
  EventBody,
  EventItemWrapper,
  EventListItemWrapper,
  EventListWrapper,
  EventTitle,
} from "../../containers/StyledComponents";

import { isDayContainCurrentEvent } from "../../helpers";
import { ITEMS_PER_DAY } from "../../helpers/constants";

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
  min-width: 50px;
  width: unset;
  margin-left: 4px;
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

export const DayShowComponent = ({
  events,
  today,
  setEvent,
  selectedEvent,
  setDisplayMode,
  changeEventHandler,
  cancelButtonHandler,
  eventFetchHandler,
  removeEventHandler,
  method,
  openFormHandler,
}) => {
  const eventList = events.filter((event) =>
    isDayContainCurrentEvent(event, today)
  );

  const cells = [...new Array(ITEMS_PER_DAY)].map((_, i) => {
    const temp = [];
    eventList.forEach((event) => {
      // event.date -> '1661295600' -> moment -> timestamp -> H  ? -> 0
      if (+moment.unix(+event.date).format("H") === i) {
        temp.push(event);
      }
    });
    return temp;
  });

  return (
    <DayShowWrapper>
      <EventsListWrapper>
        {/* <EventListWrapper>
          {eventList.map((event) => (
            <EventListItemWrapper key={event.id}>
              <EventItemWrapper
                onClick={() => openFormHandler("Update", event)}
              >
                {event.title}
              </EventItemWrapper>
            </EventListItemWrapper>
          ))}
        </EventListWrapper> */}
        <ScaleWrapper>
          {cells.map((eventsList, i) => (
            <ScaleCellWrapper>
              <ScaleCellTimeWrapper>
                {i ? <>{`${i}`.padStart(2, "0")}:00</> : null}
              </ScaleCellTimeWrapper>

              <ScaleCellEventWrapper>
                {eventsList.map((event) => (
                  <EventItemButton
                    onClick={() => openFormHandler("Update", event)}
                  >
                    {event.title}
                  </EventItemButton>
                ))}
              </ScaleCellEventWrapper>
            </ScaleCellWrapper>
          ))}
        </ScaleWrapper>
      </EventsListWrapper>
      <EventFormWrapper>
        {selectedEvent ? (
          <>
            <EventTitle
              value={selectedEvent.title}
              onChange={(e) => changeEventHandler(e.target.value, "title")}
              placeholder="Title"
            />
            <EventBody
              value={selectedEvent.description}
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
          </>
        ) : (
          <>
            <div>
              <button onClick={() => openFormHandler("Create", null, today)}>
                Create new event
              </button>
            </div>
            <NoEventMsg>No event selected</NoEventMsg>
          </>
        )}
      </EventFormWrapper>
    </DayShowWrapper>
  );
};
