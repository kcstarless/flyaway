import { createContext, useState, useEffect, useContext } from 'react';
import { API_TOKEN_URL } from '../../constants';
import axios from 'axios';
const UserSessionContext = createContext();

export const UserSessionProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'));
    const [resourceOwner, setResourceOwner] = useState(() => JSON.parse(localStorage.getItem('resource_owner')));
    const [inSession, setInSession] = useState(false);

    // Set localstorage for refreshToken and resourceOwner whenever they change. 
    useEffect(() => {
        if(refreshToken) {
            console.log("refresh token set");
            localStorage.setItem('refresh_token', refreshToken);
        } else {
            console.log("refresh token removed");
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
                    console.log(`previous refresh token is: `, refreshToken);
                    const data = response.data;
                    console.log(`new refresh token is: `, data.refresh_token);
        
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

    // Make signin devise api call
    const makecallSignin = async (email, password) => {
        try {
            const response = await axios.post(`${API_TOKEN_URL}/sign_in`, {
                email: email,
                password: password,
            });

            const data = await response.data;

            if (data) {
                setAccessToken(data.token);
                setResourceOwner(data.resource_owner);
                setRefreshToken(data.refresh_token);
                // checkSession();
            } else {
                handleSignout();
            }
        } catch (error) {
            console.error('Error signing user: ', error.response.data);
            handleSignout();
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
    }

    function resetToken() {

    }

    return (
        <UserSessionContext.Provider value= {{
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
        }}>
            {children}
        </UserSessionContext.Provider>
    )
}

export const useUserSessionContext = () => useContext(UserSessionContext);