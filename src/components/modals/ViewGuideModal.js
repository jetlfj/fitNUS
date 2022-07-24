import { useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Stack } from "react-bootstrap";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import LoadingModal from "./LoadingModal";

export default function ViewGuideModal({ guideId, handleClose }) {
  const { currentUser } = useAuth();

  const contentRef = useRef();
  const formRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [comments, setComments] = useState();
  const [guide, setGuide] = useState();
  const [userRating, setUserRating] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading || setLoading(true);
        setError("");

        const docSnap = await getDoc(doc(db, "guides", guideId));
        setGuide(docSnap.data());

        const docSnap2 = await getDoc(
          doc(db, "guides", guideId, "ratings", currentUser.uid)
        );
        setUserRating(docSnap2.get("rating") || 0);

        const querySnapshot = await getDocs(
          query(
            collection(db, "guides", guideId, "comments"),
            orderBy("createdAt")
          )
        );
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setComments(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideId, refresh]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await addDoc(collection(db, "guides", guideId, "comments"), {
        content: contentRef.current.value.trim(),
        user: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      formRef.current.reset();
      setRefresh(!refresh);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function deleteComment(comment) {
    try {
      setLoading(true);
      setError("");

      await deleteDoc(doc(db, "guides", guideId, "comments", comment.id));
      setRefresh(!refresh);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleUpvote() {
    try {
      setLoading(true);
      setError("");

      await updateDoc(doc(db, "guides", guideId), {
        rating: increment(userRating !== 0 ? (userRating === 1 ? -1 : 2) : 1),
      });

      await setDoc(doc(db, "guides", guideId, "ratings", currentUser.uid), {
        rating: userRating === 1 ? 0 : 1,
      });

      setRefresh(!refresh);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleDownvote() {
    try {
      setLoading(true);
      setError("");

      await updateDoc(doc(db, "guides", guideId), {
        rating: increment(userRating !== 0 ? (userRating === -1 ? 1 : -2) : -1),
      });

      await setDoc(doc(db, "guides", guideId, "ratings", currentUser.uid), {
        rating: userRating === -1 ? 0 : -1,
      });

      setRefresh(!refresh);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      {loading && guideId !== "null" && <LoadingModal />}
      {guide && (
        <Modal
          show={guideId !== "null"}
          onHide={() => {
            handleClose();
            setUserRating();
          }}
          size="lg"
        >
          <Modal.Header closeButton>
            <Stack direction="horizontal" gap="3">
              <Stack direction="vertical" gap="1">
                <Button
                  size="sm"
                  variant={userRating === 1 ? "success" : "outline-success"}
                  onClick={handleUpvote}
                  disabled={loading}
                >
                  Upvote
                </Button>
                <div className="text-center">
                  {guide.rating > 0 && "+"}
                  {guide.rating}
                </div>
                <Button
                  size="sm"
                  variant={userRating === -1 ? "danger" : "outline-danger"}
                  onClick={handleDownvote}
                  disabled={loading}
                >
                  Downvote
                </Button>
              </Stack>
              <Modal.Title>{guide.title}</Modal.Title>
            </Stack>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Stack direction="vertical" gap="2">
              <div
                style={{
                  position: "relative",
                  paddingTop: "56.25%",
                  paddingBottom: 25,
                }}
              >
                <iframe
                  title={guide.link}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  src={`https://www.youtube.com/embed/${guide.link}`}
                  allow="fullscreen"
                  frameBorder="0"
                />
              </div>

              {guide.description}
              <hr />
              {comments.map((comment) => (
                <div key={comment.id}>
                  <Stack direction="horizontal" gap="2">
                    <div className="me-auto">{comment.content}</div>
                    {comment.user === currentUser.uid && (
                      <Button
                        disabled={loading}
                        onClick={() => deleteComment(comment)}
                        size="sm"
                        variant="outline-danger"
                      >
                        Delete
                      </Button>
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
                    placeholder="Comment"
                    rows={3}
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button disabled={loading} variant="primary" type="submit">
                    Comment
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
