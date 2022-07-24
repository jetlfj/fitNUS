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
import GuideCard from "../cards/GuideCard";
import CreateGuideModal from "../modals/CreateGuideModal";
import ViewGuideModal from "../modals/ViewGuideModal";

export default function Guides() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [guideId, setGuideId] = useState("null");
  const [guides, setGuides] = useState([]);
  const [key, setKey] = useState("rating");

  const [showCreateGuideModal, setShowCreateGuideModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading || setLoading(true);
        setError("");

        const querySnapshot = await getDocs(
          query(collection(db, "guides"), orderBy(key, "desc"))
        );
        let data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            createdAt: doc.get("createdAt"),
            link: doc.get("link"),
            rating: doc.get("rating"),
            title: doc.get("title"),
            user: doc.get("user"),
            id: doc.id,
          });
        });
        setGuides(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, key]);

  async function deleteGuide(id) {
    try {
      setLoading(true);
      setError("");

      await deleteDoc(doc(db, "guides", id));
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
          <h1>Guides</h1>
          {loading && <Spinner animation="border" variant="primary" />}
          <Button
            className="ms-auto"
            disabled={loading}
            variant="primary"
            onClick={() => setShowCreateGuideModal(true)}
          >
            Post Guide
          </Button>
        </Stack>
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="rating" title="Top Rated">
            <Stack direction="vertical" gap="2">
              {guides.map((guide) => {
                return (
                  <GuideCard
                    key={guide.id}
                    createdAt={guide.createdAt}
                    link={guide.link}
                    rating={guide.rating}
                    title={guide.title}
                    user={guide.user}
                    onDeleteGuideClick={() => deleteGuide(guide.id)}
                    onViewGuideClick={() => setGuideId(guide.id)}
                  />
                );
              })}
            </Stack>
          </Tab>
          <Tab eventKey="createdAt" title="Newest">
            <Stack direction="vertical" gap="2">
              {guides.map((guide) => {
                return (
                  <GuideCard
                    key={guide.id}
                    createdAt={guide.createdAt}
                    link={guide.link}
                    rating={guide.rating}
                    title={guide.title}
                    user={guide.user}
                    onDeleteGuideClick={() => deleteGuide(guide.id)}
                    onViewGuideClick={() => setGuideId(guide.id)}
                  />
                );
              })}
            </Stack>
          </Tab>
        </Tabs>
      </Container>
      <ScrollToTop />
      <CreateGuideModal
        show={showCreateGuideModal}
        refresh={() => setRefresh(!refresh)}
        handleClose={() => setShowCreateGuideModal(false)}
      />
      <ViewGuideModal
        guideId={guideId}
        handleClose={() => {
          setGuideId("null");
          setRefresh(!refresh);
        }}
      />
    </>
  );
}
