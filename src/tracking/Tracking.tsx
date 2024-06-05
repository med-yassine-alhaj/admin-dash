import { APIProvider, AdvancedMarker, InfoWindow, Map, Pin, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useContext, useEffect, useId, useState } from "react";
import { databaseClient, realTimeDB } from "../firebaseConfig";
import { PointDeCollect } from "../PointDeCollect/types";
import { AuthContext } from "../auth/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { onChildAdded, onValue, ref } from "firebase/database";
import toast from "react-hot-toast";
import { FaTruckMoving } from "react-icons/fa";

export const PageTracking = () => {
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

  const [pointsDeCollect, setPointsDeCollect] = useState<PointDeCollect[]>([]);

  const [trackingPoints, setTrackingPoints] = useState<
    {
      agentId: string;
      lat: number;
      lng: number;
    }[]
  >([]);

  const addTrackingPoint = (agentId: string, lat: number, lng: number) => {
    const found = trackingPoints.find(p => p.agentId === agentId);
    if (found) {
      setTrackingPoints(trackingPoints.map(p => (p.agentId === agentId ? { agentId, lat, lng } : p)));
    } else {
      setTrackingPoints([...trackingPoints, { agentId, lat, lng }]);
    }
  };

  const authContext = useContext(AuthContext)!;

  useEffect(() => {
    const trackingCollection = ref(realTimeDB, "tracking/");
    let initialLoadComplete = false;

    // First, load the initial data to set the flag
    onValue(
      trackingCollection,
      snapshot => {
        // Do nothing with the initial data
        initialLoadComplete = true;
      },
      {
        onlyOnce: true, // Ensure this is called only once to get the initial data
      }
    );

    // Then, listen for new additions
    const unSubscribe = onChildAdded(trackingCollection, snapshot => {
      if (initialLoadComplete) {
        const data = snapshot.val();
        console.log(data);

        if (data && data.agentId && data.lat && data.lng) addTrackingPoint(data.agentId, data.lat, data.lng);
      }
    });

    return () => unSubscribe();
  }, []);

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
        mapTypeId="roadmap"
      >
        {pointsDeCollect.map((pointDeCollect, idx) => {
          return <MarkerVisglWrapper key={idx} pointDeCollect={pointDeCollect} />;
        })}

        {trackingPoints.map((point, index) => {
          return (
            <AdvancedMarker key={index} position={{ lat: point.lat, lng: point.lng }}>
              <FaTruckMoving size={30} color="blue" />
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  ) : (
    ""
  );
};

type MarkerVisglWrapperProps = {
  pointDeCollect: PointDeCollect;
};

const MarkerVisglWrapper: React.FC<MarkerVisglWrapperProps> = ({ pointDeCollect }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

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
        </InfoWindow>
      )}
      <Pin background={"#0f9d58"} borderColor={"#006425"} glyphColor={"#60d98f"} />
    </AdvancedMarker>
  );
};
