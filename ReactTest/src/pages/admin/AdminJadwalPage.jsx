import { useEffect, useState } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "sonner";

const AdminJadwalPage = () => {
    const [stylists, setStylists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        nama: "",
        keahlian: "",
    });

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("stylists")) || [];
        setStylists(saved);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAdd = () => {
        setEditing(null);
        setForm({ nama: "", keahlian: "" });
        setShowModal(true);
    };

    const handleEdit = (sty) => {
        setEditing(sty.id);
        setForm({
            nama: sty.name,
            keahlian: sty.expertise,
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        const updated = stylists.filter((s) => s.id !== id);
        localStorage.setItem("stylists", JSON.stringify(updated));
        setStylists(updated);
        toast.success("Stylist berhasil dihapus");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.nama || !form.keahlian) {
            toast.error("Semua field wajib diisi");
            return;
        }

        let updated;

        if (editing) {
            updated = stylists.map((s) =>
                s.id === editing
                    ? {
                          ...s,
                          name: form.nama,
                          expertise: form.keahlian,
                      }
                    : s
            );
            toast.success("Stylist berhasil diperbarui");
        } else {
            const newSty = {
                id: Date.now(),
                name: form.nama,
                expertise: form.keahlian,
            };
            updated = [...stylists, newSty];
            toast.success("Stylist berhasil ditambahkan");
        }

        localStorage.setItem("stylists", JSON.stringify(updated));
        setStylists(updated);
        setShowModal(false);
    };

    return (
        <Container className="mt-4">
            <h2>Kelola Stylist</h2>

            <Button className="my-3" onClick={handleAdd}>
                Tambah Stylist
            </Button>

            <Table bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama Stylist</th>
                        <th>Keahlian</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {stylists.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                Belum ada stylist
                            </td>
                        </tr>
                    ) : (
                        stylists.map((s, i) => (
                            <tr key={s.id}>
                                <td>{i + 1}</td>
                                <td>{s.name}</td>
                                <td>{s.expertise}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEdit(s)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(s.id)}
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
                    <Modal.Title>
                        {editing ? "Edit Stylist" : "Tambah Stylist"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nama Stylist</Form.Label>
                            <Form.Control
                                type="text"
                                name="nama"
                                value={form.nama}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Keahlian</Form.Label>
                            <Form.Control
                                type="text"
                                name="keahlian"
                                value={form.keahlian}
                                onChange={handleChange}
                            />
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
