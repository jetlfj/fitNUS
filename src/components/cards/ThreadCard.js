import { Button, Card, Stack } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

export default function ThreadCard({
  createdAt,
  lastReply,
  onDeleteThreadClick,
  onViewThreadClick,
  title,
  user,
}) {
  const { currentUser } = useAuth();

  function getTimeAgo(time) {
    const diff = (Date.now() - time.toDate().getTime()) / 1000;

    if (diff < 2) return "1 second";
    if (diff < 60) return Math.floor(diff) + " seconds";
    if (diff < 120) return "1 minute";
    if (diff < 3600) return Math.floor(diff / 60) + " minutes";
    if (diff < 7200) return "1 hour";
    if (diff < 86400) return Math.floor(diff / 3600) + " hours";
    if (diff < 172800) return "1 day";
    return Math.floor(diff / 86400) + " days";
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="text-muted">Posted: {getTimeAgo(createdAt)} ago</div>
      </Card.Body>
      <Card.Footer>
        <Stack direction="horizontal" gap="2">
          <div className="me-auto">
            {lastReply.toString() === createdAt.toString()
              ? "No replies yet"
              : "Last Reply: " + getTimeAgo(lastReply) + " ago"}
          </div>
          {user === currentUser.uid && (
            <Button
              className="ms-auto"
              variant="outline-danger"
              onClick={onDeleteThreadClick}
            >
              Delete Thread
            </Button>
          )}
          <Button
            variant="outline-primary"
            className="ms-3"
            onClick={onViewThreadClick}
          >
            View Thread
          </Button>
        </Stack>
      </Card.Footer>
    </Card>
  );
}
