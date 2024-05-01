import { useState } from "react";
import { Button } from "react-bootstrap";
import { databaseClient } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import toast from "react-hot-toast";
import { PointDeCollect } from "./types";

type AjouterPointDeCollectProps = {
  hide: () => void;
  pointsDeCollect: {
    lat: number;
    lng: number;
  }[];
  ajouterPointDeCollect: (pointsDeCollect: PointDeCollect) => void;
};
export const AjouterPointDeCollect: React.FC<AjouterPointDeCollectProps> = ({ hide, ajouterPointDeCollect }) => {
  const [pointsDeCollect, setPointsDeCollect] = useState<
    {
      lat: number;
      lng: number;
    }[]
  >([]);

  const ajouterPointsDeCollectAuFireBase = async () => {
    await Promise.all(
      pointsDeCollect.map(async pointDeCollect => {
        const result = await addDoc(collection(databaseClient, "pointsDeCollect"), {
          ...pointDeCollect,
        });

        ajouterPointDeCollect({
          ...pointDeCollect,
          id: result.id,
        });
      })
    );

    toast.success("Point de collect ajouté avec succès");
    hide();
  };

  return (
    <div>
      <APIProvider apiKey={"AIzaSyD95hqdtsOTo0tnf2Nl1XdcISH-KopLxPc"}>
        <Map
          style={{
            width: "750px",
            height: "400px",
          }}
          defaultCenter={{ lat: 37, lng: 10 }}
          defaultZoom={8}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"mapAjout"}
          onClick={e => {
            if (e.detail.latLng?.lat && e.detail.latLng?.lng)
              setPointsDeCollect([
                ...pointsDeCollect,
                {
                  lat: e.detail.latLng?.lat,
                  lng: e.detail.latLng?.lng,
                },
              ]);
          }}
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
      <Button
        style={{
          marginTop: "20px",
        }}
        onClick={ajouterPointsDeCollectAuFireBase}
      >
        Ajouter
      </Button>
    </div>
  );
};
