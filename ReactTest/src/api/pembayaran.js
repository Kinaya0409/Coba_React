// src/api/pembayaran.js
import api from "./api";

/**
 * Read pembayaran
 */
export async function getPembayaran() {
  const res = await api.get("/pembayaran/read");
  return res.data;
}

/**
 * Create pembayaran (admin)
 * data: { id_pemesanan, metode_pembayaran }
 */
export async function createPembayaran(data) {
  const res = await api.post("/pembayaran/create", data);
  return res.data;
}
