import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function AddActionModal({ show, refresh, handleClose, pref }) {
  const { currentUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [halal, setHalal] = useState(false);
  const [lactosefree, setLactosefree] = useState(false);
  const [veg, setVeg] = useState(false);
  const [vegan, setVegan] = useState(false);

  useEffect(() => {
    setVeg(pref[0]);
    setVegan(pref[1]);
    setLactosefree(pref[2]);
    setHalal(pref[3]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await updateDoc(doc(db, "users", currentUser.uid), {
        preference: [veg, vegan, lactosefree, halal],
      });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
    refresh();
    handleClose();
  }

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          {error && <Alert variant="danger">{error}</Alert>}
          <Modal.Title>Update Dietary Preferences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Check
            id="Veg"
            label="Vegetarian"
            defaultChecked={pref[0]}
            onClick={() => setVeg(!veg)}
          />
          <Form.Check
            id="Vegan"
            label="Vegan"
            defaultChecked={pref[1]}
            onClick={() => setVegan(!vegan)}
          />
          <Form.Check
            id="LacIntolerance"
            label="Lactose-Free"
            defaultChecked={pref[2]}
            onClick={() => setLactosefree(!lactosefree)}
          />
          <Form.Check
            id="Halal"
            label="Halal"
            defaultChecked={pref[3]}
            onClick={() => setHalal(!halal)}
          />

          <div className="d-flex justify-content-end">
            {loading ? (
              <Button disabled>
                <Spinner as="span" animation="border" size="sm" /> Updating...
              </Button>
            ) : (
              <Button type="submit">Update</Button>
            )}
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
