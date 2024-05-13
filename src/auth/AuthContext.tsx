// AuthProvider.js
import PropTypes from "prop-types";
import { authClient } from "../firebaseConfig";
import { createContext, useEffect, useState } from "react";
import { User, UserCredential, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

type AuthContextProps = {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  loading: boolean;
};
export const AuthContext = createContext<AuthContextProps | null>(null);
type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loginUser = (email: string, password: string) => {
    setLoading(true);
    return signInWithEmailAndPassword(authClient, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(authClient);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authClient, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    user,
    loginUser,
    logOut,
    loading,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
