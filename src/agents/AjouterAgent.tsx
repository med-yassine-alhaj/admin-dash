import toast from "react-hot-toast";
import React, { useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { Agent, AgentDocument } from "./types";
import { databaseClient } from "../firebaseConfig";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../auth/AuthContext";

type AjouterAgentProps = {
  ajouterAgent: (agent: AgentDocument) => void;
  hide: () => void;
};

export const AjouterAgent: React.FC<AjouterAgentProps> = ({
  ajouterAgent,
  hide,
}) => {
  const authContext = useContext(AuthContext)!;
  const [agent, setAgent] = React.useState<Agent>({
    nom: "",
    prenom: "",
    numeroCIN: "",
    email: "",
    telephone: "",
    motDePasse: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgent({
      ...agent,
      [e.target.id]: e.target.value,
    });
  };

  const AjouterAgent = async () => {
    const user = authContext.userId;

    if (!user) {
      toast.error("Erreur lors de l'ajout du camion");
      return;
    }

    await updateDoc(doc(databaseClient, "users", user), {
      agents: arrayUnion(agent),
    })
      .then(() => {
        ajouterAgent({
          ...agent,
        });
        toast.success("Camion ajouté avec succès");
        hide();
      })
      .catch(() => {
        toast.error("Erreur lors de l'ajout du camion");
      });
  };

  return (
    <Form>
      <Form.Group className="mb-3" controlId="nom">
        <Form.Label>Nom</Form.Label>
        <Form.Control onChange={handleChange} type="text" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="prenom">
        <Form.Label>Prenom</Form.Label>
        <Form.Control onChange={handleChange} type="text" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control onChange={handleChange} type="email" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="numeroCIN">
        <Form.Label>Numero CIN</Form.Label>
        <Form.Control onChange={handleChange} type="tel" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="telephone">
        <Form.Label>Telephone</Form.Label>
        <Form.Control onChange={handleChange} type="number" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="motDePasse">
        <Form.Label>Mot De Passe</Form.Label>
        <Form.Control onChange={handleChange} type="text" />
      </Form.Group>
      <Button
        style={{
          marginTop: "20px",
        }}
        onClick={AjouterAgent}
      >
        Ajouter
      </Button>
    </Form>
  );
};
