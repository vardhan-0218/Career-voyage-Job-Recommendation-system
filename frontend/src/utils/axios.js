import axios from "axios";

// Dynamically set backend URL
const serverUrlOnline = "https://career-voyage-job-recommendation-system.onrender.com";
const serverUrlOffline = "http://localhost:3000";

const BASE_URL = window.location.hostname.includes("localhost") ? serverUrlOffline : serverUrlOnline;

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // important to send cookies/auth tokens
});

export default API;
