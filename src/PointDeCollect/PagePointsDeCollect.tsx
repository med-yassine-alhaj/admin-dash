import { PointDeCollect } from "./types";
import { useEffect, useState } from "react";
import { databaseClient } from "../firebaseConfig";
import { Button, Container, Modal } from "react-bootstrap";
import { AjouterPointDeCollect } from "./AjouterPointDeCollect";
import { collection, getDocs, query } from "firebase/firestore";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

type PointDeCollectDocument = PointDeCollect & { id: string };

const limeOptions = { color: "blue" };

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

  useEffect(() => {
    getPointsDeCollect();
  }, []);

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
        <MapContainer center={[37, 10]} zoom={12} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {pointsDeCollect.map((pointDeCollect, index) => {
            return <Marker key={index} position={[pointDeCollect.lat, pointDeCollect.lng]}></Marker>;
          })}

          <Polyline pathOptions={limeOptions} positions={pointsDeCollect.map(pdc => [pdc.lat, pdc.lng])} />
        </MapContainer>
      </Container>
    </div>
  );
};
