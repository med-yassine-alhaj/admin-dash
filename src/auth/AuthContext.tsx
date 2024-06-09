// AuthProvider.js
import PropTypes from "prop-types";
import { authClient, databaseClient } from "../firebaseConfig";
import { createContext, useEffect, useState } from "react";
import {
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type AuthContextProps = {
  userId: string;
  user: User | null;
  role: "admin" | "superviseur" | "_";
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  setRole: (role: "admin" | "superviseur") => void;
  setAuthUserId: (id: string) => void;
  loadAuth: () => void;
};
export const AuthContext = createContext<AuthContextProps | null>(null);
type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "superviseur" | "_">("_");
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  const loginUser = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(authClient, email, password);
  };

  const logOut = async () => {
    setLoading(true);
    setUser(null);
    setRole("_");
    setUserId("");
    await signOut(authClient);
    navigate("/login");
  };

  const setUserRole = (role: "admin" | "superviseur") => {
    setRole(role);
  };

  const setAuthUserId = (id: string) => {
    setUserId(id);
  };

  const persistAuth = () => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        user: user,
        role: role,
        userId: userId,
      }),
    );
  };

  const loadAuth = () => {
    const authData = localStorage.getItem("role");
    if (authData) {
      const auth = JSON.parse(authData);
      setUser(auth.user);
      setRole(auth.role);
      setUserId(auth.userId);
    }
  };

  useEffect(() => {
    persistAuth();
  }, [user, role, userId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authClient, async (currentUser) => {
      setUser(currentUser);

      const usersCollection = collection(databaseClient, "users");
      const docSnap = query(
        usersCollection,
        where("id", "==", currentUser?.uid),
      );

      getDocs(docSnap).then((querySnapshot) => {
        if (querySnapshot.docs[0].data().role === "admin") {
          setRole("admin");
          setAuthUserId(querySnapshot.docs[0].id);
          return;
        } else if (querySnapshot.docs[0].data().role === "superviseur") {
          setRole("superviseur");
          setAuthUserId(querySnapshot.docs[0].id);
          return;
        }
      });

      setLoading(false);
    });

    loadAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    user,
    loginUser,
    logOut,
    loading,
    setRole: setUserRole,
    role,
    userId,
    setAuthUserId,
    loadAuth,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
