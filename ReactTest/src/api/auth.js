// src/api/auth.js
import api from "./api";

/**
 * Simpan token ke localStorage & pasang ke axios Authorization header
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

/**
 * Admin login
 */
export async function adminLogin({ email, password }) {
  const res = await api.post("/admin/login", { email, password });
  const token = res.data.token;

  setAuthToken(token);
  localStorage.setItem("role", "admin");
  localStorage.setItem("user", JSON.stringify(res.data.data || {}));

  return res.data;
}

/**
 * Admin register
 */
export async function adminRegister({ nama, email, password }) {
  const res = await api.post("/admin/register", { nama, email, password });
  return res.data;
}

/**
 * Pelanggan register
 */
export async function pelangganRegister({ nama, email, password, no_hp, alamat }) {
  const res = await api.post("/pelanggan/register", { nama, email, password, no_hp, alamat });
  return res.data;
}

/**
 * Pelanggan login
 */
export async function pelangganLogin({ email, password }) {
  const res = await api.post("/pelanggan/login", { email, password });
  const token = res.data.token;

  setAuthToken(token);
  localStorage.setItem("role", "pelanggan");
  localStorage.setItem("user", JSON.stringify(res.data.data || {}));

  return res.data;
}

/**
 * Logout
 */
export function logout() {
  setAuthToken(null);
  localStorage.removeItem("role");
  localStorage.removeItem("user");
}
