import { useContextLocalization } from "../contexts/ContextLocalization";
import { useQuery } from "@tanstack/react-query";
import { getWeatherData } from "../apicalls/fetchWeather";

const LocalAreaInfo = () => {
    const { localizationData } = useContextLocalization();

    const weatherData = useQuery({
        queryKey: ["weather", localizationData.cityName],
        queryFn: async ({ queryKey }) => {
            const [, location] = queryKey;
            const response = await getWeatherData(location);
            return response;
        },
        enabled: !!localizationData.cityName,
    });

    const temperature = weatherData?.data?.currentConditions?.temp;
    const condition = weatherData?.data?.currentConditions?.icon;
    const ICON_BASE_URL = 'https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/';
    const iconURL = `${ICON_BASE_URL}${condition}.png`;
    return (
        
        <div className="mainpage-local-info">
            {weatherData.isLoading && <div>Loading...</div>}
            {weatherData.isSuccess &&
            <>
                <div className="item">{localizationData.cityName}</div>
                <div className="item">{localizationData.country} </div>
                <div className="item">{localizationData.localTime}</div>
                <div className="item">{temperature} °C</div>
                <div className="item-image"><img src={iconURL} />{condition}</div>
            </>}
        </div>
    );
}

export default LocalAreaInfo;