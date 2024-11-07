// components/helpers/general.js

// Delay function
export function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Limit length of description
export function limitDescriptionLength(description, length = 100) {
    if (description.length > length) {
        return description.slice(0, length) + "...";
    } else {
        return description;
    }
}

// Randomize activities
export function randomizeActivities(activities) {
    if (!activities) {
        return null;
    }
    const shuffledActivities = shuffleArray(activities);
    const randomActivities = shuffledActivities
        .filter(activity => activity.pictures && activity.description)
        .slice(0, activities.length);
    return randomActivities;
}



// Valid currencies for flight price history.
// Used in: fetchFlightPriceHistory.js, FlightPriceHistory.jsx.
export const validCurrency = [
    'CAD', 'HKD', 'ISK', 'PHP', 'DKK', 'HUF', 'CZK', 'AUD', 'RON', 
    'SEK', 'IDR', 'INR', 'BRL', 'RUB', 'HRK', 'JPY', 'THB', 'CHF', 
    'SGD', 'PLN', 'BGN', 'TRY', 'CNY', 'NOK', 'NZD', 'ZAR', 
    'USD', 'MXN', 'ILS', 'GBP', 'KRW', 'MYR', 'EUR'
];


// Format number into currency. Eg. 1230 -> 1,230
// Used in: Tripheader.jsx
export const numberCommas = (number) => {
    const integerNumber = Math.floor(number); // or use any of the above methods
    return integerNumber.toLocaleString();
}

// Calculate layover time eg. "2024-10-16T15:15:00" and "2024-10-17T19:10:00"
// Used in: FlightDetails.jsx
export const getLayoverTime = (timeDate1, timeDate2) => {
    const date1 = new Date(timeDate1);
    const date2 = new Date(timeDate2);

    const diffInMilliseconds = date2 - date1; // Difference in milliseconds
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // Convert to hours

    return parseFloat(diffInHours.toFixed(2));
}


// Long day format eg. Wendesday, 16 Oct 2024
// Used in: FlightDetails.jsx
export const getDateDayDDMMYYYY = (dateString) => {
    const date = new Date(dateString);

    // Options for formatting the date
    const options = {
        weekday: 'long', // e.g., "Wednesday"
        year: 'numeric', // e.g., "2024"
        month: 'short', // e.g., "Oct"
        day: '2-digit' // e.g., "16"
    };

    // Convert to desired format
    return date.toLocaleDateString('en-US', options);
}


// Validates flight search form data and set feedback
// Used in: Searchbar.jsx
export const validateForm = (input, setFormError) => {
    const { departingIATA, destinationIATA, departDate, passengers } = input;
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

// Caplializes the first letter of string only (eg "Axxx xxx")
// Used in: FlightDetailsExpanded
export const capitalizeFirstLetterOnly = (str) => {
    if (str.length === 0) return str; // Handle empty string case
    // Capitalize the first character and convert the rest to lowercase
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Converts minutes to hours HH.H rounded
// Used in: FilterOptions.jsx
export const minutesToHH = (value) => {
    const decimalHours = value / 60;
    const roundedHours = Math.round(decimalHours * 2) / 2;
    return roundedHours.toFixed(1);
}

// Convert mintues to hours in decimal form
export const minutesToHHDecimal = (value) => {
    const decimalHours = value / 60;
    return decimalHours.toFixed(1);
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