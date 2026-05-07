import { useState, useMemo } from "react";

function ItemMovementSummary() {

  /* ===== DATA ===== */
 const items = useMemo(() => {
  return JSON.parse(localStorage.getItem("items")) || [];
}, []);

const stockMovements = useMemo(() => {
  return JSON.parse(localStorage.getItem("stockMovements")) || [];
}, []);

const warehouses = useMemo(() => {
  return JSON.parse(localStorage.getItem("warehouses")) || [];
}, []);

  /* ===== FILTERS ===== */
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  /* ===== BUILD SUMMARY ===== */
  const summary = useMemo(() => {

    return items.map(item => {

      let inQty = 0;
      let outQty = 0;

      stockMovements.forEach(m => {

        if (String(m.code) !== String(item.code)) return;

        if (selectedWarehouse && String(m.warehouse) !== String(selectedWarehouse)) return;

        inQty += Number(m.in || 0);
        outQty += Number(m.out || 0);
      });

      const balanceQty = inQty - outQty;
      const unitCost = Number(item.costPrice || 0);

      const warehouseName =
        warehouses.find(w => String(w.id) === String(selectedWarehouse))?.name
        || (selectedWarehouse ? selectedWarehouse : "كل المخازن");

      return {
        code: item.code,
        name: item.name,
        warehouse: warehouseName,
        inQty,
        outQty,
        balanceQty,
        unitCost,
        balanceValue: balanceQty * unitCost
      };

    })
    .filter(row => {

      if (searchName && !row.name.toLowerCase().includes(searchName.toLowerCase()))
        return false;

      if (searchCode && !String(row.code).includes(searchCode))
        return false;

      return true;
    });

  }, [items, stockMovements, selectedWarehouse, searchName, searchCode, warehouses]);

  /* ===== TOTALS ===== */
  const totals = useMemo(() => {

    let totalIn = 0;
    let totalOut = 0;
    let totalBalance = 0;
    let totalValue = 0;

    summary.forEach(r => {
      totalIn += r.inQty;
      totalOut += r.outQty;
      totalBalance += r.balanceQty;
      totalValue += r.balanceValue;
    });

    return { totalIn, totalOut, totalBalance, totalValue };

  }, [summary]);

  return (

    <div className="container">

      <h4 className="invoice-title">
  📊 ملخص حركة الصنف
</h4>

      {/* ===== FILTERS ===== */}
      <div className="row mb-3">

        <div className="col-md-3 position-relative">

  <input
  className="form-control"
  placeholder="بحث بالاسم"
  value={searchName}
  onFocus={() => searchName && setShowDropdown(true)}
  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
  onChange={(e) => {
    setSearchName(e.target.value);
    setSearchCode("");
    setShowDropdown(true);
  }}
/>

  {showDropdown && searchName && (
    <div
      style={{
        position: "absolute",
        background: "#0f172a",
        color: "#fff",
        border: "1px solid #334155",
        width: "100%",
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 999
      }}
    >

      {items
        .filter(i =>
          i.name.toLowerCase().includes(searchName.toLowerCase())
        )
        .map(i => (

          <div
            key={i.code}
            style={{
              padding: "6px 10px",
              cursor: "pointer",
              borderBottom: "1px solid #1e293b"
            }}
            onClick={() => {
              setSearchName(i.name);
// يقفل dropdown
setTimeout(() => setSearchName(i.name), 0);
              setSearchCode(i.code);
            }}
          >
            {i.code} - {i.name}
          </div>

        ))}

    </div>
  )}

</div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="بحث بالكود"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">كل المخازن</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ===== TABLE ===== */}
      <div className="card">
        <div className="card-body">

          <table className="table table-bordered invoice-table">

            <thead className="table-dark">
              <tr>
                <th>اسم الصنف</th>
                <th>كود الصنف</th>
                <th>المخزن</th>
                <th>الوارد</th>
                <th>المنصرف</th>
                <th>الرصيد</th>
                <th>تكلفة الوحدة</th>
                <th>القيمة</th>
              </tr>
            </thead>

            <tbody>

              {summary.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    لا توجد بيانات
                  </td>
                </tr>
              )}

              {summary.map((row, i) => (
                <tr key={row.code}>
                  <td>{row.name}</td>
                  <td>{row.code}</td>
                  <td>{row.warehouse}</td>
                  <td>{row.inQty}</td>
                  <td className="text-danger">{row.outQty}</td>
                  <td>{row.balanceQty}</td>
                  <td>{row.unitCost}</td>
                  <td>{row.balanceValue}</td>
                </tr>
              ))}

            </tbody>

            {/* ===== TOTAL ===== */}
            <tfoot>
              <tr style={{ fontWeight: "bold", background: "#f1f5f9" }}>
                <td colSpan="3">الإجمالي</td>
                <td>{totals.totalIn}</td>
                <td>{totals.totalOut}</td>
                <td>{totals.totalBalance}</td>
                <td>-</td>
                <td>{totals.totalValue}</td>
              </tr>
            </tfoot>

          </table>

        </div>
      </div>

    </div>
  );
}

export default ItemMovementSummary;