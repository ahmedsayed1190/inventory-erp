import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

useEffect(() => {
  const saved = localStorage.getItem("currentUser");
  if (saved) {
    setUser(JSON.parse(saved));
  }
}, []);

  // ✅ مهم جدًا (ده كان ناقص عندك)
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  /* ===== Login ===== */
  const login = (username, password) => {

    if (
  username.toLowerCase() === "admin" &&
  password === "123"
) {
      const adminUser = {
        id: 0,
        username: "admin",
        isAdmin: true
      };

      setUser(adminUser);
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      return true;
    }

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
    localStorage.setItem("currentUser", JSON.stringify(normalUser));

    return true;
  };

  /* ===== Logout ===== */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}