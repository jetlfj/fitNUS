import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Container,
  Spinner,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import Navtop from "../Navtop";
import ScrollToTop from "../ScrollToTop";
import ThreadCard from "../cards/ThreadCard";
import CreateThreadModal from "../modals/CreateThreadModal";
import ViewThreadModal from "../modals/ViewThreadModal";

export default function Forum() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [threadId, setThreadId] = useState("null");
  const [threads, setThreads] = useState([]);
  const [key, setKey] = useState("createdAt");

  const [showCreateThreadModal, setShowCreateThreadModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading || setLoading(true);
        setError("");

        const querySnapshot = await getDocs(
          query(collection(db, "threads"), orderBy(key, "desc"))
        );
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            user: doc.get("user"),
            title: doc.get("title"),
            lastReply: doc.get("lastReply"),
            createdAt: doc.get("createdAt"),
            id: doc.id,
          });
        });

        setThreads(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, key]);

  async function deleteThread(id) {
    try {
      setLoading(true);
      setError("");

      await deleteDoc(doc(db, "threads", id));
      setRefresh(!refresh);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <>
      <Navtop />
      <Container className="my-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Stack direction="horizontal" gap="2" className="mb-2">
          <h1>Forum</h1>
          {loading && <Spinner animation="border" variant="primary" />}
          <Button
            className="ms-auto"
            disabled={loading}
            variant="primary"
            onClick={() => setShowCreateThreadModal(true)}
          >
            Post Thread
          </Button>
        </Stack>
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="createdAt" title="Newest">
            <Stack direction="vertical" gap="2" className="mb-4">
              {threads.map((thread) => {
                return (
                  <ThreadCard
                    key={thread.id}
                    user={thread.user}
                    title={thread.title}
                    lastReply={thread.lastReply}
                    createdAt={thread.createdAt}
                    onDeleteThreadClick={() => deleteThread(thread.id)}
                    onViewThreadClick={() => setThreadId(thread.id)}
                  />
                );
              })}
            </Stack>
          </Tab>
          <Tab eventKey="lastReply" title="Latest Reply">
            <Stack direction="vertical" gap="2" className="mb-4">
              {threads.map((thread) => {
                return (
                  <ThreadCard
                    key={thread.id}
                    user={thread.user}
                    title={thread.title}
                    lastReply={thread.lastReply}
                    createdAt={thread.createdAt}
                    onDeleteThreadClick={() => deleteThread(thread.id)}
                    onViewThreadClick={() => setThreadId(thread.id)}
                  />
                );
              })}
            </Stack>
          </Tab>
        </Tabs>
      </Container>
      <ScrollToTop />
      <CreateThreadModal
        show={showCreateThreadModal}
        refresh={() => setRefresh(!refresh)}
        handleClose={() => setShowCreateThreadModal(false)}
      />
      <ViewThreadModal
        threadId={threadId}
        handleClose={() => {
          setThreadId("null");
          setRefresh(!refresh);
        }}
      />
    </>
  );
}
