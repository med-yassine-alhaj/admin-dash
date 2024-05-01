import toast from "react-hot-toast";
import { CiUser } from "react-icons/ci";
import { AgentDocument } from "./types";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { AjouterAgent } from "./AjouterAgent";
import { databaseClient } from "../firebaseConfig";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";

export const PageAgents = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [agents, setAgents] = useState<AgentDocument[]>([]);

  const getAgents = async () => {
    const agentsQuery = query(collection(databaseClient, "agents"));

    const querySnapshot = await getDocs(agentsQuery);

    const document = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as AgentDocument[];

    setAgents(document);
  };

  const deleteAgent = (id: string) => {
    deleteDoc(doc(databaseClient, "agents", id))
      .then(() => {
        setAgents(agents.filter(agent => agent.id !== id));
        toast.success("Agent supprimé avec succès");
      })
      .catch(_ => {
        toast.error("Erreur lors de la suppression d'agent");
      });
  };

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <div className="mt-5">
      <Container>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter Agent</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AjouterAgent hide={handleClose} ajouterAgent={agent => setAgents([...agents, agent])} />
          </Modal.Body>
        </Modal>

        <h3 className="mt-3">Liste des agents</h3>
        <Row className="mt-3" xs={2} md={8} lg={8}>
          {agents.map((agent, index) => {
            return (
              <Col sm={12} md={6} lg={4} key={index}>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <CiUser size={35} className="m-1" />

                    <Card.Title>nom: {agent.nom}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">prenom: {agent.prenom}</Card.Subtitle>
                    <Card.Text>
                      <div>Email: {agent.email}</div>
                      <div>Mot de passe: {agent.motDePasse}</div>
                      <span>Numero CIN : {agent.numeroCIN}</span>
                      <MdDelete
                        className="ms-5 mb-1"
                        size={25}
                        cursor="pointer"
                        onClick={() => deleteAgent(agent.id)}
                        color="red"
                      />
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Button className="mt-3" variant="primary" onClick={handleShow}>
          Ajouter Agent
        </Button>
      </Container>
    </div>
  );
};
