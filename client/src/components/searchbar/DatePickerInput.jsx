import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerInput = ({ label, selectedDate, onChange, error }) => (
  <div className={!error ? 'search-item' : "search-item error"}>
    <label>{label}</label><br />
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      placeholderText='Add Date'
    />
  </div>
);

export default DatePickerInput;
