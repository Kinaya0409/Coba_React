import React, { useEffect, useEffectEvent, useState } from "react";
import { Container, Form, FloatingLabel, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";

const AdminPembayaranPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pembayaranId = location.state?.pembayaranId || null;

  const [pembayaran, setPembayaran] = useState(null);
  const [form, setForm] = useState({status_pembayaran: "",});

  useEffect(() => {
    const loadPembayaran = async () => {
        if(!pembayaranId) return;

        try{
            const data = await apiFetch(`/admin/pembayaran/${pembayaranId}`);

            setPembayaran(data);
            setForm({status_pembayaran: data.status_pembayaran});
        } catch{
            toast.error("Gagal memuat data pembayaran.");
        }
    };

    loadPembayaran();
  }, [pembayaranId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!form.status_pembayaran){
        return toast.error("Pilih status pembayaran.");
    }

    try{
        await apiFetch(`/admin/pembayaran/${pembayaranId}/update-status`, {
            method: "PUT",
            body: JSON.stringify({
                status_pembayaran: form.status_pembayaran,
            }),
        });

        toast.success("Status pembayaran berhasil diperbarui.");
        navigate("/admin/pembayaran");
    } catch(err){
        console.error(err);
        toast.error(err.message || "Gagal memperbarui status.");
    }
  };

  return(
    <Container className="mt-3">
        <h2>Update Status Pembayaran</h2>

        <Card className="p-3 mb-3">
            <h5>Detail Pembayaran</h5>
            <div>ID Pembayaran: <strong>{pembayaran.id_pembayaran}</strong></div>
            <div>ID Pemesanan: <strong>{pembayaran.id_pesanan}</strong></div>
            <div>Layanan: <strong>{pembayaran.pemesanan?.layanan?.nama_layanan}</strong></div>
            <div>Tanggal Booking: <strong>{pembayaran.pemesanan?.tanggal_booking}</strong></div>
            <div>Jam Booking: <strong>{pembayaran.pemesanan?.jam_booking}</strong></div>
            <div className="mt-2"><strong>Total Bayar: Rp {pembayaran.pemesanan?.layanan?.harga}</strong></div>

            <div className="mt-2">
                Status Pembayaran saat ini:
                <strong>{pembayaran.status_pembayaran}</strong>
            </div>
        </Card>

        <Form onSubmit={handleSubmit}>
            <FloatingLabel label="Status Pembayaran" className="mb-3">
                <Form.Select name="status_pembayaran" value={form.status_pembayaran} onChange={handleChange}>
                    <option value="pending">Menunggu</option>
                    <option value="paid">Lunas</option>
                </Form.Select>
            </FloatingLabel>

            <Button type="submit" className="mt-2">
                Update Status
            </Button>
        </Form>
    </Container>
  )
};

export default AdminPembayaranPage;