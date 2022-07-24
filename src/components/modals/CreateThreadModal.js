import { useRef, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateThreadModal({ show, refresh, handleClose }) {
  const { currentUser } = useAuth();

  const contentRef = useRef();
  const titleRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await addDoc(collection(db, "threads"), {
        title: titleRef.current.value.trim(),
        content: contentRef.current.value.trim(),
        user: currentUser.uid,
        lastReply: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      setError(error.message);
    }
    refresh();
    setLoading(false);
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create Thread</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              ref={titleRef}
              type="text"
              placeholder="Enter title"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              ref={contentRef}
              type="text"
              rows={5}
              placeholder="Enter content"
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button disabled={loading} variant="primary" type="submit">
              Create
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
