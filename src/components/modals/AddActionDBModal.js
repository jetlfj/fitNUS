import { useEffect, useState } from "react";
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

export default function AddActionDBModal({
  handleClose,
  refresh,
  show,
  foodbank,
  userfoodbank,
}) {
  const { currentUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [foodId, setFoodId] = useState("");
  const [macros, setMacros] = useState([]);

  useEffect(() => {
    if (foodId) {
      let data = [
        ["Calories (kcal)", 0],
        ["Carbohydrates (g)", 0],
        ["Fats (g)", 0],
        ["Proteins (g)", 0],
      ];
      if (typeof foodbank.find((food) => food.id === foodId) !== "undefined") {
        let temp = foodbank.find((food) => food.id === foodId);
        setDescription(temp.description);
        data[0][1] = temp.calories;
        data[1][1] = temp.carbs;
        data[2][1] = temp.fats;
        data[3][1] = temp.proteins;
        setMacros(data);
      } else {
        let temp = userfoodbank.find((food) => food.id === foodId);
        setDescription(temp.description);
        data[0][1] = temp.calories;
        data[1][1] = temp.carbs;
        data[2][1] = temp.fats;
        data[3][1] = temp.proteins;
        setMacros(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodId]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const date = new Date().toLocaleDateString("en-SG").replace(/\//g, "");
      await addDoc(collection(db, "users", currentUser.uid, date), {
        description: description,
        calories: macros[0][1],
        carbs: macros[1][1],
        fats: macros[2][1],
        proteins: macros[3][1],
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      setError(error.message);
    }
    setFoodId("");
    refresh();
    setLoading(false);
    handleClose();
  }

  return (
    <Modal
      show={show}
      onHide={() => {
        setFoodId("");
        handleClose();
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Select from Database</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <FloatingLabel label="Food Item" className="mb-3">
            <Form.Select onChange={(e) => setFoodId(e.target.value)}>
              <option value="">Select...</option>
              {userfoodbank.length && (
                <option disabled>Your Saved Entries</option>
              )}
              {userfoodbank.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.description}
                </option>
              ))}
              <option disabled>Database Entries</option>
              {foodbank.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.description}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          {foodId &&
            macros.map((macro) => (
              <FloatingLabel label={macro[0]} className="mb-3" key={macro[0]}>
                <Form.Control readOnly value={macro[1]} />
              </FloatingLabel>
            ))}
          <div className="d-flex justify-content-end">
            {loading ? (
              <Button disabled>
                <Spinner as="span" animation="border" size="sm" /> Selecting...
              </Button>
            ) : (
              <Button disabled={!foodId} type="submit">
                Select
              </Button>
            )}
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
