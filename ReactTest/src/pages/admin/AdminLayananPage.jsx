import { useState, useEffect } from "react";
import { Container, Table, Button, Form, Modal } from "react-bootstrap";
import { toast } from "sonner";

const defaultServices = [
  { id: "s1", name: "Haircut (Potong Rambut)", duration: 45, price: 75000, description: "Potong rambut sesuai model." },
  { id: "s2", name: "Hair Coloring", duration: 120, price: 250000, description: "Warna rambut profesional." },
  { id: "s3", name: "Manicure", duration: 60, price: 90000, description: "Perawatan kuku & cat." },
];

const AdminLayananPage = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("services"));
    if (!stored || stored.length === 0) {
      stored = defaultServices;
      localStorage.setItem("services", JSON.stringify(stored));
    }
    setServices(stored);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditing(null);
    setForm({ name: "", price: "", duration: "", description: "" });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updated = services.filter((s) => s.id !== id);
    localStorage.setItem("services", JSON.stringify(updated));
    setServices(updated);
    toast.success("Layanan berhasil dihapus");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.duration) {
      toast.error("Semua field wajib diisi");
      return;
    }

    let updated;

    if (editing) {
      updated = services.map((s) =>
        s.id === editing ? { ...s, ...form } : s
      );
      toast.success("Layanan berhasil diperbarui");
    } else {
      const newData = {
        id: "s" + Date.now(),
        ...form,
      };
      updated = [...services, newData];
      toast.success("Layanan berhasil ditambahkan");
    }

    localStorage.setItem("services", JSON.stringify(updated));
    setServices(updated);
    setShowModal(false);
  };

  return (
    <Container className="mt-4">
      <h2>Kelola Layanan</h2>

      <Button className="my-3" onClick={handleAdd}>
        Tambah Layanan
      </Button>

      <Table bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Layanan</th>
            <th>Harga</th>
            <th>Durasi</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">Belum ada layanan</td>
            </tr>
          ) : (
            services.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>Rp {s.price}</td>
                <td>{s.duration} menit</td>
                <td>{s.description}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(s)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>
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
          <Modal.Title>{editing ? "Edit Layanan" : "Tambah Layanan"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Layanan</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control type="number" name="price" value={form.price} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Durasi (menit)</Form.Label>
              <Form.Control type="number" name="duration" value={form.duration} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control type="text" name="description" value={form.description} onChange={handleChange} />
            </Form.Group>

            <Button type="submit" className="w-100">Simpan</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminLayananPage;
