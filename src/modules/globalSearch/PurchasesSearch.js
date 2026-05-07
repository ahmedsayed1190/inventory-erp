import { useState } from "react";

function PurchasesSearch() {

 const [search, setSearch] = useState("");
const [results, setResults] = useState([]);

/* ===== عرض ===== */
const viewInvoice = (inv) => {
  localStorage.setItem("editPurchaseInvoice", JSON.stringify(inv));
  localStorage.setItem("mode", "view");
  window.location.href = "/purchase-invoice";
};

/* ===== تعديل ===== */
const editInvoice = (inv) => {
  localStorage.setItem("editPurchaseInvoice", JSON.stringify(inv));
  localStorage.setItem("mode", "edit");
  window.location.href = "/purchase-invoice";
};

  /* ===== البحث ===== */
  const handleSearch = () => {

    const invoices =
      JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

    const filtered = invoices.filter(inv =>
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
    );

    setResults(filtered);
  };

 

  /* ===== حذف ===== */
 const deleteInvoice = (inv) => {

  if (!window.confirm("متأكد عايز تحذف؟")) return;

  /* ===== الفواتير ===== */
  let invoices =
    JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

  const updatedInvoices = invoices.filter(i => i.id !== inv.id);

  localStorage.setItem(
    "purchaseInvoices",
    JSON.stringify(updatedInvoices)
  );

  /* ===== المخزون ===== */
  let stockMovements =
    JSON.parse(localStorage.getItem("stockMovements")) || [];

  const updatedMovements = stockMovements.filter(
    m => m.reference !== inv.invoiceNumber
  );

  localStorage.setItem(
    "stockMovements",
    JSON.stringify(updatedMovements)
  );

  /* ===== حساب المورد ===== */
  let supplierLedger =
    JSON.parse(localStorage.getItem("supplierLedger")) || [];

  const updatedLedger = supplierLedger.filter(
    l =>
      !(
        l.description === "فاتورة شراء" &&
        l.supplierId === inv.supplierId &&
        l.debit === inv.total
      )
  );

  localStorage.setItem(
    "supplierLedger",
    JSON.stringify(updatedLedger)
  );

  alert("تم حذف الفاتورة وتصحيح المخزون ✅");

  handleSearch();
};

  return (
    <div>

      <h3>🧾 بحث المشتريات</h3>

      {/* ===== Input ===== */}
     <input
  type="text"
  placeholder="ابحث برقم فاتورة الشراء"
  value={search}
  onChange={(e) => setSearch(e.target.value)}

  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}

  style={{
    padding: 8,
    width: "100%",
    marginBottom: 10
  }}
/>

      {/* ===== زرار البحث ===== */}
      <button
        onClick={handleSearch}
        style={{
          padding: "8px 15px",
          background: "#0ea5e9",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginBottom: 15
        }}
      >
        🔍 بحث
      </button>

      {/* ===== النتائج ===== */}
      {results.length === 0 ? (
        <p>لا توجد نتائج</p>
      ) : (
        <table border="1" width="100%" style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th>رقم الفاتورة</th>
              <th>المورد</th>
              <th>التاريخ</th>
              <th>الإجمالي</th>
              <th>تحكم</th>
            </tr>
          </thead>

          <tbody>
            {results.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.supplierName}</td>
                <td>{inv.date}</td>
                <td>{inv.total}</td>

                <td>
                  <button onClick={() => viewInvoice(inv)}>
  👁
</button>

                 <button onClick={() => editInvoice(inv)}>
  ✏️
</button>

                  <button onClick={() => deleteInvoice(inv)}>
                    🗑
                    </button>

                  
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default PurchasesSearch;