import { useRef, useState } from "react";
import {
  Alert,
  Button,
  FloatingLabel,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function AddActionModal({
  show,
  refresh,
  refreshFB,
  handleClose,
}) {
  const { currentUser } = useAuth();

  const caloriesRef = useRef();
  const carbRef = useRef();
  const descriptionRef = useRef();
  const fatRef = useRef();
  const proteinRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(false);

  const macros = [
    ["Calories (kcal)", caloriesRef],
    ["Carbohydrates (g)", carbRef],
    ["Fats (g)", fatRef],
    ["Proteins (g)", proteinRef],
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const date = new Date().toLocaleDateString("en-SG").replace(/\//g, "");

      await addDoc(collection(db, "users", currentUser.uid, date), {
        calories: parseInt(caloriesRef.current.value),
        carbs: parseInt(carbRef.current.value),
        createdAt: serverTimestamp(),
        description: descriptionRef.current.value.trim(),
        fats: parseInt(fatRef.current.value),
        proteins: parseInt(proteinRef.current.value),
      });

      save &&
        (await addDoc(
          collection(db, "users", currentUser.uid, "userfoodbank"),
          {
            calories: parseInt(caloriesRef.current.value),
            carbs: parseInt(carbRef.current.value),
            description: descriptionRef.current.value.trim(),
            fats: parseInt(fatRef.current.value),
            proteins: parseInt(proteinRef.current.value),
          }
        ));
    } catch (error) {
      setError(error.message);
    }
    save && refreshFB();
    setSave(false);
    refresh();
    setLoading(false);
    handleClose();
  }

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setSave(false);
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <FloatingLabel label="Description" className="mb-3">
            <Form.Control ref={descriptionRef} type="text" required />
          </FloatingLabel>
          {macros.map((macro) => (
            <FloatingLabel label={macro[0]} className="mb-3" key={macro[0]}>
              <Form.Control
                ref={macro[1]}
                type="number"
                required
                min={0}
                step={1}
              />
            </FloatingLabel>
          ))}
          <Form.Check
            className="mb-3"
            id="check"
            type="checkbox"
            onClick={(e) => {
              setSave(e.target.checked);
            }}
            label="Save in Database for future use"
          />
          <div className="d-flex justify-content-end">
            {loading ? (
              <Button disabled>
                <Spinner as="span" animation="border" size="sm" /> Adding...
              </Button>
            ) : (
              <Button type="submit">Add</Button>
            )}
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
