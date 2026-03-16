import { useState, useMemo } from "react";

function CashTransactions() {

  /* ===== Load Accounts ===== */
  const [accounts] = useState(() => {
    const saved = localStorage.getItem("bankCash");
    return saved ? JSON.parse(saved) : [];
  });

  /* ===== Load Transactions ===== */
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("cashTransactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState("in"); // in | out
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  /* ===== Calculate Balance ===== */
  const calculateBalance = (id) => {
    const account = accounts.find(a => a.id === Number(id));
    if (!account) return 0;

    let balance = Number(account.balance || account.openingBalance || 0);

    transactions.forEach(t => {
      if (t.accountId === Number(id)) {
        if (t.type === "in") balance += Number(t.amount);
        if (t.type === "out") balance -= Number(t.amount);
      }
    });

    return balance;
  };

  const currentBalance = useMemo(() => {
    if (!accountId) return 0;
    return calculateBalance(accountId);
  }, [accountId, transactions]);

  /* ===== Add Transaction ===== */
  const addTransaction = () => {

    if (!accountId || !amount) {
      alert("اكمل البيانات");
      return;
    }

    if (Number(amount) <= 0) {
      alert("المبلغ يجب أن يكون أكبر من صفر");
      return;
    }

    if (type === "out" && Number(amount) > currentBalance) {
      alert("❌ لا يمكن السحب أكبر من الرصيد الحالي");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      accountId: Number(accountId),
      type,
      amount: Number(amount),
      description,
      date
    };

    const updated = [...transactions, newTransaction];

    setTransactions(updated);
    localStorage.setItem(
      "cashTransactions",
      JSON.stringify(updated)
    );

    setAmount("");
    setDescription("");
  };

  return (
    <div className="container">
      <h3 className="mb-4">💰 حركة خزنة / بنك</h3>

      {/* ===== Form ===== */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-4">
              <label>الحساب</label>
              <select
                className="form-select"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                <option value="">اختر الحساب</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.type === "cash" ? "خزينة" : "بنك"})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label>النوع</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="in">إيداع</option>
                <option value="out">سحب</option>
              </select>
            </div>

            <div className="col-md-2">
              <label>المبلغ</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>التاريخ</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>الوصف</label>
              <input
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

          </div>

          <div className="mt-3 text-end">
            <button
              className="btn btn-primary"
              onClick={addTransaction}
            >
              تنفيذ الحركة
            </button>
          </div>
        </div>
      </div>

      {/* ===== Current Balance ===== */}
      {accountId && (
        <div className="alert alert-info">
          💵 الرصيد الحالي: <strong>{currentBalance}</strong>
        </div>
      )}

      {/* ===== Transactions Table ===== */}
      <div className="card">
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>الحساب</th>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>التاريخ</th>
                <th>الوصف</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => {
                const acc = accounts.find(a => a.id === t.accountId);
                return (
                  <tr key={t.id}>
                    <td>{index + 1}</td>
                    <td>{acc?.name}</td>
                    <td>
                      {t.type === "in"
                        ? "🟢 إيداع"
                        : "🔴 سحب"}
                    </td>
                    <td>{t.amount}</td>
                    <td>{t.date}</td>
                    <td>{t.description}</td>
                  </tr>
                );
              })}

              {transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    لا توجد حركات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default CashTransactions;