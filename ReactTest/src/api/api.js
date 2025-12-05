// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  try {
    const res = await api({
      url: endpoint,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : undefined, // <— penting
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...(options.headers || {}),
      },
    });

    return res.data;
  } catch (err) {
     const error = err.response?.data || { message: "Terjadi kesalahan" };
  console.error("API ERROR:", error);
  throw error
}
};

export default api;
