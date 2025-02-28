/************************************************************
 * client/src/utils/axiosInstance.js
 ************************************************************/
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api", // Ortam değişkeni varsa kullan, yoksa localhost:5000/api kullan
});

// İstek öncesi token ekleme (eğer localStorage'da token varsa)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitness_app_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
