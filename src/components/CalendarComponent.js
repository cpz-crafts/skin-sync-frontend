import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = ({ onDateChoice }) => {
  const [chosenDate, setChosenDate] = useState(new Date());

  const handleDateChange = (date) => {
    setChosenDate(date);
    onDateChoice(date);
    console.log('chosenDate:', chosenDate);
  };

  return (
    <StyledDiv>
      <StyledH1>Products</StyledH1>
      <Calendar onChange={handleDateChange} value={chosenDate} />
    </StyledDiv>
  )
}

export default CalendarComponent;

