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
  useEffect(() => {
    if (!query) {
      setResults(sales);
      return;
    }

    const q = query.toLowerCase();

    const filtered = sales.filter(inv =>
      String(inv.id).includes(q) ||
      inv.customerName?.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [query, sales]);

  return (
    <div>
      <h3>🔎 بحث المبيعات</h3>

      <input
        type="text"
        placeholder="رقم الفاتورة أو اسم العميل"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: 8, width: "100%", marginBottom: 15 }}
      />

      <table width="100%" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>#</th>
            <th>العميل</th>
            <th>التاريخ</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">لا توجد نتائج</td>
            </tr>
          ) : (
            results.map(inv => (
              <tr key={inv.id}>
                <td>{inv.id}</td>
                <td>{inv.customerName}</td>
                <td>{inv.date}</td>
                <td>{inv.total}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalesSearch;