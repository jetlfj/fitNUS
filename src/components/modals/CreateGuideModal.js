import { useRef, useState } from "react";
import { Alert, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateGuideModal({ show, refresh, handleClose }) {
  const { currentUser } = useAuth();

  const descriptionRef = useRef();
  const linkRef = useRef();
  const titleRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [link, setLink] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await addDoc(collection(db, "guides"), {
        title: titleRef.current.value.trim(),
        link: linkRef.current.value.trim(),
        description: descriptionRef.current.value.trim(),
        user: currentUser.uid,
        rating: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      setError(error.message);
    }
    setLink();
    refresh();
    setLoading(false);
    handleClose();
  }

  return (
    <Modal
      show={show}
      onHide={() => {
        setLink();
        handleClose();
      }}
      size="lg"
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control ref={titleRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Video Link</Form.Label>
            <InputGroup>
              <Form.Control ref={linkRef} type="text" required />
              <Button onClick={() => setLink(linkRef.current.value.trim())}>
                Preview
              </Button>
              {typeof link === "undefined" || link === "" || (
                <Button
                  disabled={typeof link === "undefined" || link === ""}
                  variant="outline-danger"
                  onClick={() => setLink()}
                >
                  Close Preview
                </Button>
              )}
            </InputGroup>
            <Form.Text muted>
              For example: If the link is https://youtu.be/dQw4w9WgXcQ, enter{" "}
              <u>dQw4w9WgXcQ</u>.
            </Form.Text>
          </Form.Group>

          {link && (
            <div
              className="mb-3"
              style={{
                position: "relative",
                paddingTop: "56.25%",
                paddingBottom: 25,
              }}
            >
              <iframe
                title={link}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                src={`https://www.youtube.com/embed/${link}`}
                frameBorder="0"
              />
            </div>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              ref={descriptionRef}
              type="text"
              rows={5}
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
