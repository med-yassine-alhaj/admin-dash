import toast from "react-hot-toast";
import { IoMapOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { databaseClient } from "../firebaseConfig";
import { useContext, useEffect, useState } from "react";
import { PointDeCollect } from "../PointDeCollect/types";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";

type Tournee = {
  id: string;
  agentId: string;
  pointsDeCollect: PointDeCollect[];
  agentName: string;
  supervisorId: string;
};

export const ListTournees = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext)!;
  const [tournees, setTournees] = useState<Tournee[]>([]);

  const getTournees = async () => {
    const usersCollection = collection(databaseClient, "tournees");
    const docSnap = query(usersCollection, where("supervisorId", "==", authContext.userId));

    await getDocs(docSnap).then(querySnapshot => {
      if (querySnapshot.empty) {
        toast.error("Aucune tournée trouvée");
      } else {
        console.log("tournees: ", querySnapshot.docs);
        querySnapshot.docs.forEach(doc => {
          setTournees([doc.data() as Tournee]);
        });
      }
    });
  };

  useEffect(() => {
    getTournees();
  }, []);

  return (
    <div className="mt-5">
      <Container>
        <h3 className="mt-3 text-center">Liste des tournées</h3>
        <Row className="mt-3" xs={2} md={8} lg={8}>
          {tournees.map((tournee, index) => {
            return (
              <Col sm={12} md={6} lg={4} key={index}>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <IoMapOutline size={35} className="m-1" />

                    <Card.Title>agent: {tournee.agentName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      points de collect: {tournee.pointsDeCollect.length}
                    </Card.Subtitle>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Button
          className="mt-3"
          onClick={() => {
            navigate("/tournees/ajouter");
          }}
        >
          Créer une tournée
        </Button>
      </Container>
    </div>
  );
};
