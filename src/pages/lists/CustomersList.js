import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function CustomersList() {
  const navigate = useNavigate();

  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [sortByDebt, setSortByDebt] = useState(false);

  /* ===== تجهيز البيانات ===== */
  const customers = useMemo(() => {
    return JSON.parse(localStorage.getItem("customers")) || [];
  }, []);

  /* ===== فلترة ===== */
  const filteredCustomers = useMemo(() => {
    let result = customers.filter(
      (c) =>
        c.name
          .toLowerCase()
          .includes(searchName.toLowerCase()) &&
        (c.phone || "").includes(searchPhone)
    );

    if (sortByDebt) {
      result = [...result].sort(
        (a, b) =>
          Number(b.balance || 0) -
          Number(a.balance || 0)
      );
    }

    return result;
  }, [customers, searchName, searchPhone, sortByDebt]);

  /* ===== حذف ===== */
  const deleteCustomer = (id) => {
    if (!window.confirm("هل أنت متأكد من حذف العميل؟"))
      return;

    const updated = customers.filter(
      (c) => c.id !== id
    );

    localStorage.setItem(
      "customers",
      JSON.stringify(updated)
    );

    window.location.reload();
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>👥 كشف العملاء</h3>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/customers")}
        >
          ⬅ الرجوع لتعريف العملاء
        </button>
      </div>

      {/* ===== Search ===== */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="بحث باسم العميل"
            value={searchName}
            onChange={(e) =>
              setSearchName(e.target.value)
            }
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="بحث برقم الموبايل"
            value={searchPhone}
            onChange={(e) =>
              setSearchPhone(e.target.value)
            }
          />
        </div>

        <div className="col-md-4 d-grid">
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
            <th>اسم العميل</th>
            <th>الموبايل</th>
            <th>الرصيد الافتتاحي</th>
            <th>الرصيد الحالي</th>
            <th>الحالة</th>
            <th className="text-center">إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {filteredCustomers.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">
                لا يوجد عملاء
              </td>
            </tr>
          )}

          {filteredCustomers.map((c, index) => {
            const balance = Number(c.balance || 0);

            return (
              <tr key={c.id}>
                <td>{index + 1}</td>
                <td>{c.code}</td>
                <td>{c.name}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.openingBalance || 0}</td>

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
                    ? "مدين"
                    : balance < 0
                    ? "دائن"
                    : "متزن"}
                </td>

                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate("/customers", {
                          state: { id: c.id },
                        })
                      }
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() =>
                        navigate(
                            `/customer-ledger?customer=${c.code}`
                          )
                      }
                    >
                      📒 كشف حساب
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        deleteCustomer(c.id)
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
        إجمالي العملاء: {filteredCustomers.length}
      </div>
    </div>
  );
}

export default CustomersList;