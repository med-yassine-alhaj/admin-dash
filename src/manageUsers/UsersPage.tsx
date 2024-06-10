import { CiUser } from "react-icons/ci";
import { useEffect, useState } from "react";
import { databaseClient } from "../firebaseConfig";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";

import {
  collection,
  deleteDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { MdDelete, MdUpdate } from "react-icons/md";
import toast from "react-hot-toast";

type UserDocument = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  ville: {
    nom: string;
  };
  role?: string;
};

export const UsersPage = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedAgent, setSelectedAgent] = useState<UserDocument | null>(null);

  const [users, setAgents] = useState<UserDocument[]>([]);

  const getAgents = async () => {
    const usersQuery = query(collection(databaseClient, "users"));

    const querySnapshot = await getDocs(usersQuery);

    let document = querySnapshot.docs.map((doc) => {
      return {
        id: doc.data().id,
        ...doc.data(),
      };
    }) as UserDocument[];

    document = document.filter((doc) => doc.role !== "admin");

    console.log("document : ", document);

    setAgents(document);
  };

  const handleDelete = async (id: string) => {
    try {
      const userRef = collection(databaseClient, "users");
      const userQuery = query(userRef, where("id", "==", id));
      const querySnapshot = await getDocs(userQuery);

      const doc = querySnapshot.docs[0];

      // if document is found delete it
      if (doc) {
        await deleteDoc(doc.ref);
        toast.success("Utilisateur supprimé avec succès");
        location.reload();
      } else {
        toast.error("Utilisateur non trouvé");
      }
    } catch (e) {
      console.log("error : ", e);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <div className="mt-5">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAgent && (
            <UpdateUser
              nom={selectedAgent.nom}
              prenom={selectedAgent.prenom}
              id={selectedAgent.id}
              password=""
              ville={selectedAgent.ville.nom}
            />
          )}
        </Modal.Body>
      </Modal>
      <Container>
        <h3 className="mt-3">List Of Users</h3>
        <Row className="mt-3" xs={2} md={8} lg={8}>
          {users.map((user, index) => {
            return (
              <Col sm={12} md={6} lg={4} key={index}>
                <Card style={{ width: "18rem" }}>
                  <Card.Body>
                    <CiUser size={35} className="m-1" />

                    <Card.Title>nom: {user.nom}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      prenom: {user.prenom}
                    </Card.Subtitle>
                    <Card.Text>
                      <div>ville: {user.ville.nom.toString()}</div>
                    </Card.Text>

                    <MdUpdate
                      className="mb-1"
                      size={25}
                      cursor="pointer"
                      color="blue"
                      onClick={() => {
                        setSelectedAgent({
                          id: user.id,
                          nom: user.nom,
                          prenom: user.prenom,
                          email: "",
                          ville: {
                            nom: user.ville.nom,
                          },
                        });
                        handleShow();
                      }}
                    />

                    <MdDelete
                      className="ms-2 mb-1"
                      size={25}
                      cursor="pointer"
                      color="red"
                      onClick={() => {
                        handleDelete(user.id);
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

type UpdateUserProps = {
  id: string;
  nom: string;
  prenom: string;
  password: string;
  ville: string;
};

const UpdateUser: React.FC<UpdateUserProps> = ({
  nom,
  prenom,
  id,
  password,
  ville,
}) => {
  const [input, setInput] = useState({
    nom,
    prenom,
    id,
    password,
    ville,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // save user to firebase auth
    try {
      const user: {
        nom: string;
        prenom: string;
        ville: {
          nom: string;
        };
      } = {
        nom: input.nom,
        prenom: input.prenom,
        ville: {
          nom: input.ville,
        },
      };

      const userRef = collection(databaseClient, "users");
      const userQuery = query(userRef, where("id", "==", id));
      const querySnapshot = await getDocs(userQuery);

      const doc = querySnapshot.docs[0];

      // if document is found update it
      if (doc) {
        console.log("data : ", doc.data());
        await setDoc(doc.ref, {
          ...user,
        });
        location.reload();
        toast.success("Utilisateur mis a jour  avec succès");
      } else {
        toast.error("Utilisateur non trouvé");
      }
    } catch (e) {
      console.log("error : ", e);
      toast.error("Erreur lors du mise a jour de l'utilisateur");
    }
  };

  return (
    <div>
      <Form
        style={{
          marginBottom: "50px",
        }}
      >
        <Form.Group className="mb-3" controlId="nom">
          <Form.Label>First name</Form.Label>
          <Form.Control
            id="nom"
            placeholder={nom}
            onChange={handleChange}
            type="text"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="prenom">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            id="prenom"
            placeholder={prenom}
            onChange={handleChange}
            type="text"
          />
        </Form.Group>
        <Form.Group controlId="ville" className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            placeholder={ville}
            onChange={handleChange}
            type="text"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>email</Form.Label>
          <Form.Control id="email" type="email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>mot de passe</Form.Label>
          <Form.Control id="password" type="password" />
        </Form.Group>

        <Button
          style={{
            marginTop: "20px",
          }}
          onClick={handleSubmit}
        >
          Modifier
        </Button>
      </Form>
    </div>
  );
};
