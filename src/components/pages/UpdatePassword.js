import { useRef, useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function UpdateProfile() {
  const { currentUser, updateUserPassword } = useAuth();

  const passwordConfirmRef = useRef();
  const passwordRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [updated, setUpdated] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    }

    try {
      setError("");
      setLoading(true);

      await updateUserPassword(passwordRef.current.value);
      setUpdated(true);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <h2 className="text-center mb-4">Update Password</h2>
            <div className="text-center mb-4">Email: {currentUser.email}</div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" id="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group className="mb-3" id="password-confirm">
                <Form.Label> New Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              {!updated ? (
                loading ? (
                  <Button disabled className="w-100" variant="outline-primary">
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Updating...
                  </Button>
                ) : (
                  <Button className="w-100" type="submit">
                    Update
                  </Button>
                )
              ) : (
                <Button disabled className="w-100" variant="success">
                  Updated
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Link style={{ pointerEvents: loading && "none" }} to="/profile">
            Go Back
          </Link>
        </div>
      </div>
    </Container>
  );
}
