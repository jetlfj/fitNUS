import { useRef, useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const emailRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await resetPassword(emailRef.current.value);
      setSent(true);
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
          <Card.Header>
            <h1 className="text-center">
              <b>fitnessIsMyPassion</b>
            </h1>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <h2 className="text-center mb-4">Password Reset</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              {!sent ? (
                loading ? (
                  <Button disabled className="w-100">
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Resetting...
                  </Button>
                ) : (
                  <Button className="w-100" type="submit">
                    Reset Password
                  </Button>
                )
              ) : (
                <Button disabled className="w-100" variant="success">
                  Check your inbox for further instructions
                </Button>
              )}
            </Form>
            <div className="w-100 text-center mt-3">
              <Link to="/login">Log In </Link>
            </div>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </Container>
  );
}
