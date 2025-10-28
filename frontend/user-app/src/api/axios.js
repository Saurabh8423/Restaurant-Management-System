import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://restaurant-management-system-backend-8ku8.onrender.com/api",
  withCredentials: true,
});


export default API;
