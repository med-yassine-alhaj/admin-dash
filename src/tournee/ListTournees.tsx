import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { IoMapOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { databaseClient } from "../firebaseConfig";
import { useContext, useEffect, useState } from "react";
import { PointDeCollect } from "../CentreDeDepot/types";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

type Tournee = {
  id: string;
  agentId: string;
  pointsDeCollect: PointDeCollect[];
  agentName: string;
  supervisorId: string;
  camionMatricule: string;
};

export const ListTournees = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext)!;
  const [tournees, setTournees] = useState<Tournee[]>([]);

  const getTournees = async () => {
    setTournees([]);

    const usersCollection = collection(databaseClient, "tournees");
    const docSnap = query(
      usersCollection,
      where("supervisorId", "==", authContext.userId),
    );

    await getDocs(docSnap).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const tournee = {
          id: doc.id,
          agentId: doc.data().agentId,
          pointsDeCollect: doc.data().pointsDeCollect,
          agentName: doc.data().agentName,
          supervisorId: doc.data().supervisorId,
          camionMatricule: doc.data().camionMatricule,
        };
        console.log(tournee);
        setTournees((prev) => [...prev, tournee]);
      });
    });
  };

  const deleteTournee = async (id: string) => {
    const tourneesCollection = collection(databaseClient, "tournees");
    await deleteDoc(doc(tourneesCollection, id));
    getTournees();
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
                    <IoMapOutline size={40} className="m-1 mb-3" />

                    <Card.Title className="mb-2">
                      agent: {tournee.agentName}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      <div className="mb-2">
                        points de collect: {tournee.pointsDeCollect.length}
                      </div>
                      <div>camion: {tournee.camionMatricule}</div>
                    </Card.Subtitle>
                    <div className="d-flex justify-content-end">
                      <MdDelete
                        size={25}
                        color="red"
                        className="mr-1 mb-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          deleteTournee(tournee.id);
                        }}
                      />
                    </div>
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
