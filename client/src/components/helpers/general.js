// general.js

// Validates flight search form data and set feedback
// Used in: Searchbar.jsx
export const validateForm = (formData, setFormError) => {
    const { departingIATA, destinationIATA, departDate, passengers } = formData;
    if (!departingIATA || !destinationIATA || !departDate || !passengers) {
      setFormError('Please fill out all required fields.');
      return false;
    }
    if (departingIATA === destinationIATA) {
      setFormError("Origin and destination is same.");
      return false;
    }
    setFormError('');
    return true;
}

// export const getPagedOffers = (sortedOffers, limit = 10) => {
//     return sortedOffers.slice(0, limit);
// };

// Formats date into YYYYMMDD format
// Used in: Searchbar.jsx
export const getDateYYYYMMDD = (date) => {
    return date ? date.toISOString().slice(0, 10) : null;
}

// Capitalizes the first letters of string
// Used in: FilterOptions.jsx
export const capitalizeFirstLetters = (str) => {
    return str
        .toLowerCase() // Convert the entire string to lowercase
        .split(' ')    // Split the string by spaces into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
        .join(' ');    // Join the words back into a single string
}

// Converts minutes to hours HH.H
// Used in: FilterOptions.jsx
export const minutesToHH = (value) => {
    const decimalHours = value / 60;
    const roundedHours = Math.round(decimalHours * 2) / 2;
    return roundedHours.toFixed(1);
}

// Function to format the slider value as "HH:MM" (24hr)
// Used in: FilterOptions.jsx, 
export const minutesToHHMM24 = (value) => {
    const hours = Math.floor(value/60).toString().padStart(2, '0'); // Calculate hours, attached 0 at the front if single digiti
    const mintues = (value % 60).toString().padStart(2, '0');
    return `${hours}:${mintues}`;
}

// Convert time (HH:MM24) to minutes
// Used in: sortFlightOffers.js
export const hhmm24ToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// Converts ISO8601 time format eg "2024-10-07T15:30:00" and returns "15:30"
// Used in: fetchFlights.js
export const isoDateToHHMM24 = (dateTime) => {
    const date = new Date(dateTime);
    const options = { hour: 'numeric', minute: 'numeric', hour12: false };
    return date.toLocaleString('en-US', options);
}
  
// Convert duration property in API json. "PT6H30M" returns array [HH:MM, totalMintues] (eg. [06:30, 390])
// Used in: fetchFlights.js
export function formatDuration(duration) {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/; // 'PT6H30M'
    const matches = duration.match(regex);
    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;

    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; // Format HH:MM
    return [formattedTime, hours * 60 + minutes]; // Total minutes
  }