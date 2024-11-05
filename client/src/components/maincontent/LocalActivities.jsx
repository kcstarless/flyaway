import { randomizeActivities, limitDescriptionLength } from '../helpers/general';
import { useState, useEffect } from 'react';
import { FaExternalLinkAlt } from "react-icons/fa";
import  NoLink from '../helpers/Unavailable';

const LocalActivities = ({ toursActivitiesResult}) => {
    const { data: activities } = toursActivitiesResult;
    const [visibleCount, setVisibleCount] = useState(20);
    const [randomActivities, setRandomActivities] = useState([]);

    useEffect(() => {
        if (activities) {
            setRandomActivities(randomizeActivities(activities));
        }
    }, [activities]);

    if (!activities) {
        return null;
    }

    const featuredActivity = randomActivities[Math.floor(Math.random() * randomActivities.length)];
    const removeFeaturedActivity = randomActivities.filter(activity => activity.id !== featuredActivity.id);
    const pagedActivities = removeFeaturedActivity.slice(0, visibleCount);

    return (
        <>
        <div className="featured-activity">
            {featuredActivity && (
                <div>
                <img src={featuredActivity.pictures} alt={featuredActivity.name} className="activity-image" />
                <div className="activity-title">
                    <a href={`https://www.google.com/search?q=${featuredActivity.name}`}
                            target="_blank"
                            className="activity-expanded-title"
                    >{featuredActivity.name}<FaExternalLinkAlt style={{float: "right"}}/></a>
                </div>
                <div className="activity-desc">{limitDescriptionLength(featuredActivity.description, 400)}</div>
                </div>
            )}
        </div>
        <Activities pagedActivities={pagedActivities} /> 
        {visibleCount < randomActivities.length && (
            <button onClick={() => setVisibleCount((prevCount) => prevCount + 8)} className="btn btn--primary">Show More</button>
        )}       
        </> 
    );
};


const Activities = ({ pagedActivities }) => {
    return (
        <div className="mainpage-local-activities">
            { pagedActivities.map((activity, index) => {
                return <Activity activity={activity} index={index} key={activity.id} />
                })
            }
        </div>
    );
};

function dialogOpen(activity, setExpanded, expanded) {
    return (
    <dialog className="activity-expanded" open>
        <img src={activity.pictures} alt={activity.name} className="activity-expanded-image" />
        <a href={`https://www.google.com/search?q=${activity.name}`}
            target="_blank"
            className="activity-expanded-title"
        >{activity.name}<FaExternalLinkAlt style={{float: "right"}}/></a>
        <div className="activity-expanded-desc">{activity.description}</div>
        <button className="btn btn--primary" onClick={() => setExpanded(!expanded)}>Close</button>
    </dialog>
    );
}

const Activity = ({ activity, index }) => {
    const [expanded, setExpanded] = useState(false);
    const [unavailable, setUnavailable] = useState(false);

    if (index === 0) { 
        return(
        <div key={`${activity.id}-header`} className="activity-header">
            <h1>Activities...</h1>
            <br />
            <h3>Find out what's going on in your local area.</h3>
            <br />
            <div>Discover and book unique experiences hosted by local experts.</div>
        </div>
        )
    } else if (index === 7 || (index > 20 && index % 14 === 0)) {
        return(
        <div key={`${activity.id}-hotel`} className="activity-hotel" onClick={() => setUnavailable(!unavailable)}>
            <h1>Need a place to stay?</h1>
            <br />
            <h3>Find the best hotels in your local area.</h3>
            <br />
            <div>Book now and save on your next stay.</div>
            {unavailable && <NoLink />}
        </div>
        )
    } else if (index === 9 || (index > 30 && index % 15 === 0)) {
        return(
        <div key={`${activity.id}-restaurant`} className="activity-restaurant" onClick={() => setUnavailable(!unavailable)}>
            <h1>Feeling hungry?</h1>
            <br />
            <h3>Find the best restaurants in your local area.</h3>
            <br />
            <div>Book now and enjoy a great meal.</div>
            {unavailable && <NoLink />}
        </div>
        )
    } else if (index === 15 || (index > 40 && index % 17 === 0)) {
        return(
        <div key={`${activity.id}-car`} className="activity-car" onClick={() => setUnavailable(!unavailable)}>
            <h1>Need a ride?</h1>
            <br />
            <h3>Find the best car rentals in your local area.</h3>
            <br />
            <div>Book now, save, and enjoy your next ride.</div>
            {unavailable && <NoLink />}
        </div>
        )
    } else {
        return (
            <>
            {expanded && <div className="dialog-backdrop" onClick={() => setExpanded(!expanded)}></div>}
            <div key={activity.id} className={expanded ? "activity expanded" : "activity"} onClick={() => setExpanded(!expanded)} style={{ backgroundImage: `url(${activity.pictures})` }}>     
                <div className="activity-overlay">   
                    <div className="activity-inner">
                    {/* <img src={activity.pictures} alt={activity.name} className="activity-image" /> */}
                    <div className="activity-title">{activity.name}</div>
                    <div className="activity-desc">{limitDescriptionLength(activity.description)}</div>
                    </div>
                </div>
            </div>
            {expanded && (dialogOpen(activity, setExpanded, expanded))}
            </>
        );
    }
};

export default LocalActivities;