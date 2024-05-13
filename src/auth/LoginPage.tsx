import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const authContext = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authContext
      .loginUser(credentials.email, credentials.password)
      .then(user => {
        toast.success(`Bienvenue ${user.user?.email}`);
        navigate("/");
      })
      .catch(() => {
        toast.error("Erreur lors de la connexion");
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Form style={{ width: "500px" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Addresse email </Form.Label>
          <Form.Control
            name="email"
            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
            type="email"
            placeholder="Entrez votre email"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Mot de passe"
            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Connexion
        </Button>
      </Form>
    </div>
  );
};
