import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const items = JSON.parse(localStorage.getItem("items")) || [];
  const customers = JSON.parse(localStorage.getItem("customers")) || [];
  const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
  const salesInvoices = JSON.parse(localStorage.getItem("salesInvoices")) || [];

  const results = [];

  if (query.trim() !== "") {
    items.forEach(i => {
      if (i.name?.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: "Item", label: i.name, path: "/items" });
      }
    });

    customers.forEach(c => {
      if (c.name?.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: "Customer", label: c.name, path: "/customers" });
      }
    });

    suppliers.forEach(s => {
      if (s.name?.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: "Supplier", label: s.name, path: "/suppliers" });
      }
    });

    salesInvoices.forEach(inv => {
      if (String(inv.invoiceNumber).includes(query)) {
        results.push({
          type: "Sales Invoice",
          label: `Invoice #${inv.invoiceNumber}`,
          path: `/sales-invoice/${inv.index || 0}`
        });
      }
    });
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        placeholder="🔍 Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: 6,
          width: 250,
          borderRadius: 4,
          border: "1px solid #ccc"
        }}
      />

      {query && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            zIndex: 1000
          }}
        >
          {results.map((r, i) => (
            <div
              key={i}
              onClick={() => {
                navigate(r.path);
                setQuery("");
              }}
              style={{
                padding: 8,
                cursor: "pointer",
                borderBottom: "1px solid #eee"
              }}
            >
              <strong>{r.type}</strong> — {r.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;