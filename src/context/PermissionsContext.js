import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const PermissionsContext = createContext();

export function PermissionsProvider({ children }) {
  const { user } = useAuth();

  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem("userPermissions");
    return saved ? JSON.parse(saved) : {};
  });

  const setUserPermissions = (username, perms) => {
    const updated = {
      ...permissions,
      [username]: perms
    };

    setPermissions(updated);
    localStorage.setItem(
      "userPermissions",
      JSON.stringify(updated)
    );
  };

  const getPermissions = () => {
    if (!user) return {};
    if (user.isAdmin) return { all: true };
    return permissions[user.username] || {};
  };

  return (
    <PermissionsContext.Provider
      value={{ setUserPermissions, getPermissions }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}