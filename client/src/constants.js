// Contains Rails API_URL for development and production or else it will use the Heroku API_URL
export const API_URL = 
    process.env.NODE_ENV === 'test' 
        ? 'https://flyaway-api.herokuapp.com'
        : import.meta.env.VITE_API_URL 

export const API_TOKEN_URL =
    process.env.NODE_ENV === 'test'
    ? 'https://flyaway-api.herokuapp.com'
    : import.meta.env.VITE_API_TOKEN_URL 