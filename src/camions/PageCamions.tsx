import { CamionDocument } from "./type";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { PiTruckThin } from "react-icons/pi";
import { AjouterCamion } from "./AjouterCamion";
import { databaseClient } from "../firebaseConfig";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";

export const PageCamions = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [camions, setCamions] = useState<CamionDocument[]>([]);

  const ajouterCamion = (camion: CamionDocument) => {
    setCamions([...camions, camion]);
  };

  const getCamions = async () => {
    const camionsQuery = query(collection(databaseClient, "camions"));

    const querySnapshot = await getDocs(camionsQuery);

    const document = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as CamionDocument[];

    setCamions(document);
  };

  const deleteCamion = (id: string) => {
    deleteDoc(doc(databaseClient, "camions", id))
      .then(() => {
        setCamions(camions.filter(camion => camion.id !== id));
        toast.success("Camion supprimé avec succès");
      })
      .catch(_ => {
        toast.error("Erreur lors de la suppression du camion");
      });
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

        <h3 className="mt-3">Liste des camions</h3>
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
                        onClick={() => deleteCamion(camion.id)}
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
