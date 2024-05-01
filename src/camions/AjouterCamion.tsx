import toast from "react-hot-toast";
import React, { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Camion, CamionDocument } from "./type";
import { databaseClient } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

type AjouterCamionProps = {
  ajouterCamion: (camion: CamionDocument) => void;
  hide: () => void;
};

export const AjouterCamion: React.FC<AjouterCamionProps> = ({ ajouterCamion, hide }) => {
  const [camion, setCamion] = React.useState<Camion>({
    matricule: "",
    marque: "",
    modele: "",
    annee: 0,
    poids: 0,
    chargeUtile: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCamion({
      ...camion,
      [e.target.id]: e.target.value,
    });
  };

  const AjouterCamion = async () => {
    const result = await addDoc(collection(databaseClient, "camions"), {
      ...camion,
    });

    if (result) {
      ajouterCamion({
        ...camion,
        id: result.id,
      });
      toast.success("Camion ajouté avec succès");
      hide();
    } else toast.error("Erreur lors de l'ajout du camion");
  };

  useEffect(() => {
    console.log(camion);
  }, [camion]);

  return (
    <Form>
      <Form.Group className="mb-3" controlId="matricule">
        <Form.Label>Matricule</Form.Label>
        <Form.Control onChange={handleChange} type="text" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="marque">
        <Form.Label>Marque</Form.Label>
        <Form.Control onChange={handleChange} type="text" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="modele">
        <Form.Label>Modele</Form.Label>
        <Form.Control onChange={handleChange} type="text" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="annee">
        <Form.Label>Annee</Form.Label>
        <Form.Control onChange={handleChange} type="date" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="poids">
        <Form.Label>poids (en Kg)</Form.Label>
        <Form.Control onChange={handleChange} type="number" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="chargeUtile">
        <Form.Label>Charge Utile (en Kg)</Form.Label>
        <Form.Control onChange={handleChange} type="number" />
      </Form.Group>
      <Button
        style={{
          marginTop: "20px",
        }}
        onClick={AjouterCamion}
      >
        Ajouter
      </Button>
    </Form>
  );
};
