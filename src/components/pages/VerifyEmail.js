import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Navbar,
  Container,
  Alert,
  Card,
  Spinner,
  Stack,
} from "react-bootstrap";

export default function VerifyEmail() {
  const { currentUser, logout, resendEmailVerification } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [resent, setResent] = useState(false);

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      setError("");

      await logout();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleResend() {
    try {
      setResending(true);
      setError("");

      await resendEmailVerification();
      setResent(true);
    } catch (error) {
      setError(error.message);
    }
    setResending(false);
  }

  async function handleClick() {
    try {
      setLoading(true);
      setError("");

      await currentUser.reload();
      navigate("/");
    } catch {
      setError("Please log in again.");
    }
    setLoading(false);
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <div>fitnessIsMyPassion</div>
          <Button
            disabled={loading || resending}
            variant="link"
            onClick={handleLogout}
          >
            Exit
          </Button>
        </Container>
      </Navbar>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Stack direction="vertical" gap="2">
                <div className="text-center">
                  A verification email has been sent to your inbox. <br />
                  Follow the link to continue using the application.
                </div>
                <hr />
                {loading ? (
                  <Button disabled variant="outline-primary">
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Verifying...
                  </Button>
                ) : (
                  <Button
                    disabled={resending}
                    variant="primary"
                    onClick={handleClick}
                  >
                    I have verified my email
                  </Button>
                )}

                <hr />
                {!resent ? (
                  resending ? (
                    <Button disabled variant="outline-primary">
                      <Spinner as="span" animation="border" size="sm" />{" "}
                      Re-sending...
                    </Button>
                  ) : (
                    <Button
                      disabled={loading}
                      variant="outline-primary"
                      onClick={handleResend}
                    >
                      Re-send verification email
                    </Button>
                  )
                ) : (
                  <Button disabled variant="outline-primary">
                    Verification email re-sent
                  </Button>
                )}
              </Stack>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
