import { useEffect, useState } from "react";

function SalesSearch() {
  const [query, setQuery] = useState("");
  const [sales, setSales] = useState([]);
  const [results, setResults] = useState([]);

  // تحميل بيانات المبيعات من localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("salesInvoices")) || [];
    setSales(data);
    setResults(data);
  }, []);

  // فلترة البحث
const handleSearch = () => {

  if (!query) {
    setResults(sales);
    return;
  }

  const q = query.toLowerCase();

 const filtered = sales.filter(inv =>
  String(inv.invoiceId).toLowerCase().includes(q) ||
  inv.customerName?.toLowerCase().includes(q)
);

  setResults(filtered);
};

  return (
    <div>
      <h3>🔎 بحث المبيعات</h3>

      <input
  type="text"
  placeholder="رقم الفاتورة أو اسم العميل"
  value={query}
  onChange={(e) => setQuery(e.target.value)}

  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}

  style={{ padding: 8, width: "100%", marginBottom: 15 }}
/>
      <button
  onClick={handleSearch}
  style={{
    padding: "8px 15px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginBottom: 10
  }}
>
  🔍 بحث
</button>

      <table width="100%" border="1" cellPadding="6">
  <thead>
    <tr>
      <th>#</th>
      <th>العميل</th>
      <th>التاريخ</th>
      <th>الإجمالي</th>
      <th>إجراءات</th>
    </tr>
  </thead>

  <tbody>
    {results.length === 0 ? (
      <tr>
        <td colSpan="5" align="center">لا توجد نتائج</td>
      </tr>
    ) : (
      results.map(inv => (
        <tr key={inv.id}>
          <td>{inv.invoiceId}</td>
          <td>{inv.customerName}</td>
          <td>{inv.date}</td>
          <td>{inv.total}</td>

          <td>
            {/* 👁 عرض */}
            <button
              onClick={() =>
                window.open(`/sales-invoice/${inv.invoiceId}`, "_blank")
              }
              style={{ marginRight: 5 }}
            >
              👁
            </button>

            {/* ✏️ تعديل */}
            <button
              onClick={() =>
                window.location.href = `/sales-invoice/${inv.invoiceId}`
              }
            >
              ✏️
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
    </div>
  );
}

export default SalesSearch;