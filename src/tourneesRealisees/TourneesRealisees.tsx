import { collection, getDocs, query } from "firebase/firestore";
import { databaseClient } from "../firebaseConfig";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, Col, Container, Row } from "react-bootstrap";
import { IoMapOutline } from "react-icons/io5";

type TourneeRealisee = {
  agentId: string;
  date: {
    seconds: number;
  };
  id: string;
  lat: number;
  lng: number;
  images: string[];
  agentNom?: string;
  agentPrenom?: string;
};

export const TourneesRealisees = () => {
  const [tourneesRealisees, setTourneesRealisees] = useState<TourneeRealisee[]>(
    [],
  );

  // const authContext = useContext(AuthContext)!;

  const getTournees = async () => {
    const usersCollection = collection(databaseClient, "tourneesRealisees");
    const docSnap = query(usersCollection);

    await getDocs(docSnap).then((querySnapshot) => {
      if (querySnapshot.empty) {
        toast.error("Aucune tournée realisée trouvée");
      } else {
        querySnapshot.docs.map((doc) => {
          const currentTournee = doc.data() as TourneeRealisee;
          currentTournee.images = [];
          setTourneesRealisees((prev) => [...prev, currentTournee]);
        });
      }
    });

    const photos = collection(databaseClient, "images");
    const photoSnap = query(photos);
    getDocs(photoSnap).then((querySnapshot) => {
      querySnapshot.docs.forEach((img) => {
        const currentImage = img.data();

        setTourneesRealisees((prev) => {
          const newTournees = prev.map((tournee) => {
            if (tournee.id === currentImage.tourneeId) {
              return {
                ...tournee,
                images: [...tournee.images, currentImage.imageUrl],
              };
            }
            return tournee;
          });
          return newTournees;
        });
      });
    });

    const agents = collection(databaseClient, "agents");
    const agentSnap = query(agents);
    getDocs(agentSnap).then((querySnapshot) => {
      querySnapshot.docs.forEach((agent) => {
        const currentAgent = agent.data();
        console.log(currentAgent);
        setTourneesRealisees((prev) => {
          const newTournees = prev.map((tournee) => {
            if (tournee.agentId === currentAgent.id) {
              return {
                ...tournee,
                agentNom: currentAgent.nom,
                agentPrenom: currentAgent.prenom,
              };
            }
            return tournee;
          });
          return newTournees;
        });
      });
    });
  };

  useEffect(() => {
    setTourneesRealisees([]);
    getTournees();
  }, []);

  useEffect(() => {
    console.log(tourneesRealisees);
  }, [tourneesRealisees]);

  return (
    <div className="mt-5">
      <Container>
        <h3 className="mt-3 text-center">Liste des tournées realisees</h3>
        <Row className="mt-3" xs={2} md={8} lg={8}>
          {tourneesRealisees.map((tournee, index) => {
            return (
              <Col sm={12} md={6} lg={4} key={index}>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <IoMapOutline size={35} className="m-1" />

                    <Card.Title>
                      agent: {tournee.agentNom} {tournee.agentPrenom}
                      {tournee.images.map((img) => {
                        return (
                          <img
                            key={img}
                            src={img}
                            alt="tournee"
                            style={{
                              width: "100px",
                              height: "100px",
                              padding: "5px",
                            }}
                          />
                        );
                      })}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      <div>images prises: {tournee.images.length}</div>

                      <div>
                        date: {new Date(tournee.date.seconds).toLocaleString()}
                      </div>
                    </Card.Subtitle>
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
