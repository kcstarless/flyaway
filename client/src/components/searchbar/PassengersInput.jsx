import React from 'react';

const PassengersInput = ({ passengers, onChange }) => (
  <div className="search-item">
    <label>Passengers</label>
    <input
      type="number"
      min="1"
      max="9"
      value={passengers}
      onChange={onChange}
    />
  </div>
);

export default PassengersInput;
