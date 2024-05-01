import toast from "react-hot-toast";
import { PointDeCollect } from "./types";
import { useEffect, useState } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { databaseClient } from "../firebaseConfig";
import { Button, Container, Modal } from "react-bootstrap";
import { AjouterPointDeCollect } from "./AjouterPointDeCollect";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";

type PointDeCollectDocument = PointDeCollect & { id: string };

export const PagePointDeCollect = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [pointsDeCollect, setPointsDeCollect] = useState<PointDeCollect[]>([]);

  const ajouterPointDeCollect = (pointDeCollect: PointDeCollect) => {
    setPointsDeCollect([...pointsDeCollect, pointDeCollect]);
  };

  const getPointsDeCollect = async () => {
    const pointDeCollectQuery = query(collection(databaseClient, "pointsDeCollect"));

    const querySnapshot = await getDocs(pointDeCollectQuery);

    const document = querySnapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    }) as PointDeCollectDocument[];

    setPointsDeCollect(document);
  };

  const deletePointDeCollect = (id: string) => {
    deleteDoc(doc(databaseClient, "camions", id))
      .then(() => {
        setPointsDeCollect(pointsDeCollect.filter(camion => camion.id !== id));
        toast.success("Point de collect supprimé avec succès");
      })
      .catch(_ => {
        toast.error("Erreur lors de la suppression de point de collect");
      });
  };

  useEffect(() => {
    getPointsDeCollect();
  }, []);

  // AIzaSyD95hqdtsOTo0tnf2Nl1XdcISH-KopLxPc

  return (
    <div className="mt-5">
      <Container>
        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter Point de collect</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AjouterPointDeCollect
              ajouterPointDeCollect={ajouterPointDeCollect}
              hide={handleClose}
              pointsDeCollect={pointsDeCollect}
            />
          </Modal.Body>
        </Modal>

        <h3 className="mt-3">Liste des Points de Collect</h3>

        <Button
          style={{
            marginBottom: "20px",
          }}
          onClick={handleShow}
        >
          Ajouter
        </Button>

        <div style={{ height: "100vh", width: "100%" }}>
          <APIProvider apiKey={"AIzaSyD95hqdtsOTo0tnf2Nl1XdcISH-KopLxPc"}>
            <Map
              defaultCenter={{ lat: 37, lng: 10 }}
              defaultZoom={8}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
              mapId={"map1"}
            >
              {pointsDeCollect.map((pointDeCollect, index) => {
                return (
                  <AdvancedMarker
                    key={index}
                    zIndex={1000}
                    position={{ lat: pointDeCollect.lat, lng: pointDeCollect.lng }}
                  />
                );
              })}
            </Map>
          </APIProvider>
        </div>
      </Container>
    </div>
  );
};
