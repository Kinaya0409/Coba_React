// src/pages/admin/AdminPesananPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Form } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import { formatToAMPM } from "../../utils/time.js";
import TopNavbar from "../../components/TopNavbar.jsx";

const AdminPesananPage = () => {
  const [bookings, setBookings] = useState([]);

  const adminRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
  ];

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await apiFetch("/pemesanan/read");
      setBookings(data || []);
    } catch {
      toast.error("Gagal memuat pesanan");
    }
  };

const updateStatus = async (id, status) => {
  const booking = bookings.find(b => b.id_pemesanan === id);

  try {
    await apiFetch("/pemesanan/update", {
      method: "POST",
      body: JSON.stringify({
        id_pemesanan: id,
        id_layanan: booking.id_layanan,
        id_pegawai: booking.id_pegawai,
        tanggal_booking: booking.tanggal_booking,
        jam_booking: booking.jam_booking,
        status_pemesanan: status,
      }),
    });

    toast.success("Status berhasil diperbarui");
    loadBookings();
  } catch (err) {
    toast.error(err.body?.message || "Gagal update status");
  }
};


  return (
    <>
      <TopNavbar routes={adminRoutes} />
      <Container style={{ paddingTop: "100px" }}>
        <h2>Kelola Pesanan</h2>
        <Table bordered hover>
          <thead className="table-primary">
            <tr>
              <th>No</th>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Tgl. Pesan</th>
              <th>Tgl. Booking</th>
              <th>Jam</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="7" className="text-center">Belum ada data</td></tr>
            ) : (
              bookings.map((b, i) => (
                <tr key={b.id_pemesanan}>
                  <td>{i + 1}</td>
                  <td>{b.pelanggan?.nama}</td>
                  <td>{b.layanan?.nama_layanan}</td>
                  <td>{b.tanggal_pemesanan}</td>
                  <td>{b.tanggal_booking}</td>
                  <td>{formatToAMPM(b.jam_booking)}</td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={b.status_pemesanan}
                      onChange={(e) =>
                        updateStatus(b.id_pemesanan, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="sedang_dilayani">Sedang Dilayani</option>
                      <option value="selesai">Selesai</option>
                      <option value="dibatalkan">Dibatalkan</option>
                    </Form.Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default AdminPesananPage;
