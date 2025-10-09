import axios from "axios";

// ----------------------
// 1️⃣ Dynamically set backend URL
// ----------------------
const serverUrlOnline = "https://career-voyage-job-recommendation-system.onrender.com";
const serverUrlOffline = "http://localhost:3000";

const BASE_URL = window.location.hostname.includes("localhost") ? serverUrlOffline : serverUrlOnline;

// ----------------------
// 2️⃣ Create Axios instance
// ----------------------
export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies/auth tokens
});

// ----------------------
// 3️⃣ Define API endpoints
// ----------------------
export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
