// src/api/pegawai.js
import api from "./api";

/**
 * Read pegawai
 */
export async function getPegawai() {
  const res = await api.get("/pegawai/read");
  return res.data;
}

/**
 * Create pegawai (admin)
 * data: { nama, jabatan, no_hp, alamat }
 */
export async function createPegawai(data) {
  const res = await api.post("/pegawai/create", data);
  return res.data;
}

/**
 * Update pegawai
 * backend expects POST '/pegawai/update' with id_pegawai in body
 */
export async function updatePegawai(data) {
  const res = await api.post("/pegawai/update", data);
  return res.data;
}

/**
 * Delete pegawai
 * Your routes have Route::delete('/pegawai/delete/{id_pegawai}', [PegawaiController::class, 'destroy']);
 * So we call delete with id in path
 */
export async function deletePegawai(id_pegawai) {
  const res = await api.delete(`/pegawai/delete/${id_pegawai}`);
  return res.data;
}
