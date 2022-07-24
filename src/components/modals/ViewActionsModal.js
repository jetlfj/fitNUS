import { useState } from "react";
import {
  Alert,
  Button,
  Modal,
  Spinner,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function ViewActionsModal({
  handleClose,
  refresh,
  actions,
  show,
}) {
  const { currentUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [key, setKey] = useState("calories");

  async function deletePlan() {
    try {
      setLoading(true);
      setError("");

      await updateDoc(doc(db, "users", currentUser.uid), {
        maxCalories: deleteField(),
      });
      refresh();
      handleClose();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  async function deleteAction(action) {
    try {
      setLoading(true);
      setError("");

      const date = new Date().toLocaleDateString("en-SG").replace(/\//g, "");
      await deleteDoc(doc(db, "users", currentUser.uid, date, action.id));
      refresh();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Stack direction="horizontal" gap="3">
            <Modal.Title>History</Modal.Title>
            <Button
              disabled={loading}
              onClick={() => {
                deletePlan();
              }}
              variant="outline-danger"
            >
              Delete Plan
            </Button>
          </Stack>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
            <Tab eventKey="calories" title="Calories">
              <Stack gap="2">
                {actions.map((action) => (
                  <Stack direction="horizontal" gap="2" key={action.id}>
                    <div style={{}} className="me-auto">
                      {action.description}
                    </div>
                    <div>{action.calories} kcal</div>
                    <Button
                      disabled={loading}
                      onClick={() => deleteAction(action)}
                      size="sm"
                      variant="outline-danger"
                    >
                      &times;
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Tab>
            <Tab eventKey="carbs" title="Carbohydrates">
              <Stack gap="2">
                {actions.map((action) => (
                  <Stack direction="horizontal" gap="2" key={action.id}>
                    <div style={{}} className="me-auto">
                      {action.description}
                    </div>
                    <div>{action.carbs} g</div>
                    <Button
                      disabled={loading}
                      onClick={() => deleteAction(action)}
                      size="sm"
                      variant="outline-danger"
                    >
                      &times;
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Tab>
            <Tab eventKey="fats" title="Fats">
              <Stack gap="2">
                {actions.map((action) => (
                  <Stack direction="horizontal" gap="2" key={action.id}>
                    <div style={{}} className="me-auto">
                      {action.description}
                    </div>
                    <div>{action.fats} g</div>
                    <Button
                      disabled={loading}
                      onClick={() => deleteAction(action)}
                      size="sm"
                      variant="outline-danger"
                    >
                      &times;
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Tab>
            <Tab eventKey="proteins" title="Proteins">
              <Stack gap="2">
                {actions.map((action) => (
                  <Stack direction="horizontal" gap="2" key={action.id}>
                    <div style={{}} className="me-auto">
                      {action.description}
                    </div>
                    <div>{action.proteins} g</div>
                    <Button
                      disabled={loading}
                      onClick={() => deleteAction(action)}
                      size="sm"
                      variant="outline-danger"
                    >
                      &times;
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Tab>
          </Tabs>
          {loading && (
            <div className="d-flex justify-content-center mt-3 mb-3">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
