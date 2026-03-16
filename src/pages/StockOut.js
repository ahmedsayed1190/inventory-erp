import { useState } from "react";

function StockOut() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");

  const removeStock = () => {
    const item = items.find(i => i.id === Number(itemId));
    if (!item) return;

    if (Number(qty) > item.qty) {
      alert("الكمية غير متاحة في المخزون");
      return;
    }

    const updated = items.map((i) =>
      i.id === item.id
        ? { ...i, qty: i.qty - Number(qty) }
        : i
    );

    setItems(updated);
    localStorage.setItem("items", JSON.stringify(updated));

    setItemId("");
    setQty("");
  };

  return (
    <div className="container">
      <h3 className="mb-4">📤 خروج مخزون</h3>

      <div className="card">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-5">
              <select
                className="form-select"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              >
                <option value="">اختر الصنف</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} (متاح: {item.qty})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="الكمية"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>

            <div className="col-md-3 d-grid">
              <button className="btn btn-danger" onClick={removeStock}>
                صرف من المخزون
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StockOut;