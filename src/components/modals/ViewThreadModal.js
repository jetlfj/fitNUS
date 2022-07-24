import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Stack, Alert } from "react-bootstrap";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import LoadingModal from "./LoadingModal";

export default function ViewThreadModal({ threadId, handleClose }) {
  const { currentUser } = useAuth();

  const contentRef = useRef();
  const formRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [replies, setReplies] = useState();
  const [thread, setThread] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading || setLoading(true);
        setError("");

        const docSnap = await getDoc(doc(db, "threads", threadId));
        setThread(docSnap.data());

        const querySnapshot = await getDocs(
          query(
            collection(db, "threads", threadId, "replies"),
            orderBy("createdAt")
          )
        );
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setReplies(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId, refresh]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await addDoc(collection(db, "threads", threadId, "replies"), {
        content: contentRef.current.value.trim(),
        deleted: false,
        user: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "threads", threadId), {
        lastReply: serverTimestamp(),
      });

      formRef.current.reset();
      setRefresh(!refresh);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function deleteReply(reply) {
    try {
      setLoading(true);
      setError("");

      await updateDoc(doc(db, "threads", threadId, "replies", reply.id), {
        deleted: true,
      });
      setRefresh(!refresh);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      {loading && threadId !== "null" && <LoadingModal />}
      {thread && (
        <Modal show={threadId !== "null"} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{thread && thread.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Stack direction="vertical" gap="2">
              {thread.content}
              <hr />
              {replies.map((reply) => (
                <div key={reply.id}>
                  <Stack direction="horizontal" gap="2">
                    {reply.deleted ? (
                      <div className="me-auto text-muted">
                        Reply has been deleted by user
                      </div>
                    ) : (
                      <>
                        <div className="me-auto">{reply.content}</div>
                        {reply.user === currentUser.uid && (
                          <Button
                            disabled={loading}
                            onClick={() => deleteReply(reply)}
                            size="sm"
                            variant="outline-danger"
                          >
                            Delete
                          </Button>
                        )}
                      </>
                    )}
                  </Stack>
                  <hr />
                </div>
              ))}
              <Form ref={formRef} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    ref={contentRef}
                    type="text"
                    placeholder="Reply"
                    rows={3}
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button disabled={loading} variant="primary" type="submit">
                    Reply
                  </Button>
                </div>
              </Form>
            </Stack>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
