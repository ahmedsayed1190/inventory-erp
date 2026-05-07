import { useState, useEffect } from "react";

function AddCashTransaction() {

  const [operationType, setOperationType] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [expenseType, setExpenseType] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [supplierId, setSupplierId] = useState("");

  /* ✅ نجيب id لو تعديل */
  const params = new URLSearchParams(window.location.search);
  const editId = params.get("id");

  const expenseDefinitions =
    JSON.parse(localStorage.getItem("expenseDefinitions")) || [];

  const customers =
    JSON.parse(localStorage.getItem("customers")) || [];

  const suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [];

  /* ===================== */
  /* ✅ تحميل البيانات */
  /* ===================== */
  useEffect(() => {

    if (!editId) return;

    const cashTransactions =
      JSON.parse(localStorage.getItem("cashTransactions")) || [];

    const t = cashTransactions.find(x => String(x.id) === String(editId));

    if (t) {
      setOperationType(t.operationType);
      setAmount(t.amount);
      setDescription(t.description);
      setDate(t.date);
      setExpenseType(t.expenseType || "");
      setCustomerId(t.customerCode || "");
    }

  }, [editId]);

  /* ===================== */
  /* حفظ */
  /* ===================== */
  const handleSave = () => {

    if (!amount || Number(amount) <= 0) {
      alert("ادخل مبلغ صحيح");
      return;
    }

    const type =
      operationType === "deposit" ||
      operationType === "customerPayment"
        ? "in"
        : "out";

    const cashTransactions =
      JSON.parse(localStorage.getItem("cashTransactions")) || [];

    const customer =
      customers.find(c => String(c.customerNumber) === String(customerId));

    const supplier =
      suppliers.find(s => s.id === Number(supplierId));

    const newTransaction = {
      id: editId ? Number(editId) : Date.now(),
      type,
      operationType,
      amount: Number(amount),

      customerCode: customer ? customer.customerNumber : "",
      customerName: customer ? customer.name : "",

      supplierName: supplier ? supplier.name : "",
      expenseType: expenseType || "",

      description: description,
      date
    };

    /* ===================== */
    /* ✅ تعديل أو إضافة */
    /* ===================== */
    let updated;

    if (editId) {
      updated = cashTransactions.map(t =>
        String(t.id) === String(editId) ? newTransaction : t
      );
    } else {
      updated = [...cashTransactions, newTransaction];
    }

    localStorage.setItem(
      "cashTransactions",
      JSON.stringify(updated)
    );

    alert(editId ? "تم تعديل العملية ✅" : "تم حفظ العملية بنجاح ✅");

    setAmount("");
    setDescription("");
    setExpenseType("");
    setCustomerId("");
    setSupplierId("");
  };

  return (
    <div className="container">
      <h3 className="mb-4">💰 إضافة حركة خزينة</h3>

      <div className="card">
        <div className="card-body row g-3">

          <div className="col-md-3">
            <label>نوع العملية</label>
            <select
              className="form-select"
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
            >
              <option value="deposit">إيداع</option>
              <option value="expense">مصروف</option>
              <option value="customerPayment">تحصيل عميل</option>
              <option value="supplierPayment">دفع مورد</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          {operationType === "expense" && (
            <div className="col-md-3">
              <label>نوع المصروف</label>
              <select
                className="form-select"
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
              >
                <option value="">اختر المصروف</option>

                {expenseDefinitions.map(e => (
                  <option key={e.id} value={e.name}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {operationType === "customerPayment" && (
            <div className="col-md-3">
              <label>العميل</label>
              <select
                className="form-select"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">اختر العميل</option>

                {customers.map(c => (
                  <option key={c.customerNumber} value={c.customerNumber}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {operationType === "supplierPayment" && (
            <div className="col-md-3">
              <label>المورد</label>
              <select
                className="form-select"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">اختر المورد</option>

                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-md-3">
            <label>المبلغ</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label>التاريخ</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="col-md-12">
            <label>الوصف</label>
            <input
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-md-12">
            <button
              className="btn btn-success"
              onClick={handleSave}
            >
              💾 حفظ
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddCashTransaction;