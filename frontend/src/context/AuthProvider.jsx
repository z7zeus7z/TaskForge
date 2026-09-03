import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");

    return savedToken ? jwtDecode(savedToken) : null;
  });

  const login = (newToken) => {
    localStorage.setItem("token", newToken);

    const decodedUser = jwtDecode(newToken);

    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};
