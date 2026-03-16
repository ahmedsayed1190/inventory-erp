import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  /* ===== Login ===== */
  const login = (username, password) => {
    // Admin ثابت
    if (username === "admin" && password === "123") {
      const adminUser = {
        id: 0,
        username: "admin",
        isAdmin: true
      };

      setUser(adminUser);
      localStorage.setItem(
        "currentUser",
        JSON.stringify(adminUser)
      );
      return true;
    }

    // Users من localStorage
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) =>
        u.username === username &&
        u.password === password
    );

    if (!found) return false;

    const normalUser = {
      id: found.id,
      username: found.username,
      permissions: found.permissions,
      isAdmin: false
    };

    setUser(normalUser);
    localStorage.setItem(
      "currentUser",
      JSON.stringify(normalUser)
    );

    return true;
  };

  /* ===== Logout ===== */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}