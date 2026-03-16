import { createContext, useContext, useEffect, useState } from "react";

const WarehouseContext = createContext();

export function WarehouseProvider({ children }) {
  const [warehouses, setWarehouses] = useState(() => {
    const saved = localStorage.getItem("warehouses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("warehouses", JSON.stringify(warehouses));
  }, [warehouses]);

  const addWarehouse = (name) => {
    if (!name) return;

    setWarehouses(prev => [
  ...prev,
  {
    id: Date.now(),
    name
  }
]);
  };

  const deleteWarehouse = (id) => {
    setWarehouses(warehouses.filter(w => w.id !== id));
  };

  return (
    <WarehouseContext.Provider
value={{ warehouses, setWarehouses, addWarehouse, deleteWarehouse }}    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouses() {
  return useContext(WarehouseContext);
}