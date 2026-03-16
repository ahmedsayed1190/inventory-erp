  import { useState, useMemo } from "react";
  import { useWarehouses } from "../context/WarehouseContext";

  function StockReport() {

  const { warehouses } = useWarehouses();

  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [searchItem, setSearchItem] = useState("");

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

  if(searchItem && !item.name.toLowerCase().includes(searchItem.toLowerCase())) return;

  let currentQty = 0;
let purchaseQty = 0;
let purchaseReturnQty = 0;
let salesQty = 0;
let salesReturnQty = 0;

/* الرصيد الحالي من المخزن */
Object.entries(item.warehouses || {}).forEach(([wh,qty])=>{

if(selectedWarehouse && wh !== selectedWarehouse) return;

currentQty += Number(qty);

});

  purchases.forEach(inv=>{

  const d = new Date(inv.date);
  if(d < new Date(fromDate) || d > new Date(toDate)) return;

  inv.items?.forEach(it=>{

  if(it.code === item.code){

  if(!selectedWarehouse || inv.warehouse === selectedWarehouse){

  purchaseQty += Number(it.qty);

  }

  }

  });

  });

  purchaseReturns.forEach(ret=>{

  const d = new Date(ret.date);
  if(d < new Date(fromDate) || d > new Date(toDate)) return;

  ret.items?.forEach(it=>{

  if(it.code === item.code){

  purchaseReturnQty += Number(it.qty);

  }

  });

  });

  sales.forEach(inv=>{

  const d = new Date(inv.date);
  if(d < new Date(fromDate) || d > new Date(toDate)) return;

  inv.items?.forEach(it=>{

  if(it.code === item.code){

  if(!selectedWarehouse || inv.warehouse === selectedWarehouse){

  salesQty += Number(it.qty);

  }

  }

  });

  });

  salesReturns.forEach(ret=>{

  const d = new Date(ret.date);
  if(d < new Date(fromDate) || d > new Date(toDate)) return;

  const qty = ret.items?.[item.code];

  if(qty) salesReturnQty += Number(qty);

  });
  /* صافي الحركة */
const netMovement =
purchaseQty - purchaseReturnQty - salesQty + salesReturnQty;

/* رصيد أول المدة الحقيقي */
const opening = currentQty - netMovement;

/* الرصيد النهائي */
const balance = currentQty;

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

},[selectedWarehouse,searchItem,fromDate,toDate,warehouses]);
  const totalQty = reportData.reduce((s,r)=> s + r.balance ,0);
  const totalValue = reportData.reduce((s,r)=> s + r.value ,0);

  return (

  <div className="container">

  <h3 className="mb-4">📦 تقرير كميات الأصناف</h3>

  <div className="card mb-3">
  <div className="card-body row g-2">

  <div className="col-md-3">

  <select
  className="form-select"
  value={selectedWarehouse}
  onChange={e=>setSelectedWarehouse(e.target.value)}
  >

  <option value="">كل المخازن</option>

  {warehouses.map(w=>(
  <option key={w.id} value={w.id}>
  {w.name}
  </option>
  ))}

  </select>

  </div>

  <div className="col-md-3">

  <input
  className="form-control"
  placeholder="بحث بالصنف"
  value={searchItem}
  onChange={e=>setSearchItem(e.target.value)}
  />

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