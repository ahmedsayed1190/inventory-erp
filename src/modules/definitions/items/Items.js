import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWarehouses } from "../../../context/WarehouseContext";
import { useTranslation } from "react-i18next";

function Items() {
  const { warehouses } = useWarehouses();
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* ===== Helpers ===== */
  const getTodayDate = () => new Date().toISOString().slice(0, 10);
  const getNowTime = () => new Date().toTimeString().slice(0, 5);

  /* ===== Items ===== */
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  /* ===== Units System ===== */
  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem("units");
    return saved ? JSON.parse(saved) : ["pcs", "box", "kg"];
  });

  const [unit, setUnit] = useState(() => {
  const saved = localStorage.getItem("units");
  const list = saved ? JSON.parse(saved) : ["pcs", "box", "kg"];
  return list.length ? list[0] : "";
});
useEffect(() => {
  if (units.length) {
    setUnit(units[0]);
  }
}, [units]);

  const [newUnit, setNewUnit] = useState("");
  const [showUnitManager, setShowUnitManager] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  /* ===== Auto Serial ===== */
  const getNextSerial = (list = items) => {
    if (!list.length) return 1;
    return Math.max(...list.map(i => i.serial || 0)) + 1;
  };

  const [serial, setSerial] = useState(() => getNextSerial());

  /* ===== Navigation ===== */
  const [currentIndex, setCurrentIndex] = useState(-1);

  /* ===== Form Fields ===== */
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
const [selectedWarehouse, setSelectedWarehouse] = useState("");
const [openingQty, setOpeningQty] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [createdDate, setCreatedDate] = useState(getTodayDate());
  const [createdTime, setCreatedTime] = useState(getNowTime());
  /* ===== Search System ===== */
const [showSearchModal, setShowSearchModal] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
  if (!searchTerm.trim()) {
    setFilteredItems(items);
    return;
  }

  const words = searchTerm.toLowerCase().split(" ");

  const results = items.filter(item => {
    const name = (item.name || "").toLowerCase();
const code = (item.code || "").toLowerCase();

    return words.every(word =>
      name.includes(word) || code.includes(word)
    );
  });

  setFilteredItems(results);
}, [searchTerm, items]);
  /* ===== Save Item ===== */
  const saveItem = () => {

  if (!code || !name || !unit || !costPrice || !salePrice || !selectedWarehouse) {
    alert(t("items.completeData"));
    return;
  }

  if (Number(openingQty) < 0) {
    alert("الكمية غير صحيحة");
    return;
  }

  // منع تكرار الكود
  const codeExists = items.some(
    (item, index) =>
      item.code === code && index !== currentIndex
  );

  if (codeExists) {
    alert("الكود مسجل مسبقًا ❌");
    return;
  }

  // منع تكرار الاسم
  const nameExists = items.some(
    (item, index) =>
      item.name.toLowerCase() === name.toLowerCase() &&
      index !== currentIndex
  );

  if (nameExists) {
    alert("اسم الصنف مسجل مسبقًا ❌");
    return;
  }

  let updatedItems = [...items];

const itemData = {
  id: Date.now(),
  serial,
  code,
  name,
  unit,

  /* رصيد أول المدة لكل مخزن */
  openingQty: {
    [selectedWarehouse]: Number(openingQty)
  },

  /* الكمية الحالية */
  warehouses: {
    [selectedWarehouse]: Number(openingQty)
  },

  costPrice: Number(costPrice),
  salePrice: Number(salePrice),
  createdDate,
  createdTime
};

  if (currentIndex === -1) {

  updatedItems.push(itemData);

  /* ===== تسجيل حركة مخزون أول المدة ===== */

  if (Number(openingQty) > 0) {

    let movements =
      JSON.parse(localStorage.getItem("stockMovements")) || [];

    movements.push({
      date: createdDate,
      code: code,
      warehouse: selectedWarehouse,
      type: "opening_balance",
      description: "رصيد أول المدة",
      party: "",
      in: Number(openingQty),
      out: 0,
      reference: "opening"
    });

    localStorage.setItem(
      "stockMovements",
      JSON.stringify(movements)
    );

  }

} else {

  updatedItems[currentIndex] = {
    ...updatedItems[currentIndex],
    ...itemData
  };

}

 setItems(updatedItems);
localStorage.setItem("items", JSON.stringify(updatedItems));

setSerial(getNextSerial(updatedItems));
resetForm(false);

alert("تم حفظ الصنف بنجاح ✅");
};

  /* ===== Load Item ===== */
  const loadItem = (index) => {
    const item = items[index];
    if (!item) return;

    setCurrentIndex(index);
    setSerial(item.serial);
    setCode(item.code);
    setName(item.name);
    setUnit(item.unit || "");
    if (item.openingQty && Object.keys(item.openingQty).length > 0) {
  const warehouseId = Object.keys(item.openingQty)[0];
  setSelectedWarehouse(warehouseId);
  setOpeningQty(item.openingQty[warehouseId]);
} else {
  setSelectedWarehouse("");
  setOpeningQty("");
}

    setCostPrice(item.costPrice);
    setSalePrice(item.salePrice);
    setCreatedDate(item.createdDate);
    setCreatedTime(item.createdTime);
  };

  const goFirst = () => items.length && loadItem(0);
  const goLast = () => items.length && loadItem(items.length - 1);
  const goPrev = () => currentIndex > 0 && loadItem(currentIndex - 1);
  const goNext = () =>
    currentIndex >= items.length - 1 ? resetForm() : loadItem(currentIndex + 1);

  const resetForm = (resetSerial = true) => {
    setCurrentIndex(-1);
    if (resetSerial) setSerial(getNextSerial());
    setCode("");
    setName("");
setUnit(units.length ? units[0] : "");

    setSelectedWarehouse("");
setOpeningQty("");
    setCostPrice("");
    setSalePrice("");
    setCreatedDate(getTodayDate());
    setCreatedTime(getNowTime());
  };

  return (
    <div className="container">
      <h3 className="mb-3">📦 {t("items.title")}</h3>

      <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
        <button className="btn btn-outline-secondary btn-sm" onClick={goFirst}>⏮</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={goPrev}>◀️</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={goNext}>▶️</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={goLast}>⏭</button>
        <button
  className="btn btn-outline-dark btn-sm"
  onClick={() => setShowSearchModal(true)}
>
  🔎 بحث صنف
</button>

        <button className="btn btn-success btn-sm ms-2" onClick={saveItem}>
          💾 حفظ / جديد
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate("/lists/items")}
        >
          📋 قائمة الأصناف
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">

          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label>التاريخ</label>
              <input type="date" className="form-control" value={createdDate} onChange={e => setCreatedDate(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label>الوقت</label>
              <input type="time" className="form-control" value={createdTime} onChange={e => setCreatedTime(e.target.value)} />
            </div>
          </div>

          <div className="row g-3">

            <div className="col-md-2">
              <label>رقم الصنف</label>
              <input className="form-control" value={serial} readOnly />
            </div>

            <div className="col-md-2">
              <label>الكود</label>
              <input className="form-control" value={code} onChange={e => setCode(e.target.value)} />
            </div>

            <div className="col-md-3">
              <label>الاسم</label>
              <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>

           <div className="col-md-2">
  <label>الوحدة</label>

  <div className="d-flex gap-2">

    <select
      className="form-select"
      value={unit}
      onChange={(e) => setUnit(e.target.value)}
    >
      {units.map((u, i) => (
  <option key={i} value={u}>
    {u} {unit === u ? "⭐ Default" : ""}
  </option>
))}
    </select>

    <button
      type="button"
      className="btn btn-outline-secondary"
      onClick={() => setShowUnitManager(true)}
    >
      ⚙
    </button>

  </div>
</div>

            <div className="col-12">
  <div className="row g-3 mt-2">

  <div className="col-md-4">
    <label>مخزن أول المدة</label>
    <select
      className="form-select"
      value={selectedWarehouse}
      onChange={(e) => setSelectedWarehouse(e.target.value)}
    >
      <option value="">اختر المخزن</option>

      {warehouses.map((w) => (
        <option key={w.id} value={w.id}>
          {w.name}
        </option>
      ))}

    </select>
  </div>
  </div>

  <div className="col-md-4">
    <label>كمية أول المدة</label>
    <input
      type="number"
      className="form-control"
      value={openingQty}
      onChange={(e) => setOpeningQty(e.target.value)}
    />
  </div>

</div>
  

</div>
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <label>تكلفة الوحدة</label>
              <input type="number" className="form-control" value={costPrice} onChange={e => setCostPrice(e.target.value)} />
            </div>

            <div className="col-md-3">
              <label>سعر البيع</label>
              <input type="number" className="form-control" value={salePrice} onChange={e => setSalePrice(e.target.value)} />
            </div>
          </div>

        </div>
      </div>

      {showUnitManager && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>إدارة الوحدات</h5>

              <div className="d-flex gap-2 mb-3">
                <input
                  className="form-control"
                  placeholder="وحدة جديدة"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!newUnit.trim()) return;
                    if (units.includes(newUnit.trim())) {
                      alert("الوحدة موجودة بالفعل");
                      return;
                    }
                    const updated = [...units, newUnit.trim()];
                    setUnits(updated);
setUnit(updated[0]); // أول وحدة تبقى الافتراضية
localStorage.setItem("units", JSON.stringify(updated));
setNewUnit("");
                  }}
                >
                  إضافة
                </button>
              </div>

              {units.map((u, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                  {editIndex === i ? (
                    <>
                      <input
                        className="form-control me-2"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          if (!editValue.trim()) return;
                          const updated = [...units];
                          updated[i] = editValue.trim();
                          setUnits(updated);
                          localStorage.setItem("units", JSON.stringify(updated));
                          setEditIndex(null);
                          setEditValue("");
                        }}
                      >
                        حفظ
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{u}</span>
                      <div className="d-flex gap-2">

<button
  className="btn btn-info btn-sm"
  onClick={() => setUnit(u)}
>
⭐
</button>

<button
  className="btn btn-warning btn-sm"
  onClick={() => {
    setEditIndex(i);
    setEditValue(u);
  }}
>
✏
</button>

<button
  className="btn btn-danger btn-sm"
  onClick={() => {
    if (!window.confirm("حذف الوحدة؟")) return;
    const updated = units.filter((_, index) => index !== i);
    setUnits(updated);
    localStorage.setItem("units", JSON.stringify(updated));
    if (unit === u) setUnit(updated.length ? updated[0] : "");
  }}
>
🗑
</button>
</div>
                    </>
                  )}
                </div>
              ))}

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowUnitManager(false)}
                >
                  إغلاق
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===== Search Modal ===== */}
      {showSearchModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">

              <h5>🔎 بحث الأصناف</h5>

              <input
                className="form-control mb-3"
                placeholder="اكتب أي جزء من الاسم أو الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div style={{ maxHeight: 300, overflowY: "auto" }}>
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 border-bottom"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const itemIndex = items.findIndex(i => i.id === item.id);
                      loadItem(itemIndex);
                      setShowSearchModal(false);
                      setSearchTerm("");
                    }}
                  >
                    <strong>{item.code}</strong> — {item.name}
                  </div>
                ))}
              </div>

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowSearchModal(false);
                    setSearchTerm("");
                  }}
                >
                  إغلاق
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Items;