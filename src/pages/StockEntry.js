import { useState } from "react";

function StockEntry() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");

  const addStock = () => {
    if (!itemId || !qty) {
      alert("من فضلك اختر الصنف وأدخل الكمية");
      return;
    }

    const updated = items.map((item) =>
      item.id === Number(itemId)
        ? { ...item, qty: (item.qty || 0) + Number(qty) }
        : item
    );

    setItems(updated);
    localStorage.setItem("items", JSON.stringify(updated));

    setItemId("");
    setQty("");
  };

  return (
    <div className="container">
      <h3 className="mb-4">📥 إدخال مخزون</h3>

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
                    {item.name}
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
              <button className="btn btn-success" onClick={addStock}>
                إضافة للمخزون
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StockEntry;