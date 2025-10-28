import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE_URL || "https://restaurant-management-system-backend-8ku8.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE,
});

export default API;
