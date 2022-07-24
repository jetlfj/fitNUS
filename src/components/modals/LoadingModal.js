import { Modal, Spinner } from "react-bootstrap";

export default function LoadingModal() {
  return (
    <Modal backdrop={false} show centered>
      <Modal.Body className="d-flex justify-content-center mt-3 mb-3">
        <Spinner animation="border" variant="primary" />
      </Modal.Body>
    </Modal>
  );
}
