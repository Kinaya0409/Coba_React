// src/pages/admin/AdminPegawaiPage.jsx
import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "sonner";
import { apiFetch } from "../../api/api.js";
import TopNavbar from "../../components/TopNavbar"; // 🔥 TAMBAHKAN INI

const AdminPegawaiPage = () => {
  const [pegawai, setPegawai] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    no_hp: "",
    alamat: "",
  });

  // 🔥 List menu untuk navbar (SAMA kayak halaman layanan)
  const adminRoutes = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Layanan", path: "/admin/layanan" },
    { name: "Pegawai", path: "/admin/pegawai" },
    { name: "Pesanan", path: "/admin/pesanan" },
  ];

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    try {
      const data = await apiFetch("/pegawai/read");
      setPegawai(data || []);
    } catch {
      toast.error("Gagal mengambil pegawai");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama) return toast.error("Nama wajib diisi!");

    try {
      if (editing) {
        await apiFetch("/pegawai/update", {
          method: "POST",
          body: JSON.stringify({ id_pegawai: editing, ...form }),
        });
        toast.success("Data pegawai diperbarui");
      } else {
        await apiFetch("/pegawai/create", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Pegawai berhasil ditambahkan");
      }
      setShowModal(false);
      setEditing(null);
      fetchPegawai();
    } catch {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin menghapus pegawai?")) return;

    try {
      await apiFetch(`/pegawai/delete/${id}`, { method: "DELETE" });
      toast.success("Pegawai dihapus");
      fetchPegawai();
    } catch {
      toast.error("Gagal hapus pegawai");
    }
  };

  return (
    <>
      {/* 🔥 Navbar ditambahkan di sini */}
      <TopNavbar routes={adminRoutes} />

      <Container style={{ paddingTop: "100px" }}>
        <h2>Kelola Pegawai</h2>

        <Button
          className="my-3"
          onClick={() => {
            setEditing(null);
            setForm({ nama: "", jabatan: "", no_hp: "", alamat: "" });
            setShowModal(true);
          }}
        >
          Tambah Pegawai
        </Button>

        <Table bordered hover>
          <thead className="table-primary">
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>No HP</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {pegawai?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Belum ada pegawai
                </td>
              </tr>
            ) : (
              pegawai.map((p, i) => (
                <tr key={p.id_pegawai}>
                  <td>{i + 1}</td>
                  <td>{p.nama}</td>
                  <td>{p.jabatan}</td>
                  <td>{p.no_hp}</td>
                  <td>{p.alamat}</td>
                  <td>
                    <Button
                      size="sm"
                      className="me-2"
                      variant="warning"
                      onClick={() => {
                        setEditing(p.id_pegawai);
                        setForm(p);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(p.id_pegawai)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* MODAL TAMBAH/EDIT */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Edit Pegawai" : "Tambah Pegawai"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              {["nama", "jabatan", "no_hp", "alamat"].map((field) => (
                <Form.Group key={field} className="mb-2">
                  <Form.Label>{field.toUpperCase()}</Form.Label>
                  <Form.Control
                    name={field}
                    value={form[field] || ""}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                </Form.Group>
              ))}
              <Button type="submit" className="w-100">
                Simpan
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default AdminPegawaiPage;
