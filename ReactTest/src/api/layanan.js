// src/api/layanan.js
import api from "./api";

/**
 * Get all layanan
 */
export async function getLayanan() {
  const res = await api.get("/layanan/read");
  return res.data;
}

/**
 * Create layanan (admin only)
 * data: { nama_layanan, deskripsi, harga }
 */
export async function createLayanan(data) {
  const res = await api.post("/layanan/create", data);
  return res.data;
}

/**
 * Update layanan
 * data should include id_layanan and fields to update
 */
export async function updateLayanan(data) {
  const res = await api.post("/layanan/update", data);
  return res.data;
}

/**
 * Delete layanan
 * send { id_layanan } as request body in DELETE or query param depending backend:
 * Your route used Route::delete('/layanan/delete', [LayananController::class, 'destroy'])
 * So we send { id_layanan } in request body using axios.delete(url, { data: {...} })
 */
export async function deleteLayanan(id_layanan) {
  const res = await api.delete("/layanan/delete", { data: { id_layanan } });
  return res.data;
}
