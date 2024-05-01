import DashboardNavbar from "./components/navbar";
import { PageCamions } from "./camions/PageCamions";
import { Route, Routes } from "react-router-dom";
import { PageAgents } from "./agents/PageAgents";
import { PagePointDeCollect } from "./PointDeCollect/PagePointsDeCollect";

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
      <DashboardNavbar />
      <Routes>
        <Route path="/camions" element={<PageCamions />} />
        <Route path="/agents" element={<PageAgents />} />
        <Route path="/pdc" element={<PagePointDeCollect />} />
      </Routes>
    </div>
  );
}

export default App;
