import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
function CustomerTotalBalances() {
  const navigate = useNavigate();

  /* ===== STATES ===== */
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const today = new Date();

// أول يوم في السنة
const startOfYear = new Date(today.getFullYear(), 0, 1);

// حل مشكلة التايم زون
const formatDate = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0,10);

// الحالات
const [fromDate, setFromDate] = useState(formatDate(startOfYear));
const [toDate, setToDate] = useState(formatDate(today));
  const [sortByDebt, setSortByDebt] = useState(false);

  /* ===== DATA FROM LOCALSTORAGE (FIXED) ===== */
  const customers = useMemo(() => {
    return JSON.parse(localStorage.getItem("customers")) || [];
  }, []);

  const invoices = useMemo(() => {
    return JSON.parse(localStorage.getItem("salesInvoices")) || [];
  }, []);
  
const cashTransactions = useMemo(() => {
  return JSON.parse(localStorage.getItem("cashTransactions")) || [];
}, []);
  /* ===== FILTER BY DATE ===== */
  const customersWithFilteredBalance = useMemo(() => {
    return customers.map((customer) => {

let invoiceBalance = Number(customer.openingBalance || 0);
let paymentBalance = 0;
/* تحصيل العملاء من الخزنة */

cashTransactions
.filter(
(t) =>
t.operationType !== "sales" && // 🔥 أهم سطر
String(t.customerCode) === String(customer.customerNumber)
)
.forEach((t) => {

const payDate = new Date(t.date);

if (
(!fromDate || payDate >= new Date(fromDate)) &&
(!toDate || payDate <= new Date(toDate + "T23:59:59"))
) {
paymentBalance += Number(t.amount || 0);
}

});
/* الفواتير */
invoices
  .filter((inv) => inv.customerCode === customer.customerNumber)
  .forEach((inv) => {

    const invDate = new Date(inv.date);

    if (
      (!fromDate || invDate >= new Date(fromDate)) &&
      (!toDate || invDate <= new Date(toDate + "T23:59:59"))
    ) {

     // ❌ تجاهل الكاش
if (inv.paymentMethod === "cash") return;

// ✔️ الآجل + الشيك
invoiceBalance += Number(inv.total || 0);

    }

  });


const balance = invoiceBalance - paymentBalance;

      return { ...customer, filteredBalance: balance };
    });
}, [customers, invoices, cashTransactions, fromDate, toDate]);
  /* ===== SEARCH ===== */
 

  /* ===== SORT ===== */
  const finalCustomers = useMemo(() => {

  let filtered = customersWithFilteredBalance;

 if (selectedCustomer) {
  filtered = filtered.filter(
    (c) => String(c.customerNumber) === String(selectedCustomer)
  );
}

  if (sortByDebt) {
    filtered = [...filtered].sort(
      (a, b) => Number(b.filteredBalance) - Number(a.filteredBalance)
    );
  }

  return filtered;

}, [customersWithFilteredBalance, selectedCustomer, sortByDebt]);

  /* ===== TOTALS ===== */
  const totalDebit = finalCustomers
    .filter((c) => c.filteredBalance > 0)
    .reduce((sum, c) => sum + c.filteredBalance, 0);

  const totalCredit = finalCustomers
    .filter((c) => c.filteredBalance < 0)
    .reduce((sum, c) => sum + c.filteredBalance, 0);

  const totalBalance = totalDebit + totalCredit;

  /* ===== EXPORT CSV ===== */
  const exportToExcel = () => {
    const headers = [
      "اسم العميل",
      "كود العميل",
      "الرصيد",
      "الحالة",
    ];

    const rows = finalCustomers.map((c) => [
      c.name,
      c.customerNumber,
      c.filteredBalance,
      c.filteredBalance > 0
        ? "مدين"
        : c.filteredBalance < 0
        ? "دائن"
        : "متزن",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "Customer_Total_Balances.csv";
    link.click();
  };

  const printPage = () => window.print();

  return (
    <div className="container">
      <h3 className="mb-4">
        📊 كشف حساب إجمالي العملاء
      </h3>

      {/* ===== FILTERS ===== */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2">

            <div className="col-md-3">
              <select
  className="form-select"
  value={selectedCustomer}
  onChange={(e) => setSelectedCustomer(e.target.value)}
>
  <option value="">اختر العميل</option>

  {customers.map((c) => (
<option key={String(c.customerNumber)} value={c.customerNumber}>
  {c.name}
</option>
  ))}
</select>
              
            </div>

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(e.target.value)
                }
              />
            </div>

            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) =>
                  setToDate(e.target.value)
                }
              />
            </div>

            <div className="col-md-2 d-grid">
              <button
                className="btn btn-warning"
                onClick={() =>
                  setSortByDebt(!sortByDebt)
                }
              >
                ترتيب أعلى مديونية
              </button>
            </div>

            <div className="col-md-1 d-grid">
              <button
                className="btn btn-success"
                onClick={exportToExcel}
              >
                Excel
              </button>
            </div>

            <div className="col-md-1 d-grid">
              <button
                className="btn btn-dark"
                onClick={printPage}
              >
                طباعة
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card">
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>#</th>
                <th>اسم العميل</th>
                <th>الكود</th>
                <th>الرصيد</th>
                <th>الحالة</th>
                <th>التفاصيل</th>
              </tr>
            </thead>

            <tbody>
              {finalCustomers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    لا توجد بيانات
                  </td>
                </tr>
              )}

              {finalCustomers.map((c, i) => (
                <tr key={c.customerNumber}>
                    <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.customerNumber}</td>
                  <td
                    className={
                      c.filteredBalance > 0
                        ? "text-danger fw-bold"
                        : c.filteredBalance < 0
                        ? "text-success fw-bold"
                        : ""
                    }
                  >
                    {c.filteredBalance}
                  </td>
                  <td>
                    {c.filteredBalance > 0
                      ? "مدين"
                      : c.filteredBalance < 0
                      ? "دائن"
                      : "متزن"}
                  </td>
                  <td>
<button
className="btn btn-sm btn-primary"
onClick={() => navigate(`/customer-ledger?customer=${c.customerNumber}`)}>
📄 كشف الحساب
</button>
</td>
                </tr>
              ))}
            </tbody>

            <tfoot className="table-light">
              <tr>
                <th colSpan="3">إجمالي المدين</th>
                <th colSpan="2" className="text-danger">
                  {totalDebit}
                </th>
              </tr>
              <tr>
                <th colSpan="3">إجمالي الدائن</th>
                <th colSpan="2" className="text-success">
                  {totalCredit}
                </th>
              </tr>
              <tr>
                <th colSpan="3">الصافي العام</th>
                <th colSpan="2">
                  {totalBalance}
                </th>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerTotalBalances;