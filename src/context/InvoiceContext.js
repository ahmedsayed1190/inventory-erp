import { createContext, useContext, useState } from "react";

const InvoiceContext = createContext();

/* ================================
   Provider
================================ */
export function InvoiceProvider({ children }) {
  /* ===== Sales Invoices ===== */
  const [salesInvoices, setSalesInvoices] = useState(() => {
    const saved = localStorage.getItem("salesInvoices");
    return saved ? JSON.parse(saved) : [];
  });

  /* ===== Purchase Invoices ===== */
  const [purchaseInvoices, setPurchaseInvoices] = useState(() => {
    const saved = localStorage.getItem("purchaseInvoices");
    return saved ? JSON.parse(saved) : [];
  });

  /* ===== Add Sales Invoice ===== */
  const addSalesInvoice = (invoice) => {
    const updated = [...salesInvoices, invoice];
    setSalesInvoices(updated);
    localStorage.setItem(
      "salesInvoices",
      JSON.stringify(updated)
    );
  };

  /* ===== Add Purchase Invoice ===== */
  const addPurchaseInvoice = (invoice) => {
    const updated = [...purchaseInvoices, invoice];
    setPurchaseInvoices(updated);
    localStorage.setItem(
      "purchaseInvoices",
      JSON.stringify(updated)
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        salesInvoices,
        purchaseInvoices,
        addSalesInvoice,
        addPurchaseInvoice
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

/* ================================
   Hook
================================ */
export function useInvoices() {
  return useContext(InvoiceContext);
}