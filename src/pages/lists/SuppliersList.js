import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SuppliersList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortByDebt, setSortByDebt] = useState(false);

  /* ===== تجهيز البيانات ===== */
  const [suppliers, setSuppliers] = useState([]);

useEffect(() => {
  const data = JSON.parse(localStorage.getItem("suppliers")) || [];
  setSuppliers(data);
}, []);

  /* ===== فلترة + ترتيب ===== */
  const filteredSuppliers = useMemo(() => {
    let result = suppliers.filter(
      (s) =>
        s.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (s.phone || "")
          .toLowerCase()
          .includes(search.toLowerCase())
    );

    if (sortByDebt) {
      result = [...result].sort(
        (a, b) =>
          Number(b.balance || 0) -
          Number(a.balance || 0)
      );
    }

    return result;
  }, [suppliers, search, sortByDebt]);
  const totalBalance = filteredSuppliers.reduce(
  (sum, s) => sum + Number(s.balance || 0),
  0
);

  /* ===== حذف ===== */
  const deleteSupplier = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المورد؟"))
      return;

    const updated = suppliers.filter(
      (s) => s.id !== id
    );

    localStorage.setItem(
      "suppliers",
      JSON.stringify(updated)
    );

    window.location.reload();
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🏭 كشف الموردين</h3>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/suppliers")}
        >
          ⬅ الرجوع لتعريف الموردين
        </button>
      </div>

      {/* ===== Search + Sort ===== */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="بحث بالاسم أو الهاتف"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="col-md-3 d-grid">
          <button
            className="btn btn-warning"
            onClick={() =>
              setSortByDebt(!sortByDebt)
            }
          >
            ترتيب أعلى مديونية
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>كود</th>
            <th>اسم المورد</th>
            <th>التليفون</th>
            <th>الرصيد</th>
            <th>الحالة</th>
            <th className="text-center">إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredSuppliers.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                لا يوجد موردين
              </td>
            </tr>
          )}

          {filteredSuppliers.map((s, index) => {
            const balance = Number(s.openingBalance || 0);

            return (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.supplierNumber}</td>
                <td>{s.name}</td>
                <td>{s.phone || "-"}</td>

                <td
                  className={
                    balance > 0
                      ? "text-danger fw-bold"
                      : balance < 0
                      ? "text-success fw-bold"
                      : ""
                  }
                >
                  {balance}
                </td>

                <td>
                  {balance > 0
                    ? "دائن"
                    : balance < 0
                    ? "مدين"
                    : "متزن"}
                </td>

                <td>
                  <div className="d-flex gap-2 justify-content-center">

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate("/suppliers", {
                          state: { id: s.id },
                        })
                      }
                    >
                      ✏️
                    </button>

                    <button
  className="btn btn-sm btn-info text-white"
  onClick={() =>
    navigate(`/supplier-ledger?supplier=${s.id}`)
  }
>
  📒
</button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        deleteSupplier(s.id)
                      }
                    >
                      🗑
                    </button>

                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-2 text-muted">
  إجمالي الموردين: {filteredSuppliers.length} |
  إجمالي الرصيد: {totalBalance}
</div>
    </div>
  );
}

export default SuppliersList;