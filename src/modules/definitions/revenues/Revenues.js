import { useState } from "react";
import usePermission from "../../../hooks/usePermission";

function Revenues() {

  const { canView, canAdd, canDelete } = usePermission("revenues");

  /* ================== State ================== */
  const [revenues, setRevenues] = useState(() => {
    const saved = localStorage.getItem("revenues");
    return saved ? JSON.parse(saved) : [];
  });

  const [treasury, setTreasury] = useState(() => {
    const saved = localStorage.getItem("treasury");
    return saved ? JSON.parse(saved) : [];
  });

  const [banks, setBanks] = useState(() => {
    const saved = localStorage.getItem("banks");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedBank, setSelectedBank] = useState("");

  if (!canView) {
    return (
      <div className="alert alert-danger">
        🚫 ليس لديك صلاحية عرض الإيرادات
      </div>
    );
  }

  /* ================== Add ================== */
  const addRevenue = () => {

    if (!name.trim() || !amount || !date) {
      alert("من فضلك اكمل البيانات الأساسية");
      return;
    }

    if (Number(amount) <= 0) {
      alert("المبلغ يجب أن يكون أكبر من صفر");
      return;
    }

    const newRevenue = {
      id: Date.now(),
      name: name.trim(),
      amount: Number(amount),
      date,
      notes,
      paymentMethod,
      bankId: paymentMethod === "bank" ? selectedBank : null,
      createdAt: new Date().toISOString()
    };

    /* ===== تحديث حركة مالية ===== */

    if (paymentMethod === "cash") {
      const treasuryMovement = {
        id: Date.now() + 1,
        type: "revenue",
        amount: Number(amount),
        date,
        referenceId: newRevenue.id,
        description: `إيراد: ${name}`
      };

      const updatedTreasury = [...treasury, treasuryMovement];
      setTreasury(updatedTreasury);
      localStorage.setItem("treasury", JSON.stringify(updatedTreasury));
    }

    if (paymentMethod === "bank" && selectedBank) {
      const updatedBanks = banks.map(b => {
        if (b.id === Number(selectedBank)) {
          return {
            ...b,
            balance: (Number(b.balance) || 0) + Number(amount)
          };
        }
        return b;
      });

      setBanks(updatedBanks);
      localStorage.setItem("banks", JSON.stringify(updatedBanks));
    }

    const updated = [...revenues, newRevenue];
    setRevenues(updated);
    localStorage.setItem("revenues", JSON.stringify(updated));

    /* ===== Reset ===== */
    setName("");
    setAmount("");
    setNotes("");
    setPaymentMethod("cash");
    setSelectedBank("");
  };

  /* ================== Delete ================== */
  const deleteRevenue = (id) => {

    if (!window.confirm("حذف الإيراد؟")) return;

    const revenue = revenues.find(r => r.id === id);
    if (!revenue) return;

    /* ===== عكس الحركة ===== */

    if (revenue.paymentMethod === "cash") {
      const updatedTreasury = treasury.filter(
        t => t.referenceId !== id
      );
      setTreasury(updatedTreasury);
      localStorage.setItem("treasury", JSON.stringify(updatedTreasury));
    }

    if (revenue.paymentMethod === "bank" && revenue.bankId) {
      const updatedBanks = banks.map(b => {
        if (b.id === Number(revenue.bankId)) {
          return {
            ...b,
            balance: (Number(b.balance) || 0) - Number(revenue.amount)
          };
        }
        return b;
      });

      setBanks(updatedBanks);
      localStorage.setItem("banks", JSON.stringify(updatedBanks));
    }

    const updated = revenues.filter(r => r.id !== id);
    setRevenues(updated);
    localStorage.setItem("revenues", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <h3 className="mb-4">💰 الإيرادات</h3>

      {canAdd && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">

              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="اسم الإيراد"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="المبلغ"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">نقدي</option>
                  <option value="bank">بنك</option>
                </select>
              </div>

              {paymentMethod === "bank" && (
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="">اختر البنك</option>
                    {banks.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-md-3">
                <input
                  className="form-control"
                  placeholder="ملاحظات"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="col-md-2 d-grid">
                <button className="btn btn-success" onClick={addRevenue}>
                  إضافة
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===== Table ===== */}
      <div className="card">
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
                <th>طريقة الدفع</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {revenues.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    لا توجد إيرادات
                  </td>
                </tr>
              )}

              {revenues.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.amount}</td>
                  <td>{r.date}</td>
                  <td>{r.paymentMethod}</td>
                  <td>
                    {canDelete && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteRevenue(r.id)}
                      >
                        🗑 حذف
                      </button>
                    )}
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

export default Revenues;