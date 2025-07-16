import { createContext, useContext, useState, useEffect } from "react";
import { isLoggedIn } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Optional, useful for UX

  useEffect(() => {
    const checkLogin = async () => {
      const result = await isLoggedIn();
      setLoggedIn(result);
      setLoading(false);
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
