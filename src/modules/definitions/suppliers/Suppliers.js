import { useState, useEffect, useCallback } from "react";
import usePermission from "../../../hooks/usePermission";
const today = new Date().toISOString().slice(0,10);
function Suppliers() {
  const { canView, canAdd, canDelete } = usePermission("suppliers");

  /* ===== State ===== */
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem("suppliers");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [supplierNumber, setSupplierNumber] = useState("");
  const [name, setName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState(today);

  /* ===== Auto Number ===== */
  const getNextNumber = useCallback(() => {
    if (!suppliers.length) return 1;
    return Math.max(...suppliers.map(s => s.supplierNumber || 0)) + 1;
  }, [suppliers]);

  /* ===== Reset ===== */
  const resetForm = useCallback(() => {
    setCurrentIndex(-1);
    setSupplierNumber(getNextNumber());
    setName("");
    setOpeningBalance("");
    setPhone("");
    setAddress("");
  }, [getNextNumber]);

  useEffect(() => {
    setSupplierNumber(getNextNumber());
  }, [getNextNumber]);

  if (!canView) {
    return (
      <div className="alert alert-danger">
        🚫 ليس لديك صلاحية عرض الموردين
      </div>
    );
  }

  /* ===== Save ===== */
  const saveSupplier = () => {
    if (!name.trim()) {
      alert("أدخل اسم المورد");
      return;
    }

    const exists = suppliers.some(
      (s, index) =>
        s.name.toLowerCase() === name.toLowerCase() &&
        index !== currentIndex
    );

    if (exists) {
      alert("اسم المورد مسجل مسبقًا ❌");
      return;
    }

    const supplierData = {
      id: currentIndex === -1 ? Date.now() : suppliers[currentIndex].id,
      supplierNumber,
      name,
      phone,
      address,
      date,
      openingBalance: Number(openingBalance) || 0,
      balance:
        currentIndex === -1
          ? Number(openingBalance) || 0
          : suppliers[currentIndex].balance
    };

    const updated = [...suppliers];

    if (currentIndex === -1) updated.push(supplierData);
    else updated[currentIndex] = supplierData;

    setSuppliers(updated);
    localStorage.setItem("suppliers", JSON.stringify(updated));
    resetForm();
  };

  /* ===== Delete ===== */
  const deleteSupplier = () => {
    if (currentIndex === -1) return;

    if (!window.confirm("حذف المورد؟")) return;

    const purchaseInvoices =
      JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

    const hasTransactions = purchaseInvoices.some(
      inv => inv.supplierNumber === supplierNumber
    );

    if (hasTransactions) {
      alert("لا يمكن حذف مورد عليه فواتير ❌");
      return;
    }

    const updated = suppliers.filter((_, i) => i !== currentIndex);
    setSuppliers(updated);
    localStorage.setItem("suppliers", JSON.stringify(updated));
    resetForm();
  };

  /* ===== Navigation ===== */
  const first = () => suppliers.length && load(0);
  const last = () => suppliers.length && load(suppliers.length - 1);
  const next = () =>
    currentIndex < suppliers.length - 1 &&
    load(currentIndex + 1);
  const prev = () =>
    currentIndex > 0 &&
    load(currentIndex - 1);

  const load = (index) => {
    const s = suppliers[index];
    if (!s) return;

    setCurrentIndex(index);
    setSupplierNumber(s.supplierNumber);
    setName(s.name);
    setOpeningBalance(s.openingBalance);
    setPhone(s.phone || "");
    setAddress(s.address || "");
  };

  return (
    <div className="container">
      <h3 className="mb-3">🚚 تعريف الموردين</h3>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button className="btn btn-outline-secondary btn-sm" onClick={first}>⏮</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={prev}>◀️</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={next}>▶️</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={last}>⏭</button>

        {canAdd && (
          <button className="btn btn-success btn-sm" onClick={saveSupplier}>
            💾 حفظ / جديد
          </button>
        )}

        <button
          className="btn btn-danger btn-sm"
          disabled={!canDelete || currentIndex === -1}
          onClick={deleteSupplier}
        >
          🗑 حذف
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-2">
  <label>التاريخ</label>
  <input
    type="date"
    className="form-control"
    value={date}
    onChange={e => setDate(e.target.value)}
  />
</div>

            <div className="col-md-2">
              <label>رقم المورد</label>
              <input className="form-control" value={supplierNumber} disabled />
            </div>

            <div className="col-md-3">
              <label>اسم المورد</label>
              <input
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>الرصيد الافتتاحي</label>
              <input
                type="number"
                className="form-control"
                value={openingBalance}
                onChange={e => setOpeningBalance(e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>الموبايل</label>
              <input
                className="form-control"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label>العنوان</label>
              <input
                className="form-control"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Suppliers;