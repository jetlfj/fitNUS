import { useEffect, useState } from "react";
import { Alert, Button, Container, Spinner, Stack } from "react-bootstrap";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import Navtop from "../Navtop";
import PlanCard from "../cards/PlanCard";
import SuggestionCard from "../cards/SuggestionCard";
import AddActionModal from "../modals/AddActionModal";
import AddActionDBModal from "../modals/AddActionDBModal";
import SetDietModal from "../modals/SetDietModal";
import SetPlanModal from "../modals/SetPlanModal";
import ViewActionsModal from "../modals/ViewActionsModal";

export default function Dashboard() {
  const { currentUser } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [refreshFB, setRefreshFB] = useState(false);

  const [actions, setActions] = useState([]);
  const [foodbank, setFoodbank] = useState([]);
  const [intent, setIntent] = useState();
  const [macros, setMacros] = useState([["Calories", -1, -1]]);
  const [pref, setPref] = useState([]);
  const [userfoodbank, setUserfoodbank] = useState([]);

  const [showAddActionModal, setShowAddActionModal] = useState(false);
  const [showAddActionDBModal, setShowAddActionDBModal] = useState(false);
  const [showSetDietModal, setShowSetDietModal] = useState(false);
  const [showSetPlanModal, setShowSetPlanModal] = useState(false);
  const [showViewActionsModal, setShowViewActionsModal] = useState(false);

  const date = new Date().toLocaleDateString("en-SG").replace(/\//g, "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading || setLoading(true);
        setError("");

        let data = [
          ["Calories", 0, 0],
          ["Carbohydrates", 0, 0],
          ["Fats", 0, 0],
          ["Proteins", 0, 0],
        ];

        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        setIntent(docSnap.get("intent"));
        data[0][2] = docSnap.get("maxCalories") || 0;
        data[1][2] = docSnap.get("carbs");
        data[2][2] = docSnap.get("fats");
        data[3][2] = docSnap.get("proteins");

        const querySnapshot = await getDocs(
          query(
            collection(db, "users", currentUser.uid, date),
            orderBy("createdAt", "desc")
          )
        );

        let data2 = [];
        querySnapshot.forEach((doc) => {
          data2.push({ ...doc.data(), id: doc.id });
        });
        for (let i = 0; i < data2.length; i++) {
          data[0][1] += data2[i].calories;
          data[1][1] += data2[i].carbs;
          data[2][1] += data2[i].fats;
          data[3][1] += data2[i].proteins;
        }

        setMacros(data);
        setActions(data2);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading || setLoading(true);
        setError("");

        const docRef = await getDoc(doc(db, "users", currentUser.uid));
        let temp = docRef.get("preference");
        setPref(temp);

        const querySnapshot = await getDocs(
          query(collection(db, "foodbank"), orderBy("description"))
        );
        let data = [];
        querySnapshot.docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        for (let count = 0; count < temp.length; count++) {
          if (temp[count]) {
            data = data.filter((food) => food.restriction[count]);
          }
        }
        setFoodbank(data);

        const querySnapshot2 = await getDocs(
          query(
            collection(db, "users", currentUser.uid, "userfoodbank"),
            orderBy("description")
          )
        );
        let data2 = [];
        querySnapshot2.docs.forEach((doc) => {
          data2.push({ ...doc.data(), id: doc.id });
        });
        setUserfoodbank(data2);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFB]);

  return (
    <>
      <Navtop />
      <Container className="my-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Stack direction="horizontal" gap="2" className="mb-2">
          <h1>Tracking </h1>
          {loading && <Spinner animation="border" variant="primary" />}
          {macros[0][2] === 0 ? (
            <Button
              className="ms-auto"
              onClick={() => setShowSetPlanModal(true)}
            >
              Set Plan
            </Button>
          ) : (
            <>
              {macros[0][1] >= 0 && (
                <>
                  <Button
                    className="ms-auto"
                    variant="outline-primary"
                    onClick={() => setShowSetDietModal(true)}
                  >
                    Dietary Preferences
                  </Button>
                  <Button onClick={() => setShowSetPlanModal(true)}>
                    Set Plan
                  </Button>
                </>
              )}
            </>
          )}
        </Stack>
        {macros[0][2] === 0 ? (
          <h3>
            Press <b>Set Plan</b> to begin your dieting journey.
          </h3>
        ) : (
          <>
            {macros[0][1] >= 0 && (
              <Stack direction="vertical" gap="2" className="mb-4">
                <PlanCard
                  intent={intent}
                  macros={macros}
                  onAddActionClick={() => setShowAddActionModal(true)}
                  onAddActionDBClick={() => setShowAddActionDBModal(true)}
                  onViewActionsClick={() => setShowViewActionsModal(true)}
                />
                <SuggestionCard
                  foodbank={foodbank
                    .concat(userfoodbank)
                    .sort((a, b) => b.calories - a.calories)}
                  amount={macros[0][2] - macros[0][1]}
                  intent={intent}
                  refresh={refresh}
                />
              </Stack>
            )}
          </>
        )}
      </Container>
      <AddActionModal
        show={showAddActionModal}
        refresh={() => setRefresh(!refresh)}
        refreshFB={() => setRefreshFB(!refreshFB)}
        handleClose={() => setShowAddActionModal(false)}
      />
      <AddActionDBModal
        show={showAddActionDBModal}
        foodbank={foodbank}
        userfoodbank={userfoodbank}
        refresh={() => setRefresh(!refresh)}
        handleClose={() => setShowAddActionDBModal(false)}
      />
      <SetDietModal
        show={showSetDietModal}
        pref={pref}
        refresh={() => setRefreshFB(!refreshFB)}
        handleClose={() => setShowSetDietModal(false)}
      />
      <SetPlanModal
        show={showSetPlanModal}
        refresh={() => setRefresh(!refresh)}
        handleClose={() => setShowSetPlanModal(false)}
      />
      <ViewActionsModal
        show={showViewActionsModal}
        actions={actions}
        refresh={() => setRefresh(!refresh)}
        handleClose={() => setShowViewActionsModal(false)}
      />
    </>
  );
}
