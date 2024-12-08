import { createContext, useState, useEffect, useContext } from 'react';
import { upcomingFlights } from '../apicalls/fetchUpcomingFlights';
import { API_TOKEN_URL } from '../../constants';
import { setSessionstorageItem, getSessionstorageItem } from '../helpers/localstorage';
import axios from 'axios';
import { set } from 'date-fns';
const ContextUserSession = createContext();

export const ProviderContextUserSession = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'));
    const [resourceOwner, setResourceOwner] = useState(() => JSON.parse(localStorage.getItem('resource_owner')));
    const [inSession, setInSession] = useState(false); 
    const [upcoming, setUpcoming] = useState(getSessionstorageItem("users_upcoming_flight") || []);
    const [errorMessage, setErrorMessage] = useState(null);
    // Set localstorage for refreshToken and resourceOwner whenever they change. 
    useEffect(() => {
        if(refreshToken) {
            // console.log("refresh token set");
            localStorage.setItem('refresh_token', refreshToken);
        } else {
            // console.log("refresh token removed");
            localStorage.removeItem('refresh_token');
        }

        if(resourceOwner) {
            localStorage.setItem('resourceOwner', JSON.stringify(resourceOwner));
        } else {
            localStorage.removeItem('resourceOwner');
        }

        // setInSession(!!accessToken || !!refreshToken);
    }, [refreshToken, resourceOwner]);
    
    // Fetch accessToken if expired or page is refreshed using refreshToken
    useEffect(() => {
        if (!accessToken) {
            const refreshAccessToken = async () => {
                if (!refreshToken) return; // if fasly return

                try {
                    const response = await axios.post(`${API_TOKEN_URL}/refresh`, null, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    });
                    // console.log(`previous refresh token is: `, refreshToken);
                    // console.log(`new refresh token is: `, data.refresh_token);
                    const data = response.data;
        
                    if(data && data.token) {
                        setAccessToken(data.token);
                        setResourceOwner(data.resource_owner);
                        setRefreshToken(data.refresh_token);
                        // checkSession();
                    }
                } catch (error) {
                    console.error("Error refreshing access token: ", error.response.data);
                    handleSignout();
                }
            }  

            refreshAccessToken(); // Call to refresh token if there is no access token.
        }
    }, [accessToken, refreshToken]);

    // Sets in inSession. This does not work when if resetToken() is called.
    useEffect(() => {
        (accessToken && refreshToken && resourceOwner) ? setInSession(true) : setInSession(false);
    }, [accessToken, refreshToken, resourceOwner]);

    // If in session. Check is there is any upcoming flight
    useEffect(() => {
        const getUserFlights = async () => {
            if(!inSession && !accessToken) return
            try {
                const response = await upcomingFlights(accessToken);
                if (response) {
                    setUpcoming(response.data);
                    setSessionstorageItem("users_upcoming_flight", response.data);
                }
    
            } catch(error) {
                console.error("Error fetching user's flight booking data: ", error)
            }
        }
        getUserFlights();
    }, [accessToken, inSession, upcoming])

    // Make signin devise api call
    const makecallSignin = async (email, password) => {
        try {
            const response = await axios.post(`${API_TOKEN_URL}/sign_in`, {
                email: email,
                password: password,
            });

            const data = await response.data;
            console.log(data);

            if (data) {
                setAccessToken(data.token);
                setResourceOwner(data.resource_owner);
                setRefreshToken(data.refresh_token);
                setErrorMessage(null);
                // checkSession();
            } else {
                handleSignout();
            }
        } catch (error) {
            console.error('Error signing user: ', error.response.data.error);
            const message = error.response.data.error;
            if (message === 'invalid_email') {
                setErrorMessage("Invalid email");
            }

            if (message === 'invalid_authentication') {
                setErrorMessage("Invalid password");
            }
        }
    }

    // Make signup devise api call
    const makecallSignup = async (email, password) => {
        try {
            const response = await axios.post(`${API_TOKEN_URL}/sign_up`, {
                email: email,
                password: password,
            });
            
            const data = await response.data;

            if (data) {
                setAccessToken(data.token);
                setResourceOwner(data.resource_owner);
                setRefreshToken(data.refresh_token);
                // checkSession();
            }
        } catch (error) {
            console.error('Error creating user:', error.response.data);
            handleSignout();
        }
    }

    // Signout user 
    function handleSignout() {
        setAccessToken(null);
        setRefreshToken(null);
        setResourceOwner(null);
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('resource_owner');
        setInSession(false);

        alert("You have been signed out.");
    }

    // function resetToken() {

    // }

    return (
        <ContextUserSession.Provider value= {{
            accessToken,
            setAccessToken,
            refreshToken,
            setRefreshToken,
            resourceOwner,
            setResourceOwner,
            makecallSignup,
            makecallSignin,
            handleSignout,
            inSession,
            upcoming,
            errorMessage,
        }}>
            {children}
        </ContextUserSession.Provider>
    )
}

export const useContextUserSession = () => useContext(ContextUserSession);