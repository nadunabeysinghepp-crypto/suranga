// import axios from "axios";

// const adminHttp = axios.create({
//   baseURL: "http://localhost:5000",
// });

// adminHttp.interceptors.request.use((config) => {
//   const token = localStorage.getItem("sp_admin_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default adminHttp;
// frontend/src/api/adminHttp.js
import axios from "axios";

const adminHttp = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ use env
  withCredentials: false,
});

adminHttp.interceptors.request.use((config) => {
  const token = localStorage.getItem("sp_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminHttp;
