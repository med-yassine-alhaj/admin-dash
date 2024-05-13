import { LoginPage } from "./auth/LoginPage";
import { Route, Routes } from "react-router-dom";
import { PageAgents } from "./agents/PageAgents";
import DashboardNavbar from "./components/navbar";
import { PageCamions } from "./camions/PageCamions";
import { PagePointDeCollect } from "./PointDeCollect/PagePointsDeCollect";

import "leaflet/dist/leaflet.css";
import "./app.css";
import { AuthGuard } from "./auth/AuthGuard";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        margin: 0,
        marginBottom: "100px",
      }}
    >
      <AuthGuard>
        <DashboardNavbar />
      </AuthGuard>

      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <PageCamions />
            </AuthGuard>
          }
        />
        <Route
          path="/camions"
          element={
            <AuthGuard>
              <PageCamions />
            </AuthGuard>
          }
        />
        <Route
          path="/agents"
          element={
            <AuthGuard>
              <PageAgents />
            </AuthGuard>
          }
        />
        <Route
          path="/pdc"
          element={
            <AuthGuard>
              <PagePointDeCollect />
            </AuthGuard>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
