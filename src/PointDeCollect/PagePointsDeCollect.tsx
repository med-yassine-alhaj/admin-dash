import { PointDeCollect } from "./types";
import { useEffect, useId, useState } from "react";
import { databaseClient } from "../firebaseConfig";
import { Button, Form } from "react-bootstrap";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
} from "firebase/firestore";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import toast from "react-hot-toast";
import { IoMdRemoveCircleOutline } from "react-icons/io";

type PointDeCollectDocument = PointDeCollect & { id: string };

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
          La Liste Des Points De Collect
        </div>
        <GoogleMapVisgl />
      </div>
    </>
  );
};

const GoogleMapVisgl = () => {
  const [newCollectionPoint, setNewCollectionPoint] =
    useState<PointDeCollect | null>(null);

  const [pointsDeCollect, setPointsDeCollect] = useState<PointDeCollect[]>([]);

  const ajouterPointDeCollect = (pointDeCollect: PointDeCollect) => {
    setPointsDeCollect([...pointsDeCollect, pointDeCollect]);
  };

  const removeCollectionPoint = (id: string) => {
    setPointsDeCollect(pointsDeCollect.filter((p) => p.id !== id));
  };

  const getPointsDeCollect = async () => {
    const pointDeCollectQuery = query(
      collection(databaseClient, "pointsDeCollect"),
    );

    const querySnapshot = await getDocs(pointDeCollectQuery);

    const document = querySnapshot.docs.map((doc) => {
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
    <APIProvider apiKey={"AIzaSyDXdXXNJTBEKGgZWNm-bYhrUDz6_3gysTY"}>
      <Map
        style={{ width: "100%", height: "80vh" }}
        defaultCenter={{ lat: 36.8, lng: 10.18 }}
        defaultZoom={13}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={"someId"}
        mapTypeId="hybrid"
        onClick={(e) => {
          if (e.detail.latLng)
            setNewCollectionPoint({
              id: "",
              lat: e.detail.latLng?.lat,
              lng: e.detail.latLng?.lng,
            });
        }}
      >
        {pointsDeCollect.map((pointDeCollect) => {
          return (
            <MarkerVisglWrapper
              deleteCollectionPoint={removeCollectionPoint}
              pointDeCollect={pointDeCollect}
            />
          );
        })}

        {newCollectionPoint && (
          <NewCollectionPointMarker
            pointDeCollect={newCollectionPoint}
            addCollectionPoint={ajouterPointDeCollect}
          />
        )}
      </Map>
    </APIProvider>
  );
};

type MarkerVisglWrapperProps = {
  pointDeCollect: PointDeCollect;
  deleteCollectionPoint: (id: string) => void;
};

const MarkerVisglWrapper: React.FC<MarkerVisglWrapperProps> = ({
  pointDeCollect,
  deleteCollectionPoint,
}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const removeCollectionPoint = () => {
    deleteDoc(doc(databaseClient, "pointsDeCollect", pointDeCollect.id))
      .then(() => {
        toast.success("point de collect supprimé avec succès");
        deleteCollectionPoint(pointDeCollect.id);
      })
      .catch(() =>
        toast.error("Erreur lors de la suppression du point de collect"),
      );
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
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
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
            onClick={() => removeCollectionPoint()}
            color="red"
            size={30}
            cursor="pointer"
          />
        </InfoWindow>
      )}
      <Pin
        background={"#0f9d58"}
        borderColor={"#006425"}
        glyphColor={"#60d98f"}
      />
    </AdvancedMarker>
  );
};

type NewCollectionPointMarkerProps = {
  pointDeCollect: PointDeCollect;
  addCollectionPoint: (collectionPoint: PointDeCollect) => void;
};

const NewCollectionPointMarker: React.FC<NewCollectionPointMarkerProps> = ({
  pointDeCollect,
  addCollectionPoint,
}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [name, setName] = useState<string>("");

  const addNewCollectionPoint = async () => {
    const result = await addDoc(collection(databaseClient, "pointsDeCollect"), {
      lat: pointDeCollect.lat,
      lng: pointDeCollect.lng,
      nom: name,
    });

    toast.success("Point de collect ajouté avec succès");

    addCollectionPoint({
      id: result.id,
      lat: pointDeCollect.lat,
      lng: pointDeCollect.lng,
      nom: name,
    });

    setName("");

    setInfowindowOpen(false);
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
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Nom du point de collect"
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
      <Pin
        background={"#ff0000"}
        borderColor={"#ff4433"}
        glyphColor={"#E34234"}
      />
    </AdvancedMarker>
  );
};
