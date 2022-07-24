import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Modal,
  FloatingLabel,
  Spinner,
} from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function SetPlanModal({ show, refresh, handleClose }) {
  const { currentUser } = useAuth();

  const ageRef = useRef();
  const heightRef = useRef();
  const weightRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState();
  const [gender, setGender] = useState();
  const [intent, setIntent] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const calCountMale =
        13.397 * parseInt(weightRef.current.value) +
        4.799 * parseInt(heightRef.current.value) -
        5.677 * parseInt(ageRef.current.value) +
        88.362;

      const calCountFemale =
        9.247 * parseInt(weightRef.current.value) +
        3.098 * parseInt(heightRef.current.value) -
        4.33 * parseInt(ageRef.current.value) +
        447.593;

      const handleActivity = (num) => {
        if (active === 0) {
          return 1.2 * num;
        } else if (active === 1) {
          return 1.375 * num;
        } else if (active === 2) {
          return 1.55 * num;
        } else if (active === 3) {
          return 1.725 * num;
        } else {
          return 1.9 * num;
        }
      };

      const handleIntent = (num) => {
        if (intent === 0) {
          return num;
        } else if (intent === 1) {
          return num - 500;
        } else {
          return num + 500;
        }
      };

      const maxCalories =
        gender === "male"
          ? Math.round(handleIntent(handleActivity(calCountMale)))
          : Math.round(handleIntent(handleActivity(calCountFemale)));

      const proteins =
        intent <= 1
          ? Math.round(((maxCalories / 10) * 3) / 4)
          : Math.round(((maxCalories / 10) * 3.5) / 4);

      const fats =
        intent <= 1
          ? Math.round(((maxCalories / 10) * 3) / 9)
          : Math.round(((maxCalories / 10) * 1.5) / 9);

      const carbs =
        intent <= 1
          ? Math.round(((maxCalories / 10) * 4) / 4)
          : Math.round(((maxCalories / 10) * 5) / 4);

      await updateDoc(doc(db, "users", currentUser.uid), {
        maxCalories: maxCalories,
        intent: intent,
        proteins: proteins,
        fats: fats,
        carbs: carbs,
      });
    } catch (error) {
      setError(error.message);
    }

    refresh();
    setLoading(false);
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Set Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <FloatingLabel label="Age" className="mb-3">
            <Form.Control
              type="number"
              ref={ageRef}
              required
              min={0}
              step={1}
            />
          </FloatingLabel>

          <FloatingLabel label="Height (in cm)" className="mb-3">
            <Form.Control
              type="number"
              ref={heightRef}
              required
              min={0}
              step={1}
            />
          </FloatingLabel>

          <FloatingLabel label="Weight (in Kg)" className="mb-3">
            <Form.Control
              type="number"
              ref={weightRef}
              required
              min={0}
              step={1}
            />
          </FloatingLabel>
          <Form.Group className="mb-3">
            <Form.Label>Gender: </Form.Label>
            <Form.Check
              type="radio"
              label="Male"
              onClick={() => setGender("male")}
              id="radioMale"
              name="gender"
              required
            />
            <Form.Check
              type="radio"
              label="Female"
              onClick={() => setGender("female")}
              id="radioFemale"
              name="gender"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Goal:</Form.Label>
            <Form.Check
              type="radio"
              label="Maintain weight"
              onClick={() => setIntent(0)}
              id="radioMaintain"
              name="intent"
              required
            />
            <Form.Check
              type="radio"
              label="Lose weight"
              onClick={() => setIntent(1)}
              id="radioLose"
              name="intent"
              required
            />
            <Form.Check
              type="radio"
              label="Bulk"
              onClick={() => setIntent(2)}
              id="radioGain"
              name="intent"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Days of exercise per week:</Form.Label>
            <Form.Check
              type="radio"
              label="0-1"
              onClick={() => setActive(0)}
              id="radio0"
              name="active"
              required
            />
            <Form.Check
              type="radio"
              label="2"
              onClick={() => setActive(1)}
              id="radio1"
              name="active"
              required
            />
            <Form.Check
              type="radio"
              label="3-4"
              onClick={() => setActive(2)}
              id="radio2"
              name="active"
              required
            />
            <Form.Check
              type="radio"
              label="5"
              onClick={() => setActive(3)}
              id="radio3"
              name="active"
              required
            />
            <Form.Check
              type="radio"
              label="6-7"
              onClick={() => setActive(4)}
              id="radio4"
              name="active"
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            {loading ? (
              <Button disabled>
                <Spinner as="span" animation="border" size="sm" /> Setting...
              </Button>
            ) : (
              <Button type="submit">Set</Button>
            )}
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
