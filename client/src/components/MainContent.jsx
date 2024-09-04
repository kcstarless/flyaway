// API_URL comes from the .env.development file
import  { API_URL } from '../constants'
import React, { useState, useEffect } from 'react' 

function MainContent() {
    const [users, setUsers] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    // Fetch users from Rails API
    useEffect(() => {
        async function loadUsers() {
            try {
                const response = await fetch(`${API_URL}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
                setLoaded(true);
            } catch (error) {
                setError(error);
            } finally {
                setLoaded(true);
            }
        }
        loadUsers();;
    }, []);

    return (
        <div className="main-content">
        <h1>List of Users</h1>
        {error && <div>Error: {error.message}</div>}
        {!loaded && <div>Loading...</div>}
        {loaded && !error && (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.first_name} {user.last_name}</li>
            ))}
        </ul>
        )}
        </div>
    )   
}

export default MainContent