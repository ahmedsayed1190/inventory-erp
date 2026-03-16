import { useState, useEffect } from "react";
import { useWarehouses } from "../context/WarehouseContext";

function StockTransfer() {
  const { warehouses } = useWarehouses();

  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("items")) || [];
  });

  const [draftTransfers, setDraftTransfers] = useState([]);

  const [itemSearch, setItemSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemList, setShowItemList] = useState(false);

  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [qty, setQty] = useState("");
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [availableQty, setAvailableQty] = useState(0);

  /* ===============================
     حساب الكمية المتاحة
  =============================== */
  useEffect(() => {
    if (!selectedItem || !fromWarehouse) {
      setAvailableQty(0);
      return;
    }

    const qtyInWarehouse =
      selectedItem.warehouses &&
      selectedItem.warehouses[fromWarehouse] != null
        ? Number(selectedItem.warehouses[fromWarehouse])
        : 0;

    setAvailableQty(qtyInWarehouse);
  }, [selectedItem, fromWarehouse]);

  /* ===============================
     إضافة للجدول المؤقت
  =============================== */
  const addToDraft = () => {
    if (!selectedItem || !fromWarehouse || !toWarehouse || !qty) {
      alert("اكمل كل البيانات");
      return;
    }

    if (fromWarehouse === toWarehouse) {
      alert("لا يمكن التحويل لنفس المخزن");
      return;
    }

    if (availableQty === 0) {
      alert("لا يوجد رصيد في هذا المخزن");
      return;
    }

    if (Number(qty) > availableQty) {
      alert("الكمية غير متاحة");
      return;
    }

    setDraftTransfers((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: transferDate,
        code: selectedItem.code,
        name: selectedItem.name,
        fromWarehouse,
        toWarehouse,
        qty: Number(qty),
      },
    ]);

    // Reset
    setSelectedItem(null);
    setItemSearch("");
    setQty("");
    setFromWarehouse("");
    setToWarehouse("");
    setAvailableQty(0);
    setShowItemList(false);
  };

  /* ===============================
     حذف من الجدول
  =============================== */
  const removeDraftItem = (id) => {
    setDraftTransfers((prev) =>
      prev.filter((d) => d.id !== id)
    );
  };

  /* ===============================
     حفظ التحويل
  =============================== */
  const saveAllTransfers = () => {
    if (!draftTransfers.length) {
      alert("لا توجد أصناف للحفظ");
      return;
    }

    const updatedItems = items.map((item) => {
      const relatedTransfers = draftTransfers.filter(
        (t) => t.code === item.code
      );

      if (!relatedTransfers.length) return item;

      let updatedWarehouses = { ...item.warehouses };

      relatedTransfers.forEach((t) => {
        const sourceQty =
          Number(updatedWarehouses[t.fromWarehouse] || 0);

        if (sourceQty < t.qty) {
          alert(`رصيد غير كافي للصنف ${item.name}`);
          throw new Error("Insufficient stock");
        }

        // خصم
        updatedWarehouses[t.fromWarehouse] =
          sourceQty - t.qty;

        // إضافة
        updatedWarehouses[t.toWarehouse] =
          Number(updatedWarehouses[t.toWarehouse] || 0) +
          t.qty;
      });

      return {
        ...item,
        warehouses: updatedWarehouses,
      };
    });

    localStorage.setItem("items", JSON.stringify(updatedItems));

    const oldTransfers =
      JSON.parse(localStorage.getItem("stockTransfers")) || [];

    localStorage.setItem(
      "stockTransfers",
      JSON.stringify([...oldTransfers, ...draftTransfers])
    );
    

    setItems(updatedItems);

/* ===== تسجيل حركة المخزون ===== */

let movements =
JSON.parse(localStorage.getItem("stockMovements")) || [];

draftTransfers.forEach((t) => {

const fromName =
  warehouses.find(w => String(w.id) === String(t.fromWarehouse))?.name || t.fromWarehouse;

const toName =
  warehouses.find(w => String(w.id) === String(t.toWarehouse))?.name || t.toWarehouse;

movements.push({
date: t.date,
code: t.code,
warehouse: t.fromWarehouse,
type: "transfer_out",
description: `تحويل من ${fromName} إلى ${toName}`,
in: 0,
out: Number(t.qty),
reference: t.id
});

movements.push({
date: t.date,
code: t.code,
warehouse: t.toWarehouse,
type: "transfer_in",
description: `تحويل من ${fromName} إلى ${toName}`,
in: Number(t.qty),
out: 0,
reference: t.id
});
});

localStorage.setItem(
"stockMovements",
JSON.stringify(movements)
);

/* ============================= */

setDraftTransfers([]);

alert("✅ تم حفظ التحويل بنجاح");
  };

  return (
    <div className="container">
      <h3 className="mb-3">🔁 تحويل بين المخازن</h3>

      <div className="mb-3">
        <button className="btn btn-success" onClick={saveAllTransfers}>
          💾 حفظ التحويل
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body row g-2">

          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
            />
          </div>

          {/* بحث الصنف */}
          <div className="col-md-3 position-relative">
            <input
              className="form-control"
              placeholder="بحث عن صنف"
              value={itemSearch}
              onChange={(e) => {
                setItemSearch(e.target.value);
                setShowItemList(true);
                setSelectedItem(null);
              }}
            />

            {showItemList && itemSearch && !selectedItem && (
              <div className="border bg-white position-absolute w-100" style={{ zIndex: 1000 }}>
                {items
                  .filter((i) =>
                    i.name
                      .toLowerCase()
                      .includes(itemSearch.toLowerCase())
                  )
                  .map((i) => (
                    <div
                      key={i.code}
                      className="p-2 border-bottom"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedItem(i);
                        setItemSearch(i.name);
                        setShowItemList(false);
                      }}
                    >
                      {i.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={fromWarehouse}
              onChange={(e) => setFromWarehouse(e.target.value)}
            >
              <option value="">من مخزن</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
            <small className="text-muted">
              المتاح: {availableQty}
            </small>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              value={toWarehouse}
              onChange={(e) => setToWarehouse(e.target.value)}
            >
              <option value="">إلى مخزن</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="الكمية"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className="col-md-1 d-grid">
            <button
              className="btn btn-secondary"
              onClick={addToDraft}
            >
              ➕
            </button>
          </div>

        </div>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>التاريخ</th>
            <th>الصنف</th>
            <th>من</th>
            <th>إلى</th>
            <th>الكمية</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {draftTransfers.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                لا توجد أصناف مضافة
              </td>
            </tr>
          )}

          {draftTransfers.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
             <td>{t.name}</td>

<td>
  {warehouses.find(w => w.id === t.fromWarehouse)?.name}
</td>

<td>
  {warehouses.find(w => w.id === t.toWarehouse)?.name}
</td>
              <td>{t.qty}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeDraftItem(t.id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockTransfer;