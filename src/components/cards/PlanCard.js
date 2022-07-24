import { Button, Card, ProgressBar, Stack } from "react-bootstrap";

export default function PlanCard({
  intent,
  macros,
  onAddActionClick,
  onAddActionDBClick,
  onViewActionsClick,
}) {
  const currCalories = macros[0][1];
  const maxCalories = macros[0][2];

  function getProgressBarVariant(curr, max) {
    const ratio = curr / max;
    if (intent <= 1) {
      if (ratio < 0.5) return "primary";
      if (ratio < 0.75) return "warning";
      return "danger";
    } else {
      if (ratio < 0.25) return "danger";
      if (ratio < 0.5) return "warning";
      if (ratio >= 1) return "success";
      return "primary";
    }
  }

  function message() {
    if (currCalories === 0)
      return (
        <ul className="list-unstyled">
          <li>
            Press <b>Dietary Preferences</b> to filter food options that meet
            your dietary requirements.
          </li>
          <li>
            Press <b>Add New Entry</b> to add food items to your own database if
            it is not included in ours!
          </li>
          <li>
            Press <b>Select from Database</b> to look through our database of
            food items for their calories.
          </li>
          <li>
            Press <b>View History</b> to see or edit what you have consumed
            today.
          </li>
        </ul>
      );

    const ratio = currCalories / maxCalories;
    const remain = maxCalories - currCalories;

    if (intent <= 1) {
      if (ratio === 1) {
        return <div>You have reach your daily limit!</div>;
      } else if (ratio > 1) {
        return (
          <div>
            You have exceeded your daily limit by <b>{-remain} kcal</b>.
          </div>
        );
      } else if (ratio > 0.75) {
        return (
          <div>
            You are nearing your daily limit. <b>{remain} kcal</b> left.
          </div>
        );
      } else {
        return (
          <div>
            You are still within your daily limit. <b>{remain} kcal</b> left.
          </div>
        );
      }
    } else {
      if (ratio >= 1) {
        return <div>You have hit your target intake!</div>;
      } else if (ratio > 0.75) {
        return (
          <div>
            You are nearing your target! Just <b>{remain} kcal</b> more!
          </div>
        );
      } else {
        return (
          <div>
            A step in the right direction. Just <b>{remain} kcal</b> more to go.
          </div>
        );
      }
    }
  }

  return (
    <>
      <div className="mb-3">{message()}</div>
      <Card
        className={
          ((intent <= 1 && currCalories > maxCalories) ||
            (intent > 1 && currCalories === 0)) &&
          "bg-danger bg-opacity-10"
        }
      >
        <Card.Body>
          {macros.map((macro) => (
            <div key={macro[0]}>
              <Card.Title className="d-flex justify-content-between align-items-baseline fw-normal mb-3">
                <div className="me-2">{macro[0]}</div>
                <div className="d-flex align-items-baseline">
                  {macro[1]} {macro[0] === "Calories" ? "kcal" : "g"}
                  <span className="text-muted fs-6 ms-1">
                    / {macro[2]} {macro[0] === "Calories" ? "kcal" : "g"}
                  </span>
                </div>
              </Card.Title>
              <ProgressBar
                className="rounded-pill mb-3"
                variant={getProgressBarVariant(macro[1], macro[2])}
                min={0}
                max={macro[2]}
                now={macro[1]}
              />
            </div>
          ))}
          <Stack direction="horizontal" gap="2" className="mt-4">
            <Button
              variant="outline-primary"
              className="ms-auto"
              onClick={onAddActionClick}
            >
              Add New Entry
            </Button>
            <Button variant="outline-primary" onClick={onAddActionDBClick}>
              Select from Database
            </Button>
            <Button variant="outline-secondary" onClick={onViewActionsClick}>
              View History
            </Button>
          </Stack>
        </Card.Body>
      </Card>
    </>
  );
}
