import toast from "react-hot-toast";
import { Button, Form } from "react-bootstrap";
import { AuthContext } from "../auth/AuthContext";
import { databaseClient } from "../firebaseConfig";
import { Agent, AgentDocument } from "../agents/types";
import { PointDeCollect } from "../PointDeCollect/types";
import { useContext, useEffect, useId, useState } from "react";
import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { APIProvider, AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";

export const Tournee = () => {
  const [agents, setAgents] = useState<AgentDocument[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [agentName, setAgentName] = useState<string>("");

  const authContext = useContext(AuthContext)!;

  const [selected, setSelected] = useState<PointDeCollect[]>([]);
  const addCollectionPoint = (collectionPoint: PointDeCollect) => {
    if (selected.find(p => p.nom === collectionPoint.nom)) {
      setSelected(selected.filter(p => p.nom !== collectionPoint.nom));
      return;
    }
    setSelected(prev => [...prev, collectionPoint]);
  };

  const createTournee = async () => {
    try {
      const docRef = doc(databaseClient, "users", authContext.userId || "");

      await updateDoc(docRef, {
        tournees: arrayUnion({
          agentId: selectedAgentId,
          agentName: agentName,
          pointsDeCollect: selected,
          supervisorId: authContext.userId,
        }),
      });

      await addDoc(collection(databaseClient, "tournees"), {
        agentId: selectedAgentId,
        agentName: agentName,
        pointsDeCollect: selected,
        supervisorId: authContext.userId,
      });

      toast.success("Tournée créée avec succès");
    } catch (e) {
      console.log(e);
      toast.error("Erreur lors de la création de la tournée");
    }
  };

  const getAgents = async () => {
    try {
      const docRef = doc(databaseClient, "users", authContext.userId || "");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const agentsData = data["agents"] as Agent[];

        setAgents(agentsData);
      }
    } catch (e) {
      toast.error("Erreur lors de la récupération des agents");
    }
  };

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <>
      <h3 className="mt-3 text-center">Créer une tournée</h3>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          margin: "auto",
          marginTop: "20px",
          width: "70%",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          Choisir les agents
        </p>
        <Form.Select
          onChange={e => {
            console.log(e.target.value);
            if (e.target.value === "Choisir un agent") {
              return;
            }
            setSelectedAgentId(agents.find(agent => agent.nom === e.target.value)?.id || "");
            setAgentName(e.target.value);
          }}
          size="sm"
        >
          <option selected>Choisir un agent</option>
          {agents.map(agent => (
            <option>{agent.nom}</option>
          ))}
        </Form.Select>
      </div>
      <div
        style={{
          backgroundColor: "#f8f9fa",
          margin: "auto",
          marginTop: "20px",
          marginBottom: "20px",
          width: "70%",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            marginBottom: "10px",
          }}
        >
          Choisir les points de collect
        </p>
        <GoogleMapVisgl addCollectionPoint={addCollectionPoint} selected={selected} />
      </div>
      <div
        style={{
          margin: "auto",
          width: "70%",
        }}
      >
        <Button
          style={{
            display: "block",
            marginBottom: "20px",
          }}
          variant="primary"
          onClick={() => createTournee()}
        >
          Créer la tournée
        </Button>
      </div>
    </>
  );
};

const GoogleMapVisgl: React.FC<{
  addCollectionPoint: (collectionPoint: PointDeCollect) => void;
  selected: PointDeCollect[];
}> = ({ addCollectionPoint, selected }) => {
  const [defaultCenter, setDefaultCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [pointsDeCollect, setPointsDeCollect] = useState<PointDeCollect[]>([]);

  const authContext = useContext(AuthContext)!;

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
      >
        {pointsDeCollect.map(pointDeCollect => {
          return <MarkerVisglWrapper pointDeCollect={pointDeCollect} addCollectionPoint={addCollectionPoint} />;
        })}

        {selected.map(selectedPoint => {
          return (
            <MarkerVisglWrapper
              color="#ff7900"
              pointDeCollect={selectedPoint}
              addCollectionPoint={addCollectionPoint}
            />
          );
        })}
      </Map>
    </APIProvider>
  ) : (
    ""
  );
};

const MarkerVisglWrapper: React.FC<{
  pointDeCollect: PointDeCollect;
  addCollectionPoint: (collectionPoint: PointDeCollect) => void;
  color?: string;
}> = ({ pointDeCollect, addCollectionPoint, color }) => {
  return (
    <AdvancedMarker
      key={useId()}
      position={{ lat: pointDeCollect.lat, lng: pointDeCollect.lng }}
      onClick={() => addCollectionPoint(pointDeCollect)}
    >
      <Pin background={color || "#0f9d58"} borderColor={"#006425"} glyphColor={"#60d98f"} />
    </AdvancedMarker>
  );
};
