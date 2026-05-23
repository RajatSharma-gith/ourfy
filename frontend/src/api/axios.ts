import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ourfy.onrender.com/api',
    headers: {
        "Content-Type": "application/json"
    }


});

console.log('ENV:', import.meta.env);
console.log('URL:', import.meta.env.VITE_API_URL);
export default API;