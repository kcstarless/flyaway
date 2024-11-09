import { useToursActivitiesQuery } from "../hooks/useToursActivitiesQuery";
import { useContextLocalization } from "../contexts/ContextLocalization";

import LocalAreaInfo from "./LocalAreaInfo";
import LocalActivities from "./LocalActivities";
import { MdExplore } from "react-icons/md";
import { MdRecommend } from "react-icons/md";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useState, useEffect } from "react";
import Unavailable from "../helpers/Unavailable";

const MainPageHeader = () => {
    const [unavailable, setUnavailable] = useState(false);

    return (
    <>
        <div className="mainpage-header">
            <button className="btn btn--tertiary" onClick={() => setUnavailable(true)}><MdExplore className="icon-mainpage-header" />Explore anywhere</button>
            <button className="btn btn--tertiary" onClick={() => setUnavailable(true)}><MdRecommend className="icon-mainpage-header" />Popular destination</button>
            <button className="btn btn--tertiary" onClick={() => setUnavailable(true)}><FaArrowTrendUp className="icon-mainpage-header" />Travel trends</button>
            {unavailable && <Unavailable setUnavailable={setUnavailable}/>}
        </div>
    </>
    )
}


const Mainpage = () => {
    const { localizationData } = useContextLocalization();
    const toursActivitiesResult= useToursActivitiesQuery(localizationData.geoLocation);
    // useEffect(() => {
    //     toursActivitiesResult.refetch();
    //     console.log("Mainpage localization data:", localizationData);
    // }, [localizationData]);



    return (
        <div className="mainpage">
            <MainPageHeader />
            <LocalAreaInfo />
            {toursActivitiesResult.isPending && <div className="loading">Loading...</div>}
            <LocalActivities toursActivitiesResult={toursActivitiesResult} />
        </div>
    );
}


export default Mainpage;