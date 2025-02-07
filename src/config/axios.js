import axios from "axios";
const baseUrl = "http://14.225.207.163:8080/api/";

const config = {
  baseURL: baseUrl,
};
const api = axios.create(config);

const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
};

api.interceptors.request.use(handleBefore);

export default api;
