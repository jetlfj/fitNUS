import { useState } from "react";
import { Alert, Button, Container, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo192 from "../assets/logo192.png";
import LoadingModal from "./modals/LoadingModal";

export default function Navtop() {
  const { currentUser, logout } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      setError("");

      await logout();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      {loading && <LoadingModal />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <NavDropdown title="fitnessIsMyPassion" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/">
              Home
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/forum">
              Forum
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/guides">
              Guides
            </NavDropdown.Item>
          </NavDropdown>
          <img
            className="ms-auto rounded-circle me-2"
            src={currentUser.photoURL || logo192}
            alt="photoURL"
            width="35"
            height="35"
          />
          <NavDropdown title="Account" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/profile">
              Profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item
              as={Button}
              disabled={loading}
              variant="link"
              onClick={handleLogout}
            >
              Log Out
            </NavDropdown.Item>
          </NavDropdown>
        </Container>
      </Navbar>
    </>
  );
}
