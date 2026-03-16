import { useState } from "react";
import usePermission from "../../../hooks/usePermission";

function BankCash() {

  const { canView, canAdd, canEdit, canDelete } =
    usePermission("bank_cash");

 const [accounts, setAccounts] = useState(() => {

  let saved = localStorage.getItem("bankCash");

  if (!saved) {

    const defaultCash = [
      {
        id: 1,
        name: "الخزنة الرئيسية",
        type: "cash",
        openingBalance: 0,
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ];

    localStorage.setItem(
      "bankCash",
      JSON.stringify(defaultCash)
    );

    // نفس البيانات للفواتير
    localStorage.setItem(
      "cashAccounts",
      JSON.stringify(defaultCash)
    );

    return defaultCash;
  }

  return JSON.parse(saved);
});

  const [name, setName] = useState("");
  const [type, setType] = useState("cash");
  const [openingBalance, setOpeningBalance] = useState("");
  const [editingId, setEditingId] = useState(null);

  if (!canView) {
    return (
      <div className="container">
        <h4 className="text-danger">
          ❌ ليس لديك صلاحية فتح الخزينة والبنوك
        </h4>
      </div>
    );
  }

  /* ===== حساب الرصيد الفعلي ===== */
  const calculateBalance = (account) => {
    const treasury = JSON.parse(localStorage.getItem("treasury")) || [];
    const revenues = JSON.parse(localStorage.getItem("revenues")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let balance = Number(account.openingBalance || 0);

    treasury.forEach(t => {
      if (account.type === "cash") {
        if (t.type === "revenue") balance += Number(t.amount);
        if (t.type === "expense") balance -= Number(t.amount);
      }
    });

    revenues.forEach(r => {
      if (account.type === "bank" && r.bankId === account.id)
        balance += Number(r.amount);
    });

    expenses.forEach(e => {
      if (account.type === "bank" && e.bankId === account.id)
        balance -= Number(e.amount);
    });

    return balance;
  };

  /* ===== حفظ ===== */
  const handleSave = () => {

    if (!name.trim()) {
      alert("ادخل الاسم");
      return;
    }

    const exists = accounts.some(
      a =>
        a.name.toLowerCase() === name.toLowerCase() &&
        a.id !== editingId
    );

    if (exists) {
      alert("الاسم موجود بالفعل");
      return;
    }

    let updated;

    if (editingId === null) {
      if (!canAdd) {
        alert("❌ ليس لديك صلاحية الإضافة");
        return;
      }

      updated = [
        ...accounts,
        {
          id: Date.now(),
          name,
          type,
          openingBalance: Number(openingBalance) || 0,
          createdAt: new Date().toISOString(),
          isActive: true
        }
      ];
    } else {
      if (!canEdit) {
        alert("❌ ليس لديك صلاحية التعديل");
        return;
      }

      updated = accounts.map(a =>
        a.id === editingId
          ? { ...a, name, type }
          : a
      );
    }

    setAccounts(updated);
    localStorage.setItem("bankCash", JSON.stringify(updated));
localStorage.setItem("cashAccounts", JSON.stringify(updated));

    setName("");
    setType("cash");
    setOpeningBalance("");
    setEditingId(null);
  };

  /* ===== حذف ===== */
  const handleDelete = (id) => {

    if (!canDelete) {
      alert("❌ ليس لديك صلاحية الحذف");
      return;
    }

    const revenues =
      JSON.parse(localStorage.getItem("revenues")) || [];

    const expenses =
      JSON.parse(localStorage.getItem("expenses")) || [];

    const hasTransactions =
      revenues.some(r => r.bankId === id) ||
      expenses.some(e => e.bankId === id);

    if (hasTransactions) {
      alert("لا يمكن حذف حساب عليه حركات");
      return;
    }

    if (!window.confirm("هل أنت متأكد؟")) return;

    const updated = accounts.filter(a => a.id !== id);
    setAccounts(updated);
    localStorage.setItem("bankCash", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h3 className="mb-4">🏦 الخزينة والبنوك</h3>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="الاسم"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="cash">خزينة</option>
                <option value="bank">بنك</option>
              </select>
            </div>

            {editingId === null && (
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="الرصيد الافتتاحي"
                  value={openingBalance}
                  onChange={e =>
                    setOpeningBalance(e.target.value)
                  }
                />
              </div>
            )}

            <div className="col-md-2 d-grid">
              <button
                className="btn btn-success"
                onClick={handleSave}
              >
                {editingId ? "تعديل" : "إضافة"}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>النوع</th>
                <th>الرصيد الحالي</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.name}</td>
                  <td>{a.type === "cash" ? "خزينة" : "بنك"}</td>
                  <td>{calculateBalance(a)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setEditingId(a.id);
                        setName(a.name);
                        setType(a.type);
                      }}
                    >
                      تعديل
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(a.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BankCash;