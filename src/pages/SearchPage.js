import { useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");

  const items =
    JSON.parse(localStorage.getItem("items")) || [];
  const customers =
    JSON.parse(localStorage.getItem("customers")) || [];
  const suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [];
  const salesInvoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];
  const purchaseInvoices =
    JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

  const q = query.toLowerCase();

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q)
  );

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.phone || "").includes(q)
  );

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      (s.phone || "").includes(q)
  );

  const filteredSales = salesInvoices.filter(
    (inv) =>
      inv.customerName?.toLowerCase().includes(q) ||
      String(inv.id).includes(q)
  );

  const filteredPurchases = purchaseInvoices.filter(
    (inv) =>
      inv.supplierName?.toLowerCase().includes(q) ||
      String(inv.id).includes(q)
  );

  return (
    <div className="container">
      <h3 className="mb-4">🔍 البحث الشامل</h3>

      <input
        className="form-control mb-4"
        placeholder="ابحث بالاسم، الكود، الرقم..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* ===== Items ===== */}
      <h5>📦 الأصناف</h5>
      {filteredItems.length === 0 ? (
        <p className="text-muted">لا نتائج</p>
      ) : (
        <ul>
          {filteredItems.map((i) => (
            <li key={i.id}>
              {i.code} - {i.name}
            </li>
          ))}
        </ul>
      )}

      {/* ===== Customers ===== */}
      <h5>👤 العملاء</h5>
      {filteredCustomers.length === 0 ? (
        <p className="text-muted">لا نتائج</p>
      ) : (
        <ul>
          {filteredCustomers.map((c) => (
            <li key={c.id}>
              {c.name} ({c.phone || "-"})
            </li>
          ))}
        </ul>
      )}

      {/* ===== Suppliers ===== */}
      <h5>🚚 الموردين</h5>
      {filteredSuppliers.length === 0 ? (
        <p className="text-muted">لا نتائج</p>
      ) : (
        <ul>
          {filteredSuppliers.map((s) => (
            <li key={s.id}>
              {s.name}
            </li>
          ))}
        </ul>
      )}

      {/* ===== Sales Invoices ===== */}
      <h5>🧾 فواتير البيع</h5>
      {filteredSales.length === 0 ? (
        <p className="text-muted">لا نتائج</p>
      ) : (
        <ul>
          {filteredSales.map((inv) => (
            <li key={inv.id}>
              فاتورة #{inv.id} - {inv.customerName}
            </li>
          ))}
        </ul>
      )}

      {/* ===== Purchase Invoices ===== */}
      <h5>🧾 فواتير الشراء</h5>
      {filteredPurchases.length === 0 ? (
        <p className="text-muted">لا نتائج</p>
      ) : (
        <ul>
          {filteredPurchases.map((inv) => (
            <li key={inv.id}>
              فاتورة #{inv.id} - {inv.supplierName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchPage;