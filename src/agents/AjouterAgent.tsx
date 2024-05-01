import toast from "react-hot-toast";
import React, { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Agent, AgentDocument } from "./types";
import { databaseClient } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

type AjouterAgentProps = {
  ajouterAgent: (agent: AgentDocument) => void;
  hide: () => void;
};

export const AjouterAgent: React.FC<AjouterAgentProps> = ({ ajouterAgent, hide }) => {
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
    const result = await addDoc(collection(databaseClient, "agents"), {
      ...agent,
    });

    if (result) {
      ajouterAgent({
        ...agent,
        id: result.id,
      });
      hide();

      toast.success("Agent ajouté avec succès");
    } else toast.error("Erreur lors de l'ajout du Agent");
  };

  useEffect(() => {
    console.log(agent);
  }, [agent]);

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
