import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { FaTruckMoving } from "react-icons/fa";

function DashboardNavbar() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext)!;

  return (
    <Navbar collapseOnSelect expand="md" className="bg-body-tertiary border border-1 border-body-secondary">
      <Container>
        <Navbar.Brand onClick={() => navigate("/")}>
          <FaTruckMoving size={30} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/camions")}>Camions</Nav.Link>
            <Nav.Link onClick={() => navigate("/agents")}>Agents</Nav.Link>
            <Nav.Link onClick={() => navigate("/pdc")}>Points De Collect</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              onClick={() => {
                authContext.logOut();
              }}
            >
              Déconnecter
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DashboardNavbar;
