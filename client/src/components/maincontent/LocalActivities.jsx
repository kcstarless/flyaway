import { randomizeActivities, limitDescriptionLength } from '../helpers/general';
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { useState, useEffect } from 'react';
import { FaExternalLinkAlt } from "react-icons/fa";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import  Unavailable from '../helpers/Unavailable';

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

const LocalActivities = ({ toursActivitiesResult, sideAds}) => {
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
            {sideAds && <CarouselActivities removeFeaturedActivity={removeFeaturedActivity} />}

            {!sideAds && 
                <>
                    <FeaturedActivity featuredActivity={featuredActivity} />
                    <Activities pagedActivities={pagedActivities} /> 
                    {visibleCount < randomActivities.length && (
                        <button onClick={() => setVisibleCount((prevCount) => prevCount + 8)} className="btn btn--primary">Show More</button>
                    )}
                </>
            }       
        </> 
    );
};

const FeaturedActivity = ({ featuredActivity }) => {
    return (
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
    )
}

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
            {unavailable && <Unavailable />}
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
            {unavailable && <Unavailable />}
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
            {unavailable && <Unavailable />}
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

const CarouselActivities = ({ removeFeaturedActivity }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const { formData } = useContextFlightOffers();

    const carouselItems = [
        {
            name: "Need a place to stay?",
            description: "Find the best hotels in your local area.",
            color: "one"
        },
        {
            name: "Need a ride?",
            description: "Find the best car rentals in your local area.",
            color: "two"
        },
        {
            name: "Feeling hungry?",
            description: "Find the best restaurants in your local area.",
            color: "three"
        },
    ];

    function openSelectedActivity(activity) {
        setExpanded(!expanded);
        setSelectedActivity(activity);
    }

    return (
        <>
            <div className="side-ads-card">
                <h5>Explore {formData.current.destinationCityName} </h5>
                <br />
                <p>Discover and book unique experiences hosted by local experts.</p>
            </div>
            <Carousel 
                autoPlay
                interval={5000}
                key={carouselItems.length}
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                showIndicators={false}>
                {carouselItems.map((item, index) => (
                    <div key={index} className={`side-ads-card ${item.color}`}>
                        <h5>{item.name}</h5>
                        <br />
                        <p>{item.description}</p>
                    </div>
                ))}
            </Carousel>
            <Carousel
                autoPlay
                interval={3000}
                key={removeFeaturedActivity.length}
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                showIndicators={false}>
                {removeFeaturedActivity.map((activity, index) => (
                    <>
                    <div key={activity.id} className="mainpage-local-activities">
                        <div key={activity.id} className="activity" onClick={() => openSelectedActivity(activity)} style={{ backgroundImage: `url(${activity.pictures})` }}>
                            <div key={activity.id} className="activity-overlay"> 
                                <div key={activity.id} className="activity-inner">
                                    <div key={activity.name} className="activity-title">{activity.name}</div>
                                    <div key={activity.description} className="activity-desc">{limitDescriptionLength(activity.description)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                ))}
            </Carousel>
            {expanded && <div className="mainpage-local-activities">{dialogOpen(selectedActivity, setExpanded, expanded)}</div>}
            {expanded && <div className="dialog-backdrop" onClick={() => setExpanded(!expanded)}></div>}
        </>
    )
}

export default LocalActivities;