import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { PiTruckThin } from "react-icons/pi";
import { Camion, CamionDocument } from "./type";
import { AjouterCamion } from "./AjouterCamion";
import { AuthContext } from "../auth/AuthContext";
import { databaseClient } from "../firebaseConfig";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";

export const PageCamions = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const authContext = useContext(AuthContext)!;

  const [camions, setCamions] = useState<CamionDocument[]>([]);

  const ajouterCamion = (camion: CamionDocument) => {
    setCamions([...camions, camion]);
  };

  const getCamions = async () => {
    try {
      const docRef = doc(databaseClient, "users", authContext.userId || "");

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const camions = data["camions"] as Camion[];

        console.log(camions);

        setCamions(camions);
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la récupération des camions");
    }
  };

  const deleteCamion = async (matricule: string) => {
    try {
      const docRef = doc(databaseClient, "users", authContext.userId || "");

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const camions = data["camions"] as Camion[];

        const updatedCamions = camions.filter(camion => camion.matricule !== matricule);

        await updateDoc(docRef, {
          camions: updatedCamions,
        });
        setCamions(camions.filter(camion => camion.matricule !== matricule));

        toast.success("Camion supprimé avec succès");
      }
    } catch {
      toast.error("Erreur lors de la suppression du camion");
    }
  };

  useEffect(() => {
    getCamions();
  }, []);

  return (
    <div className="mt-5">
      <Container>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter Camion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AjouterCamion ajouterCamion={ajouterCamion} hide={handleClose} />
          </Modal.Body>
        </Modal>

        <h3 className="mt-3 text-center">Liste des camions</h3>
        <Row className="mt-3" xs={2} md={8} lg={8}>
          {camions.map((camion, index) => {
            return (
              <Col sm={12} md={6} lg={4} key={index}>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <PiTruckThin size={45} className="m-1" />
                    <Card.Title>Matricule : {camion.matricule}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Info : {camion.marque + " " + camion.modele + " - " + camion.annee}
                    </Card.Subtitle>
                    <Card.Text>
                      <div>Poids : {camion.poids + " Kg"}</div>
                      <span>Charge Utile : {camion.chargeUtile + " Kg"}</span>
                      <MdDelete
                        className="ms-5 mb-1"
                        size={25}
                        cursor="pointer"
                        onClick={() => deleteCamion(camion.matricule)}
                      />
                    </Card.Text>
                    {/* <Card.Link href="#">Card Link</Card.Link> */}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Button className="mt-3" variant="primary" onClick={handleShow}>
          Ajouter Camion
        </Button>
      </Container>
    </div>
  );
};
