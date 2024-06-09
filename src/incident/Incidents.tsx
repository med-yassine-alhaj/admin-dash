import { collection, getDocs, query, where } from "firebase/firestore";
import { databaseClient } from "../firebaseConfig";
import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { PiTruckThin } from "react-icons/pi";
import { AuthContext } from "../auth/AuthContext";

type Incident = {
  agentId: string;
  supervisorId: string;
  incident: string;
  timestamp: {
    toDate: () => Date;
  };
};

export const Incidents = () => {
  const authContext = useContext(AuthContext)!;
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const getIncidents = async () => {
    const incidentsCollection = collection(databaseClient, "incidents");

    const docSnap = query(
      incidentsCollection,
      where("supervisorId", "==", authContext.user?.uid),
    );

    await getDocs(docSnap).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        console.log(doc.data());
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
                  <PiTruckThin size={45} className="mb-3" />
                  <Card.Title>Id: {incident.agentId.slice(0, 10)}</Card.Title>
                  <Card.Text>
                    <div className="mb-1">message : {incident.incident}</div>
                    <div>
                      date : {incident.timestamp.toDate().toLocaleString()}
                    </div>
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
