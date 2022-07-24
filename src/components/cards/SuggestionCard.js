import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  InputGroup,
  Spinner,
  Stack,
} from "react-bootstrap";

export default function SuggestionCard({ amount, foodbank, intent }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [num, setNum] = useState(1);
  const [suggestions, setSuggestions] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      getSuggestion(parseInt(num));
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  function getSuggestion(num) {
    const smallest = foodbank[foodbank.length - 1].calories;
    const biggest = foodbank[0].calories;

    if (intent <= 1) {
      loseSuggestion(num, smallest);
    } else {
      bulkSuggestion(num, biggest);
    }
  }

  function bulkSuggestion(num, biggest) {
    let data = [];
    if (num === 1) {
      if (amount >= biggest) {
        data.push(foodbank.find((food) => food.calories === biggest));
        setSuggestions(data);
      } else {
        data.push(
          foodbank
            .slice()
            .reverse()
            .find((food) => food.calories >= amount)
        );
        setSuggestions(data);
      }
    } else if (num === 2) {
      let perfect = false;
      let diff = Number.MAX_VALUE;
      let f_start = foodbank.length - 2;
      let f_end = foodbank.length - 1;
      if (foodbank[0].calories + foodbank[1].calories <= amount) {
        data.push(foodbank[0], foodbank[1]);
        setSuggestions(data);
        return;
      }
      for (let curr = 0; curr < foodbank.length; curr++) {
        let start = curr;
        let end = foodbank.length - 1;
        while (start < end) {
          let sum = foodbank[start].calories + foodbank[end].calories;
          if (sum === amount) {
            f_start = start;
            f_end = end;
            perfect = true;
            break;
          }
          if (sum < diff && sum > amount) {
            f_start = start;
            f_end = end;
            diff = sum;
          }
          if (sum < amount) {
            end--;
          } else {
            start++;
          }
        }
        if (perfect) {
          break;
        }
      }
      data.push(foodbank[f_start], foodbank[f_end]);
      setSuggestions(data);
    } else {
      let f_first = foodbank.length - 3,
        f_second = foodbank.length - 2,
        f_third = foodbank.length - 1;
      let perfect = false;
      let diff = Number.MAX_VALUE;
      if (
        foodbank[0].calories + foodbank[1].calories + foodbank[2].calories <=
        amount
      ) {
        data.push(foodbank[0], foodbank[1], foodbank[2]);
        setSuggestions(data);
        return;
      }
      for (let curr = 0; curr < foodbank.length; curr++) {
        if (perfect) {
          break;
        }
        let first = curr;
        let second = curr + 1;
        let third = foodbank.length - 1;
        while (second < third) {
          let sum =
            foodbank[first].calories +
            foodbank[second].calories +
            foodbank[third].calories;
          if (sum === amount) {
            f_first = first;
            f_second = second;
            f_third = third;
            perfect = true;
            break;
          }
          if (sum < diff && sum > amount) {
            f_first = first;
            f_second = second;
            f_third = third;
            diff = sum;
          }
          if (sum < amount) {
            third--;
          } else {
            second++;
          }
        }
      }
      data.push(foodbank[f_first], foodbank[f_second], foodbank[f_third]);
      setSuggestions(data);
    }
  }

  function loseSuggestion(num, smallest) {
    let data = [];
    if (num === 1) {
      if (amount <= smallest) {
        data.push(foodbank.find((food) => food.calories === smallest));
        setSuggestions(data);
      } else {
        data.push(foodbank.find((food) => food.calories <= amount));
        setSuggestions(data);
      }
    } else if (num === 2) {
      let f_start = foodbank.length - 2;
      let f_end = foodbank.length - 1;
      let diff = Number.MIN_VALUE;
      let perfect = false;
      for (let curr = 0; curr < foodbank.length; curr++) {
        let start = curr;
        let end = foodbank.length - 1;
        while (start < end) {
          let sum = foodbank[start].calories + foodbank[end].calories;
          if (sum === amount) {
            f_start = start;
            f_end = end;
            perfect = true;
            break;
          }
          if (sum > diff && sum < amount) {
            f_start = start;
            f_end = end;
            diff = sum;
          }
          if (sum < amount) {
            end--;
          } else {
            start++;
          }
        }
        if (perfect) {
          break;
        }
      }
      data.push(foodbank[f_start], foodbank[f_end]);
      setSuggestions(data);
    } else {
      let f_first = foodbank.length - 3,
        f_second = foodbank.length - 2,
        f_third = foodbank.length - 1;
      let perfect = false;
      let diff = Number.MIN_VALUE;
      for (let curr = 0; curr < foodbank.length; curr++) {
        if (perfect) {
          break;
        }
        let first = curr;
        let second = curr + 1;
        let third = foodbank.length - 1;
        while (second < third) {
          let sum =
            foodbank[first].calories +
            foodbank[second].calories +
            foodbank[third].calories;
          if (sum === amount) {
            f_first = first;
            f_second = second;
            f_third = third;
            perfect = true;
            break;
          }
          if (sum > diff && sum < amount) {
            f_first = first;
            f_second = second;
            f_third = third;
            diff = sum;
          }
          if (sum < amount) {
            third--;
          } else {
            second++;
          }
        }
      }
      data.push(foodbank[f_first], foodbank[f_second], foodbank[f_third]);
      setSuggestions(data);
    }
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Stack
            direction="horizontal"
            className="d-flex justify-content-between align-items-baseline fw-normal mb-3"
          >
            <div>{amount} kcal left</div>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                {loading ? (
                  <Button disabled>
                    <Spinner as="span" animation="border" size="sm" />{" "}
                    Suggesting...
                  </Button>
                ) : (
                  <Button type="submit">Suggest</Button>
                )}
                <Form.Select onChange={(e) => setNum(e.target.value)}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </Form.Select>
                <InputGroup.Text>{num > 1 ? "meals" : "meal"}</InputGroup.Text>
              </InputGroup>
            </Form>
          </Stack>
        </Card.Title>
        {suggestions.length !== 0 ? (
          <>
            <Stack className="mb-2">
              {suggestions.map((food) => (
                <div key={food.id}>
                  {food.description} {food.calories} calories
                </div>
              ))}
            </Stack>
            <Button variant="outline-danger" onClick={() => setSuggestions([])}>
              Clear Suggestions
            </Button>
          </>
        ) : (
          <div>
            Press <b>Suggest</b> for meal recommendations.
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
