import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: Number(process.env.TIMEOUT) || 600000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
