import { PointDeCollect } from "./types";
import { useContext, useEffect, useId, useState } from "react";
import { databaseClient } from "../firebaseConfig";
import { Button, Form } from "react-bootstrap";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { AuthContext } from "../auth/AuthContext";

import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";

export const PagePointDeCollect = () => {
  return (
    <>
      <div
        style={{
          overflow: "hidden",
          padding: "20px 20px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: "20px",
            marginBottom: "20px",
          }}
        >
          <h3 className="mt-3 text-center">La Liste Des Points De Collect</h3>
        </div>
        <GoogleMapVisgl />
      </div>
    </>
  );
};

const GoogleMapVisgl = () => {
  const [defaultCenter, setDefaultCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [newCollectionPoint, setNewCollectionPoint] = useState<PointDeCollect | null>(null);

  const [pointsDeCollect, setPointsDeCollect] = useState<PointDeCollect[]>([]);

  const authContext = useContext(AuthContext)!;

  const ajouterPointDeCollect = (pointDeCollect: PointDeCollect) => {
    setPointsDeCollect([...pointsDeCollect, pointDeCollect]);
  };

  const removeCollectionPoint = (name: string) => {
    setPointsDeCollect(pointsDeCollect.filter(p => p.nom !== name));
  };

  const getPointsDeCollect = async () => {
    try {
      const docRef = doc(databaseClient, "users", authContext.userId || "");

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const collectionPoints = data["pointsDeCollect"] as PointDeCollect[];

        const placeCoords = data["ville"] as {
          lat: number;
          lng: number;
          nom: string;
        };

        setDefaultCenter({
          lat: placeCoords.lat,
          lng: placeCoords.lng,
        });

        setPointsDeCollect(collectionPoints);
      }
    } catch (e) {
      toast.error("Erreur lors de la récupération des points de collecte");
    }
  };

  useEffect(() => {
    getPointsDeCollect();
  }, []);

  return defaultCenter ? (
    <APIProvider apiKey={"AIzaSyDXdXXNJTBEKGgZWNm-bYhrUDz6_3gysTY"}>
      <Map
        style={{ width: "100%", height: "80vh" }}
        defaultCenter={defaultCenter}
        defaultZoom={16}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={"someId"}
        mapTypeId="hybrid"
        onClick={e => {
          if (e.detail.latLng)
            setNewCollectionPoint({
              lat: e.detail.latLng?.lat,
              lng: e.detail.latLng?.lng,
            });
        }}
      >
        {pointsDeCollect.map(pointDeCollect => {
          return <MarkerVisglWrapper deleteCollectionPoint={removeCollectionPoint} pointDeCollect={pointDeCollect} />;
        })}

        {newCollectionPoint && (
          <NewCollectionPointMarker pointDeCollect={newCollectionPoint} addCollectionPoint={ajouterPointDeCollect} />
        )}
      </Map>
    </APIProvider>
  ) : (
    ""
  );
};

type MarkerVisglWrapperProps = {
  pointDeCollect: PointDeCollect;
  deleteCollectionPoint: (id: string) => void;
};

const MarkerVisglWrapper: React.FC<MarkerVisglWrapperProps> = ({ pointDeCollect, deleteCollectionPoint }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const authContext = useContext(AuthContext)!;

  const removeCollectionPoint = async (name: string) => {
    try {
      const docRef = doc(databaseClient, "users", authContext.userId || "");

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const collectionPoints = data["pointsDeCollect"] as PointDeCollect[];

        const updatedCollectionPoints = collectionPoints.filter(collectionPoint => collectionPoint.nom !== name);

        await updateDoc(docRef, {
          pointsDeCollect: updatedCollectionPoints,
        });

        deleteCollectionPoint(pointDeCollect.nom || "");

        toast.success("Camion supprimé avec succès");
      }
    } catch {
      toast.error("Erreur lors de la suppression du camion");
    }
  };

  return (
    <AdvancedMarker
      ref={markerRef}
      key={useId()}
      position={{ lat: pointDeCollect.lat, lng: pointDeCollect.lng }}
      title={"AdvancedMarker that opens an Infowindow when clicked."}
      onClick={() => setInfowindowOpen(true)}
    >
      {infowindowOpen && (
        <InfoWindow anchor={marker} maxWidth={200} onCloseClick={() => setInfowindowOpen(false)}>
          <span
            style={{
              marginRight: "10px",
              fontSize: "15px",
              fontWeight: "600",
              padding: "0",
            }}
          >
            Nom: {pointDeCollect.nom}
          </span>
          <IoMdRemoveCircleOutline
            onClick={() => removeCollectionPoint(pointDeCollect.nom || "")}
            color="red"
            size={30}
            cursor="pointer"
          />
        </InfoWindow>
      )}
      <Pin background={"#0f9d58"} borderColor={"#006425"} glyphColor={"#60d98f"} />
    </AdvancedMarker>
  );
};

type NewCollectionPointMarkerProps = {
  pointDeCollect: PointDeCollect;
  addCollectionPoint: (collectionPoint: PointDeCollect) => void;
};

const NewCollectionPointMarker: React.FC<NewCollectionPointMarkerProps> = ({ pointDeCollect, addCollectionPoint }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [name, setName] = useState<string>("");
  const authContext = useContext(AuthContext)!;

  const addNewCollectionPoint = async () => {
    const user = authContext.userId;

    if (!user) {
      toast.error("Erreur lors de l'ajout du camion");
      return;
    }

    await updateDoc(doc(databaseClient, "users", user), {
      pointsDeCollect: arrayUnion({
        lat: pointDeCollect.lat,
        lng: pointDeCollect.lng,
        nom: name,
      }),
    })
      .then(() => {
        addCollectionPoint({
          lat: pointDeCollect.lat,
          lng: pointDeCollect.lng,
          nom: name,
        });

        setName("");

        setInfowindowOpen(false);
        toast.success("Camion ajouté avec succès");
      })
      .catch(() => {
        toast.error("Erreur lors de l'ajout du camion");
      });
  };

  useEffect(() => {
    return () => {
      setInfowindowOpen(false);
    };
  }, []);
  return (
    <AdvancedMarker
      ref={markerRef}
      key={useId()}
      position={{ lat: pointDeCollect.lat, lng: pointDeCollect.lng }}
      title={"AdvancedMarker that opens an Infowindow when clicked."}
      onClick={() => setInfowindowOpen(true)}
    >
      {infowindowOpen && (
        <InfoWindow anchor={marker} minWidth={400}>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Nom du point de collect"
            id="name"
            name="name"
            autoComplete="off"
          />
          <Button
            variant="primary"
            style={{
              marginTop: "5px",
              width: "100%",
            }}
            onClick={addNewCollectionPoint}
          >
            Ajouter
          </Button>
        </InfoWindow>
      )}
      <Pin background={"#ff0000"} borderColor={"#ff4433"} glyphColor={"#E34234"} />
    </AdvancedMarker>
  );
};
