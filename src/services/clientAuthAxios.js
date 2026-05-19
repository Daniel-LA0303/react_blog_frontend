import axios from "axios";

const clientAuthAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL_BACKEND,
  timeout: 10000,
});


clientAuthAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenAuthUser"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default clientAuthAxios;