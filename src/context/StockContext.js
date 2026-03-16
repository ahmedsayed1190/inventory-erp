import { createContext, useContext, useEffect, useState } from "react";

const StockContext = createContext();

export function StockProvider({ children }) {
  // =============================
  // 📦 رصيد المخزون
  // =============================
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem("stocks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("stocks", JSON.stringify(stocks));
  }, [stocks]);

  // =============================
  // 📊 سجل حركة المخزون
  // =============================
  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem("stockMovements");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "stockMovements",
      JSON.stringify(movements)
    );
  }, [movements]);

  // =============================
  // ➕ إضافة رصيد (إدخال)
  // =============================
  const addStock = (productId, warehouseId, qty) => {
    if (!productId || !warehouseId || qty <= 0) return;

    setStocks((prev) => {
      const found = prev.find(
        (s) =>
          s.productId === productId &&
          s.warehouseId === warehouseId
      );

      if (found) {
        return prev.map((s) =>
          s.productId === productId &&
          s.warehouseId === warehouseId
            ? { ...s, qty: s.qty + qty }
            : s
        );
      }

      return [
        ...prev,
        { productId, warehouseId, qty }
      ];
    });

    setMovements((prev) => [
      ...prev,
      {
        date: new Date().toLocaleString(),
        productId,
        fromWarehouseId: null,
        toWarehouseId: warehouseId,
        qty,
        type: "IN"
      }
    ]);
  };

  // =============================
  // ➖ خصم رصيد (بيع)
  // =============================
  const removeStock = (productId, warehouseId, qty) => {
    if (!productId || !warehouseId || qty <= 0) return;

    setStocks((prev) =>
      prev.map((s) =>
        s.productId === productId &&
        s.warehouseId === warehouseId
          ? { ...s, qty: s.qty - qty }
          : s
      )
    );

    setMovements((prev) => [
      ...prev,
      {
        date: new Date().toLocaleString(),
        productId,
        fromWarehouseId: warehouseId,
        toWarehouseId: null,
        qty,
        type: "OUT"
      }
    ]);
  };

  // =============================
  // 🔄 تحويل بين المخازن
  // =============================
  const transferStock = (
    productId,
    fromWarehouseId,
    toWarehouseId,
    qty
  ) => {
    if (
      !productId ||
      !fromWarehouseId ||
      !toWarehouseId ||
      qty <= 0
    )
      return;

    // خصم من المخزن الصادر
    setStocks((prev) =>
      prev.map((s) =>
        s.productId === productId &&
        s.warehouseId === fromWarehouseId
          ? { ...s, qty: s.qty - qty }
          : s
      )
    );

    // إضافة للمخزن الوارد
    setStocks((prev) => {
      const found = prev.find(
        (s) =>
          s.productId === productId &&
          s.warehouseId === toWarehouseId
      );

      if (found) {
        return prev.map((s) =>
          s.productId === productId &&
          s.warehouseId === toWarehouseId
            ? { ...s, qty: s.qty + qty }
            : s
        );
      }

      return [
        ...prev,
        { productId, warehouseId: toWarehouseId, qty }
      ];
    });

    // تسجيل الحركة
    setMovements((prev) => [
      ...prev,
      {
        date: new Date().toLocaleString(),
        productId,
        fromWarehouseId,
        toWarehouseId,
        qty,
        type: "TRANSFER"
      }
    ]);
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        movements,
        addStock,
        removeStock,
        transferStock
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext(StockContext);
}