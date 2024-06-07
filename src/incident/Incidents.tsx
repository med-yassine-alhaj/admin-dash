import { collection, getDocs, query } from "firebase/firestore";
import { databaseClient } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { PiTruckThin } from "react-icons/pi";

type Incident = {
  agentId: string;
  incident: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
};

export const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const getIncidents = async () => {
    const incidentsCollection = collection(databaseClient, "incidents");
    const docSnap = query(incidentsCollection);

    await getDocs(docSnap).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        setIncidents((prevIncidents) => [
          ...prevIncidents,
          doc.data() as Incident,
        ]);
      });
    });
  };

  useEffect(() => {
    setIncidents([]);
    getIncidents();
  }, []);

  return (
    <Container>
      <h3 className="mt-3 text-center">Liste des incidents</h3>
      <Row className="mt-3" xs={2} md={8} lg={8}>
        {incidents.map((incident, index) => {
          return (
            <Col sm={12} md={6} lg={4} key={index}>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <PiTruckThin size={45} className="m-1" />
                  <Card.Title>Id: {incident.agentId.slice(0,10)}</Card.Title>
                  <Card.Text>
                    <div>message : {incident.incident}</div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};
