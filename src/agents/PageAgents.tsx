import toast from "react-hot-toast";
import { CiUser } from "react-icons/ci";
import { Agent, AgentDocument } from "./types";
import { MdDelete } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { AjouterAgent } from "./AjouterAgent";
import { databaseClient } from "../firebaseConfig";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../auth/AuthContext";

export const PageAgents = () => {
  const authContext = useContext(AuthContext)!;
  const [agents, setAgents] = useState<AgentDocument[]>([]);

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const getAgents = async () => {
    try {
      const docRef = doc(databaseClient, "users", authContext.userId || "");

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const agentsData = data["agents"] as Agent[];

        setAgents(agentsData);
      }
    } catch (e) {
      toast.error("Erreur lors de la récupération des agents");
    }
  };

  const deleteAgent = async (email: string) => {
    try {
      // delete agent from database
      const docRef = doc(databaseClient, "users", authContext.userId || "");

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const agents = data["agents"] as Agent[];

        const updatedAgents = agents.filter((agent) => agent.email !== email);

        await updateDoc(docRef, {
          agents: updatedAgents,
        });

        setAgents(agents.filter((agent) => agent.email !== email));

        toast.success("agent supprimé avec succès");
      }
      // delete agent from authentication system
    } catch (e) {
      toast.error("Erreur lors de la suppression du agent");
    }
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
            <AjouterAgent
              hide={handleClose}
              ajouterAgent={(agent) => setAgents([...agents, agent])}
            />
          </Modal.Body>
        </Modal>

        <h3 className="mt-3 text-center">Liste des agents</h3>
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
                      <div>Email: {agent.email}</div>
                      <div>Mot de passe: {agent.motDePasse}</div>
                      <span>Numero CIN : {agent.numeroCIN}</span>
                      <MdDelete
                        className="ms-5 mb-1"
                        size={25}
                        cursor="pointer"
                        onClick={() => deleteAgent(agent.email)}
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
