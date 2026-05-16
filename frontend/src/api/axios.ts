import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        contentType: "application/json"
    }
});

export default API;