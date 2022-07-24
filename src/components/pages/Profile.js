import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Spinner,
  Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Navtop from "../Navtop";
import logo192 from "../../assets/logo192.png";

export default function Profile() {
  const { currentUser, updatePhotoURL } = useAuth();

  const urlRef = useRef();
  const formRef = useRef();

  const [defaulting, setDefaulting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await updatePhotoURL(urlRef.current.value.trim());
    } catch (error) {
      setError(error.message);
    }
    formRef.current.reset();
    setLoading(false);
  }

  async function handleClick() {
    try {
      setError("");
      setDefaulting(true);

      await updatePhotoURL("");
    } catch (error) {
      setError(error.message);
    }
    setDefaulting(false);
  }

  return (
    <>
      <Navtop />
      <Container className="my-4">
        <Stack direction="horizontal" gap="2" className="mb-2">
          <h1>Profile </h1>
        </Stack>
        <Card>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Container className="d-flex justify-content-center">
              <img
                className="rounded-circle"
                src={currentUser.photoURL || logo192}
                alt="photoURL"
                width="150"
                height="150"
              />
            </Container>
            <h2 className="mb-3 text-center">{currentUser.email}</h2>
            <div className="w-100 text-center mb-3">
              <Link to="/update-password">Update Password</Link>
            </div>
            {currentUser.photoURL && (
              <div className="text-center mb-3">
                {defaulting ? (
                  <Button variant="outline-secondary" size="sm" disabled>
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Resetting...
                  </Button>
                ) : (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleClick}
                  >
                    Reset Profile Picture
                  </Button>
                )}
              </div>
            )}
            <Form onSubmit={handleSubmit} ref={formRef}>
              <InputGroup>
                <Form.Control
                  ref={urlRef}
                  type="text"
                  placeholder="Photo URL"
                  required
                />
                {loading ? (
                  <Button disabled>
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Updating...
                  </Button>
                ) : (
                  <Button type="submit">Update Profile Picture</Button>
                )}
              </InputGroup>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
