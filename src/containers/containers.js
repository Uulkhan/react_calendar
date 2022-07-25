import styled from "styled-components";


export const CellWrapperDiv = styled.div`
  min-height: ${(props) => (props.isHeader ? 24 : 80)}px;
  min-width: 140px;
  background-color: ${(props) => (props.isWeekday ? "#27282A" : "#1E1F21")};
  color: ${(props) => (props.isSelectedMonth ? "#DDDDDD" : "#555759")};
`;

export const RowInCellDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "flex-start"};
  ${(props) => props.pr && `padding-right: ${props.pr * 8}px`}
`;
