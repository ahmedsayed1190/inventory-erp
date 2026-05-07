import { useState, useMemo } from "react";
import { useWarehouses } from "../context/WarehouseContext";


function StockReport() {

  const { warehouses } = useWarehouses();
  const items = JSON.parse(localStorage.getItem("items")) || [];

  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [showNameDropdown, setShowNameDropdown] = useState(false);
const [showCodeDropdown, setShowCodeDropdown] = useState(false);

  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const [fromDate, setFromDate] = useState(lastMonth.toISOString().slice(0,10));
  const [toDate, setToDate] = useState(today.toISOString().slice(0,10));

  const reportData = useMemo(()=>{

    const items = JSON.parse(localStorage.getItem("items")) || [];
    const purchases = JSON.parse(localStorage.getItem("purchaseInvoices")) || [];
    const purchaseReturns = JSON.parse(localStorage.getItem("purchaseReturns")) || [];
    const sales = JSON.parse(localStorage.getItem("salesInvoices")) || [];
    const salesReturns = JSON.parse(localStorage.getItem("salesReturns")) || [];

    let rows = [];

    items.forEach(item=>{

      if (
  (searchItem && !item.name.toLowerCase().includes(searchItem.toLowerCase())) ||
  (searchCode && !String(item.code).includes(searchCode))
) return;

      let purchaseQty = 0;
      let purchaseReturnQty = 0;
      let salesQty = 0;
      let salesReturnQty = 0;
      let opening = 0;

      /* ===== رصيد أول المدة ===== */

      Object.entries(item.openingQty || {}).forEach(([wh, qty]) => {
        if (selectedWarehouse && String(wh) !== String(selectedWarehouse)) return;
        opening += Number(qty);
      });

      /* ===== قبل الفترة ===== */

      purchases.forEach(inv => {
        const d = new Date(inv.date);
        if (d >= new Date(fromDate)) return;
        if (
  selectedWarehouse &&
  String(inv.warehouse || inv.warehouseId) !== String(selectedWarehouse)
) return;

        inv.items?.forEach(it => {
          if (it.code === item.code) opening += Number(it.qty);
        });
      });

      purchaseReturns.forEach(ret => {
        const d = new Date(ret.date);
        if (d >= new Date(fromDate)) return;
        if (selectedWarehouse && String(ret.warehouseId) !== String(selectedWarehouse)) return;

        ret.items?.forEach(it => {
          if (it.code === item.code) opening -= Number(it.qty);
        });
      });

      sales.forEach(inv => {
        const d = new Date(inv.date);
        if (d >= new Date(fromDate)) return;
        if (selectedWarehouse && String(inv.warehouse) !== String(selectedWarehouse)) return;

        inv.items?.forEach(it => {
          if (it.code === item.code) opening -= Number(it.qty);
        });
      });

      salesReturns.forEach(ret => {
        const d = new Date(ret.date);
        if (d >= new Date(fromDate)) return;
        if (selectedWarehouse && String(ret.warehouseId) !== String(selectedWarehouse)) return;

        ret.items?.forEach(it => {
          if (it.code === item.code) opening += Number(it.qty);
        });
      });

      /* ===== خلال الفترة ===== */

      purchases.forEach(inv=>{
        const d = new Date(inv.date);
        if(d < new Date(fromDate) || d > new Date(toDate)) return;
        if (
  selectedWarehouse &&
  String(inv.warehouse || inv.warehouseId) !== String(selectedWarehouse)
) return;

        inv.items?.forEach(it=>{
          if(it.code === item.code){
            purchaseQty += Number(it.qty);
          }
        });
      });

      purchaseReturns.forEach(ret=>{
        const d = new Date(ret.date);
        if(d < new Date(fromDate) || d > new Date(toDate)) return;
        if(selectedWarehouse && String(ret.warehouseId) !== String(selectedWarehouse)) return;

        ret.items?.forEach(it=>{
          if(it.code === item.code){
            purchaseReturnQty += Number(it.qty);
          }
        });
      });

      sales.forEach(inv=>{
        const d = new Date(inv.date);
        if(d < new Date(fromDate) || d > new Date(toDate)) return;
        if (selectedWarehouse && String(inv.warehouse) !== String(selectedWarehouse)) return;

        inv.items?.forEach(it=>{
          if(it.code === item.code){
            salesQty += Number(it.qty);
          }
        });
      });

      salesReturns.forEach(ret=>{
        const d = new Date(ret.date);
        if(d < new Date(fromDate) || d > new Date(toDate)) return;
        if(selectedWarehouse && String(ret.warehouseId) !== String(selectedWarehouse)) return;

        ret.items?.forEach(it=>{
          if(it.code === item.code){
            salesReturnQty += Number(it.qty);
          }
        });
      });

      /* ===== الرصيد ===== */

      const balance =
        opening + purchaseQty - purchaseReturnQty - salesQty + salesReturnQty;

      const warehouseName =
        selectedWarehouse
          ? warehouses.find(w => String(w.id) === String(selectedWarehouse))?.name
          : "كل المخازن";

      rows.push({
        code: item.code,
        name: item.name,
        warehouse: warehouseName,
        opening,
        purchaseQty,
        purchaseReturnQty,
        salesQty,
        salesReturnQty,
        balance,
        value: balance * Number(item.costPrice || 0)
      });

    });

    return rows;

  }, [selectedWarehouse,searchItem,searchCode,fromDate,toDate,warehouses]);

  const totalQty = reportData.reduce((s,r)=> s + r.balance ,0);
  const totalValue = reportData.reduce((s,r)=> s + r.value ,0);

  return (
    <div className="container">

      <h3 className="mb-4">📦 تقرير كميات الأصناف</h3>

      <div className="card mb-3">
       <div className="card-body row g-2">

  <div className="col-md-2">
    <select
      className="form-select"
      value={selectedWarehouse}
      onChange={e=>setSelectedWarehouse(e.target.value)}
    >
      <option value="">كل المخازن</option>
      {warehouses.map(w=>(
        <option key={w.id} value={String(w.id)}>
          {w.name}
        </option>
      ))}
    </select>
  </div>

  <div className="col-md-2 position-relative">

  <input
    className="form-control"
    placeholder="بحث بالاسم"
    value={searchItem}
    onChange={(e) => {
      setSearchItem(e.target.value);
      setShowNameDropdown(true);
setShowCodeDropdown(false);
    }}
  />

  {showNameDropdown && searchItem && (
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
          i.name.toLowerCase().includes(searchItem.toLowerCase())
        )
        .map(i => (

          <div
            key={i.code}
            style={{
              padding: "6px",
              cursor: "pointer"
            }}
            onClick={() => {
              setSearchItem(i.name);
              setSearchCode(i.code);
              setShowNameDropdown(false); // 🔥 يقفل
            }}
          >
            {i.code} - {i.name}
          </div>

        ))}

    </div>
  )}

</div>

  <div className="col-md-2 position-relative">

  <input
    className="form-control"
    placeholder="بحث بالكود"
    value={searchCode}
    onChange={(e) => {
      setSearchCode(e.target.value);
      setSearchItem("");
      setShowCodeDropdown(true);
setShowNameDropdown(false);
    }}
  />

  {showCodeDropdown && searchCode && (
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
          String(i.code).includes(searchCode)
        )
        .map(i => (

          <div
            key={i.code}
            style={{
              padding: "6px",
              cursor: "pointer"
            }}
            onClick={() => {
  setSearchCode(i.code);
  setSearchItem(i.name);
  setShowCodeDropdown(false); // ✅ الصح
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
      type="date"
      className="form-control"
      value={fromDate}
      onChange={e=>setFromDate(e.target.value)}
    />
  </div>

  <div className="col-md-3">
    <input
      type="date"
      className="form-control"
      value={toDate}
      onChange={e=>setToDate(e.target.value)}
    />
  </div>

</div>
      </div>

      <table className="table table-bordered table-striped">

        <thead className="table-dark">
          <tr>
            <th>الكود</th>
            <th>الصنف</th>
            <th>المخزن</th>
            <th>رصيد أول</th>
            <th>المشتريات</th>
            <th>مرتجع شراء</th>
            <th>المبيعات</th>
            <th>مرتجع بيع</th>
            <th>الرصيد</th>
            <th>قيمة المخزون</th>
          </tr>
        </thead>

        <tbody>

          {reportData.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center">
                لا توجد بيانات
              </td>
            </tr>
          )}

          {reportData.map((r,i)=>(
            <tr key={i}>
              <td>{r.code}</td>
              <td>{r.name}</td>
              <td>{r.warehouse}</td>
              <td>{r.opening}</td>
              <td>{r.purchaseQty}</td>
              <td>{r.purchaseReturnQty}</td>
              <td>{r.salesQty}</td>
              <td>{r.salesReturnQty}</td>
              <td style={{fontWeight:"bold"}}>{r.balance}</td>
              <td>{r.value}</td>
            </tr>
          ))}

        </tbody>

        <tfoot className="table-light">
          <tr>
            <th colSpan="8">الإجمالي</th>
            <th>{totalQty}</th>
            <th>{totalValue}</th>
          </tr>
        </tfoot>

      </table>

    </div>
  );
}

export default StockReport;