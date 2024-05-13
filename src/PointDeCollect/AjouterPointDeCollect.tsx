import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "react-bootstrap";
import { PointDeCollect } from "./types";
import { databaseClient } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type AjouterPointDeCollectProps = {
  hide: () => void;
  pointsDeCollect: {
    lat: number;
    lng: number;
  }[];
  ajouterPointDeCollect: (pointsDeCollect: PointDeCollect) => void;
};

const LocationMarker: React.FC<{
  position: [number, number][];
  setPosition: (positions: [number, number][]) => void;
}> = ({ position, setPosition }) => {
  useMapEvents({
    click: e => {
      setPosition([...position, [e.latlng.lat, e.latlng.lng]]);
    },
  });

  return position.map((position, index) => {
    return <Marker key={index} position={position}></Marker>;
  });
};
export const AjouterPointDeCollect: React.FC<AjouterPointDeCollectProps> = ({ hide, ajouterPointDeCollect }) => {
  const [position, setPosition] = useState<[number, number][]>([]);

  const ajouterPointsDeCollectAuFireBase = async () => {
    await Promise.all(
      position.map(async pointDeCollect => {
        const result = await addDoc(collection(databaseClient, "pointsDeCollect"), {
          lat: pointDeCollect[0],
          lng: pointDeCollect[1],
        });

        ajouterPointDeCollect({
          id: result.id,
          lat: pointDeCollect[0],
          lng: pointDeCollect[1],
        });
      })
    );

    toast.success("Point de collect ajouté avec succès");
    hide();
  };

  return (
    <div>
      <MapContainer center={[37, 10]} zoom={8} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <Button style={{ marginTop: "20px" }} onClick={ajouterPointsDeCollectAuFireBase}>
        Ajouter
      </Button>
    </div>
  );
};
