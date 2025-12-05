// src/pages/admin/AdminJadwalPage.jsx
import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "sonner";
import api from "../../api/api.js";

const AdminJadwalPage = () => {
  const [stylists, setStylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nama: "",
    jabatan: "",
    no_hp: "",
    alamat: "",
  });

  useEffect(() => {
    fetchStylists();
  }, []);

  const fetchStylists = async () => {
    try {
      const data = await apiFetch("/pegawai/read");
      setStylists(data || []);
    } catch (err) {
      toast.error("Gagal ambil pegawai");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ nama: "", jabatan: "", no_hp: "", alamat: "" });
    setShowModal(true);
  };

  const handleEdit = (sty) => {
    setEditing(sty.id_pegawai);
    setForm({
      nama: sty.nama,
      jabatan: sty.jabatan || "",
      no_hp: sty.no_hp || "",
      alamat: sty.alamat || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      // route was: delete('/pegawai/delete/{id_pegawai}')
      await apiFetch(`/pegawai/delete/${id}`, { method: "DELETE" });
      toast.success("Pegawai berhasil dihapus");
      fetchStylists();
    } catch (err) {
      toast.error(err.body?.message || "Gagal hapus pegawai");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama) {
      toast.error("Nama wajib diisi");
      return;
    }

    try {
      if (editing) {
        await apiFetch("/pegawai/update", {
          method: "POST",
          body: JSON.stringify({ id_pegawai: editing, ...form }),
        });
        toast.success("Pegawai diperbarui");
      } else {
        await apiFetch("/pegawai/create", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast.success("Pegawai ditambahkan");
      }
      setShowModal(false);
      fetchStylists();
    } catch (err) {
      toast.error(err.body?.message || "Gagal simpan pegawai");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Kelola Pegawai</h2>

      <Button className="my-3" onClick={handleAdd}>
        Tambah Pegawai
      </Button>

      <Table bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Pegawai</th>
            <th>Jabatan</th>
            <th>No HP</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {stylists.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Belum ada pegawai
              </td>
            </tr>
          ) : (
            stylists.map((s, i) => (
              <tr key={s.id_pegawai}>
                <td>{i + 1}</td>
                <td>{s.nama}</td>
                <td>{s.jabatan}</td>
                <td>{s.no_hp}</td>
                <td>{s.alamat}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(s)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(s.id_pegawai)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Pegawai" : "Tambah Pegawai"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control name="nama" value={form.nama} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jabatan</Form.Label>
              <Form.Control name="jabatan" value={form.jabatan} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>No HP</Form.Label>
              <Form.Control name="no_hp" value={form.no_hp} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alamat</Form.Label>
              <Form.Control name="alamat" value={form.alamat} onChange={handleChange} />
            </Form.Group>

            <Button type="submit" className="w-100">
              Simpan
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminJadwalPage;
