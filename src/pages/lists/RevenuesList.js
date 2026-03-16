import { useState, useEffect } from "react";

function RevenuesList() {

  const [revenues, setRevenues] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("2026-01-01");
const [toDate, setToDate] = useState(
  new Date().toISOString().slice(0, 10)
);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("revenues")) || [];
    setRevenues(data);
  }, []);

  const filtered = revenues.filter((r) => {

    const matchSearch =
      r.description?.toLowerCase().includes(search.toLowerCase());

    const matchFrom =
      !fromDate || r.date >= fromDate;

    const matchTo =
      !toDate || r.date <= toDate;

    return matchSearch && matchFrom && matchTo;

  });

  const deleteRevenue = (id) => {

    if (!window.confirm("هل تريد حذف الإيراد؟")) return;

    const updated = revenues.filter((r) => r.id !== id);

    localStorage.setItem("revenues", JSON.stringify(updated));

    setRevenues(updated);
  };

  return (
    <div className="container">

      <h3 className="mb-3">💰 كشف الإيرادات</h3>

      {/* ===== Filters ===== */}

      <div className="row g-2 mb-3">

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="بحث بالوصف"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

      </div>

      {/* ===== Table ===== */}

      <table className="table table-bordered">

        <thead className="table-dark">

          <tr>
            <th>#</th>
<th>رقم المعاملة</th>
<th>التاريخ</th>
<th>الوصف</th>
<th>القيمة</th>
<th>حذف</th>
          </tr>

        </thead>

        <tbody>

          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                لا يوجد إيرادات
              </td>
            </tr>
          )}

          {filtered.map((r, i) => (

            <tr key={r.id}>

              <td>{i + 1}</td>

              <td>{r.date}</td>

              <td>{r.description}</td>

              <td className="text-success fw-bold">
                {r.amount}
              </td>

              <td>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteRevenue(r.id)}
                >
                  🗑
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RevenuesList;