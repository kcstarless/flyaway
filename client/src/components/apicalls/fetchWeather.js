const config = {
    unitGroup: 'metric', // or 'imperial'
    apiKey: 'RCFQPET5NKRMVHV5QZ3C67MEG',
    iconGroup: 'icons2'
};

function getApiURL(location) {
    const { iconGroup, apiKey, unitGroup } = config;    
    return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${apiKey}&iconSet=${iconGroup}&unitGroup=${unitGroup}`;
}

async function apiFetch(url) {
    try {
        let response = await fetch(url);

        if (response.ok) {
            // console.log('Weather data fetched successfully', response.json());
            return response.json();
        }
    } catch (error) {
        return error;
    }
}

export async function getWeatherData(location) {
    try {
        const url = getApiURL(location);
        const data = await apiFetch(url);
        if (data && data.currentConditions) {
            return data;
        }
    } catch (error) {
        return error;
    }
}