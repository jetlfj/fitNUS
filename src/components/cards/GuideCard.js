import { Button, Card, Stack } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";

export default function GuideCard({
  createdAt,
  link,
  rating,
  title,
  user,
  onDeleteGuideClick,
  onViewGuideClick,
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
        <Stack direction="horizontal" gap={2}>
          <img
            alt="thumbnail"
            src={`https://i.ytimg.com/vi/${link}/default.jpg`}
          />
          <div>
            <Card.Title>{title}</Card.Title>
            <div className="text-muted">
              Posted: {getTimeAgo(createdAt)} ago
            </div>
          </div>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Stack direction="horizontal" gap="2">
          <div className="me-auto">
            Rating: {rating > 0 && "+"}
            {rating}
          </div>
          {user === currentUser.uid && (
            <Button variant="outline-danger" onClick={onDeleteGuideClick}>
              Delete Guide
            </Button>
          )}
          <Button
            variant="outline-primary"
            className="ms-3"
            onClick={onViewGuideClick}
          >
            View Guide
          </Button>
        </Stack>
      </Card.Footer>
    </Card>
  );
}
