import { CiUser } from "react-icons/ci";
import { useEffect, useState } from "react";
import { databaseClient } from "../firebaseConfig";
import { Card, Col, Container, Row } from "react-bootstrap";
import { collection, getDocs, query } from "firebase/firestore";

type UserDocument = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  ville: {
    nom: string;
    lat: number;
    lng: number;
  };
};

export const UsersPage = () => {
  const [agents, setAgents] = useState<UserDocument[]>([]);

  const getAgents = async () => {
    const agentsQuery = query(collection(databaseClient, "users"));

    const querySnapshot = await getDocs(agentsQuery);

    const document = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as UserDocument[];

    setAgents(document);
  };

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <div className="mt-5">
      <Container>
        <h3 className="mt-3">List Of Users</h3>
        <Row className="mt-3" xs={2} md={8} lg={8}>
          {agents.map((agent, index) => {
            return (
              <Col sm={12} md={6} lg={4} key={index}>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <CiUser size={35} className="m-1" />

                    <Card.Title>nom: {agent.nom}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      prenom: {agent.prenom}
                    </Card.Subtitle>
                    <Card.Text>
                      <div>ville: {agent.ville.nom.toString()}</div>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};
