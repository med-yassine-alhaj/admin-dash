import { useId, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { APIProvider, AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import { authClient, databaseClient } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

export const AddUser = () => {
  const [input, setInput] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    ville: "",
    lat: 0,
    lng: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  const setLatLng = (lat: number, lng: number) => {
    setInput({
      ...input,
      lat: lat,
      lng: lng,
    });
  };

  const handleSubmit = async () => {
    // save user to firebase auth
    try {
      const data = await createUserWithEmailAndPassword(authClient, input.email, input.password);

      const user: {
        id: string;
        nom: string;
        prenom: string;
        ville: {
          nom: string;
          lat: number;
          lng: number;
        };
        agents: [];
        camions: [];
        pointsDeCollect: [];
      } = {
        id: data.user.uid,
        nom: input.nom,
        prenom: input.prenom,
        ville: {
          nom: input.ville,
          lat: input.lat,
          lng: input.lng,
        },
        agents: [],
        camions: [],
        pointsDeCollect: [],
      };

      // save user to firestore
      await addDoc(collection(databaseClient, "users"), {
        ...user,
      });

      toast.success("Utilisateur ajouté avec succès");
    } catch (e) {
      toast.error("Erreur lors de l'ajout de l'utilisateur");
    }
  };

  return (
    <div
      style={{
        padding: "40px 100px",
      }}
    >
      <h1>Ajouter un utilisateur</h1>
      <Form
        style={{
          marginBottom: "50px",
        }}
      >
        <Form.Group className="mb-3" controlId="nom">
          <Form.Label>First name</Form.Label>
          <Form.Control onChange={handleChange} type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="prenom">
          <Form.Label>Last name</Form.Label>
          <Form.Control onChange={handleChange} type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control onChange={handleChange} type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={handleChange} type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="ville">
          <Form.Label>City</Form.Label>
          <Form.Control onChange={handleChange} type="text" />
        </Form.Group>
        Selectionner la position du ville sur la carte
        <GoogleMapVisgl setLatLng={setLatLng} latLng={{ lat: input.lat, lng: input.lng }} />
        <Button
          style={{
            marginTop: "20px",
          }}
          onClick={handleSubmit}
        >
          Ajouter
        </Button>
      </Form>
    </div>
  );
};

type GoogleMapVisglProps = {
  setLatLng: (lat: number, lng: number) => void;
  latLng: { lat: number; lng: number };
};

const GoogleMapVisgl: React.FC<GoogleMapVisglProps> = ({ setLatLng, latLng }) => {
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
        onClick={e => {
          if (e.detail.latLng) setLatLng(e.detail.latLng.lat, e.detail.latLng.lng);
        }}
      >
        {latLng && <NewCollectionPointMarker pointDeCollect={latLng} />}
      </Map>
    </APIProvider>
  );
};

type NewCollectionPointMarkerProps = {
  pointDeCollect: { lat: number; lng: number };
};

const NewCollectionPointMarker: React.FC<NewCollectionPointMarkerProps> = ({ pointDeCollect }) => {
  return (
    <AdvancedMarker
      key={useId()}
      position={{ lat: pointDeCollect.lat, lng: pointDeCollect.lng }}
      title={"AdvancedMarker that opens an Infowindow when clicked."}
    >
      <Pin background={"#ff0000"} borderColor={"#ff4433"} glyphColor={"#E34234"} />
    </AdvancedMarker>
  );
};
