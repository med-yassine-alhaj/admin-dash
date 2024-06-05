import { LoginPage } from "./auth/LoginPage";
import { Route, Routes } from "react-router-dom";
import { PageAgents } from "./agents/PageAgents";
import DashboardNavbar from "./components/navbar";
import { PageCamions } from "./camions/PageCamions";
import { PagePointDeCollect } from "./PointDeCollect/PagePointsDeCollect";

import "./app.css";
import { RoleGuard } from "./auth/AuthGuard";
import { AddUser } from "./manageUsers/AddUser";
import { UsersPage } from "./manageUsers/UsersPage";
import { Tournee } from "./tournee/Tournee";
import { ListTournees } from "./tournee/ListTournees";
import { PageTracking } from "./tracking/Tracking";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        margin: 0,
        marginBottom: "100px",
      }}
    >
      <DashboardNavbar />

      <Routes>
        <Route
          path="/"
          element={
            <RoleGuard role="user">
              <PageCamions />
            </RoleGuard>
          }
        />
        <Route
          path="/camions"
          element={
            <RoleGuard role="user">
              <PageCamions />
            </RoleGuard>
          }
        />
        <Route
          path="/agents"
          element={
            <RoleGuard role="user">
              <PageAgents />
            </RoleGuard>
          }
        />
        <Route
          path="/pdc"
          element={
            <RoleGuard role="user">
              <PagePointDeCollect />
            </RoleGuard>
          }
        />
        <Route
          path="/users"
          element={
            <RoleGuard role="admin">
              <UsersPage />
            </RoleGuard>
          }
        />
        <Route
          path="/users/add"
          element={
            <RoleGuard role="admin">
              <AddUser />
            </RoleGuard>
          }
        />
        <Route
          path="/tournees"
          element={
            <RoleGuard role="user">
              <ListTournees />
            </RoleGuard>
          }
        />
        <Route
          path="/tournees/ajouter"
          element={
            <RoleGuard role="user">
              <Tournee />
            </RoleGuard>
          }
        />
        <Route
          path="/tracking"
          element={
            <RoleGuard role="user">
              <PageTracking />
            </RoleGuard>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
