import api from "./api";

export const createPemesanan = async (data) => {
  const res = await api.post("/pemesanan/create", data);
  return res.data;
};

export const getPemesanan = async () => {
  const res = await api.get("/pemesanan/read");
  return res.data;
};

export const updatePemesanan = async (data) => {
  const res = await api.post("/pemesanan/update", data);
  return res.data;
};

export const deletePemesanan = async (id_pemesanan) => {
  const res = await api.delete("/pemesanan/delete", { data: { id_pemesanan } });
  return res.data;
};
