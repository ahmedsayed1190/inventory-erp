import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SupplierLedger(){

const navigate = useNavigate();

/* ===== DATA ===== */

const suppliers =
JSON.parse(localStorage.getItem("suppliers")) || [];

const purchaseInvoices =
JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

const purchaseReturns =
JSON.parse(localStorage.getItem("purchaseReturns")) || [];

const cashTransactions =
JSON.parse(localStorage.getItem("cashTransactions")) || [];

const warehouses =
JSON.parse(localStorage.getItem("warehouses")) || [];

/* ===== STATES ===== */

const [supplierId,setSupplierId] = useState("");
const location = useLocation();

useEffect(()=>{

const params = new URLSearchParams(location.search);
const supplierFromUrl = params.get("supplier");

if(supplierFromUrl){
setSupplierId(supplierFromUrl);
}

},[location]);

const today = new Date().toISOString().slice(0,10);

const [fromDate,setFromDate] = useState("2026-01-01");
const [toDate,setToDate] = useState(today);

/* ===== BUILD MOVEMENTS ===== */

let rows = [];

if(supplierId){

const supplier =
suppliers.find(s => String(s.id) === String(supplierId));

/* ===== الرصيد الافتتاحي ===== */

if(supplier?.openingBalance){

rows.push({
date: supplier.date || "",
description:"رصيد افتتاحي",
debit:0,
credit:supplier.openingBalance,
invoiceNumber:"-",
warehouse:"-"
});

}

/* ===== فواتير الشراء ===== */

purchaseInvoices
.filter(i => String(i.supplierId) === String(supplierId))
.forEach(i=>{

const warehouseName =
warehouses.find(w => String(w.id) === String(i.warehouseId))?.name || "-";

rows.push({
date:i.date,
description:"فاتورة شراء",
debit:0,
credit:i.total,
invoiceNumber:i.invoiceNumber,
warehouse:warehouseName
});

});

/* ===== مرتجع شراء ===== */

purchaseReturns
.filter(r => String(r.supplierId) === String(supplierId))
.forEach(r=>{

const warehouseName =
warehouses.find(w => String(w.id) === String(r.warehouseId))?.name || "-";

rows.push({
date:r.date,
description:"↩️ مرتجع شراء",
invoiceId:"-",
warehouseName:warehouseName,
debit:Number(r.total || 0),
credit:0
});

});

/* ===== الدفع للمورد ===== */

cashTransactions
.filter(t => t.operationType === "supplierPayment")
.filter(t => t.supplierName === supplier?.name)
.forEach(t=>{

rows.push({
date:t.date,
description:"💰 دفع للمورد",
invoiceId:"-",
warehouse:"-",
debit:Number(t.amount || 0),
credit:0
});

});

}

/* ===== فلترة التاريخ ===== */

rows = rows.filter(row=>{

if(row.date === "-") return true;

const d = new Date(row.date);

if(fromDate && d < new Date(fromDate)) return false;
if(toDate && d > new Date(toDate)) return false;

return true;

});

/* ===== ترتيب ===== */

rows.sort((a,b)=>{

if(a.date === "-") return -1;
if(b.date === "-") return 1;

return new Date(a.date) - new Date(b.date);

});

/* ===== الرصيد المتحرك ===== */

let balance = 0;

const finalRows = rows.map(r=>{

balance += r.credit - r.debit;

return{
...r,
balance
};

});

/* ===== UI ===== */

return(

<div className="container">

<h3 className="mb-4">📒 كشف حساب المورد</h3>

<div className="card mb-3">

<div className="card-body">

<div className="row g-2">

<div className="col-md-4">

<label>المورد</label>

<select
className="form-select"
value={supplierId}
onChange={(e)=>setSupplierId(e.target.value)}
>

<option value="">اختر المورد</option>

{suppliers.map(s=>(
<option key={s.id} value={s.id}>
{s.name}
</option>
))}

</select>

</div>

<div className="col-md-3">

<label>من تاريخ</label>

<input
type="date"
className="form-control"
value={fromDate}
onChange={(e)=>setFromDate(e.target.value)}
/>

</div>

<div className="col-md-3">

<label>إلى تاريخ</label>

<input
type="date"
className="form-control"
value={toDate}
onChange={(e)=>setToDate(e.target.value)}
/>

</div>

</div>

</div>

</div>

{supplierId && (

<div className="card">

<div className="card-body">

<table className="table table-bordered table-striped">

<thead className="table-dark">

<tr>

<th>التاريخ</th>
<th>الوصف</th>
<th>رقم الفاتورة</th>
<th>المخزن</th>
<th>مدين</th>
<th>دائن</th>
<th>الرصيد</th>

</tr>

</thead>

<tbody>

{finalRows.length === 0 && (

<tr>
<td colSpan="7" className="text-center">
لا توجد حركات
</td>
</tr>

)}

{finalRows.map((r,i)=>(

<tr key={i}>

<td>{r.date}</td>

<td>{r.description}</td>

<td>
{r.invoiceNumber && r.invoiceNumber !== "-" ? (
<button
className="btn btn-sm btn-primary"
onClick={()=>navigate(`/purchase-invoice/${r.invoiceNumber}`)}
>
{r.invoiceNumber}
</button>
) : "-"}
</td>

<td>{r.warehouse || "-"}</td>

<td>{r.debit || "-"}</td>

<td>{r.credit || "-"}</td>

<td>{r.balance}</td>
</tr>

))}

</tbody>

</table>

</div>

</div>

)}

</div>

);

}

export default SupplierLedger;