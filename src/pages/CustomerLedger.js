import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CustomerLedger() {

const navigate = useNavigate();
const [searchParams] = useSearchParams();

/* ===== DATA ===== */

const customers = useMemo(() => {
  return JSON.parse(localStorage.getItem("customers")) || [];
}, []);

const invoices = useMemo(() => {
  return JSON.parse(localStorage.getItem("salesInvoices")) || [];
}, []);

const cashTransactions = useMemo(() => {
  return JSON.parse(localStorage.getItem("cashTransactions")) || [];
}, []);

const returns = useMemo(() => {
  return JSON.parse(localStorage.getItem("salesReturns")) || [];
}, []);

/* ===== STATES ===== */

const [customerCode,setCustomerCode] = useState(
searchParams.get("customer") || ""
);

const today = new Date().toISOString().slice(0,10);

const [fromDate,setFromDate] = useState("2026-01-01");
const [toDate,setToDate] = useState(today);

/* ===== BUILD MOVEMENTS ===== */

const movements = useMemo(()=>{

if(!customerCode) return [];

let rows = [];

const customer = customers.find(
c => String(c.customerNumber) === String(customerCode)
);

/* ===== الرصيد الافتتاحي ===== */

if(customer?.openingBalance){

rows.unshift({
date: customer.openingBalanceDate || "2026-01-01",
description:"رصيد افتتاحي",
invoiceId:"-",
debit:Number(customer.openingBalance || 0),
credit:0
});

}


/* ===== فواتير البيع ===== */

const selectedCustomer = customers.find(
  c => String(c.code) === String(customerCode)
);

invoices
.filter(inv => String(inv.customerCode) === String(customerCode))
.forEach(inv => {

rows.push({
date: inv.date,
description: "🧾 فاتورة مبيعات",
invoiceId: inv.invoiceId,
debit: Number(inv.total || inv.subTotal || 0),
credit: 0
});

});

/* ===== التحصيل ===== */

cashTransactions
.filter(t => String(t.customerCode) === String(customerCode))
.forEach(t => {

rows.push({
date: t.date,
description: "💰 تحصيل",
invoiceId: "-",
debit: 0,
credit: Number(t.amount || 0)
});

});

/* ===== المرتجعات ===== */

returns
.filter(t => t.customerName === selectedCustomer?.name)
.forEach(r=>{

rows.push({
date:r.date,
description:"↩️ مرتجع بيع",
invoiceId:"-",
debit:0,
credit:Number(r.total || 0)
});

});

/* ===== فلترة التاريخ ===== */

rows = rows.filter(row => {

if(row.description === "رصيد افتتاحي") return true;

const rowDate = new Date(row.date);

if(fromDate && rowDate < new Date(fromDate)) return false;

if(toDate && rowDate > new Date(toDate)) return false;

return true;

});

/* ===== ترتيب ===== */

rows.sort((a,b)=> new Date(a.date) - new Date(b.date));

return rows;

},[
customerCode,
customers,
invoices,
cashTransactions,
returns,
fromDate,
toDate
]);

/* ===== الرصيد المتحرك ===== */

let runningBalance = 0;

const statementRows = movements.map(row=>{

runningBalance += row.debit - row.credit;

return {
...row,
balance:runningBalance
};

});

const printPDF = () => window.print();

return (

<div className="container">

<h3 className="mb-4">📒 كشف حساب العميل</h3>

<div className="card mb-3">
<div className="card-body">
<div className="row g-2">

<div className="col-md-4">

<label>العميل</label>

<select
className="form-select"
value={customerCode}
onChange={(e)=>setCustomerCode(e.target.value)}
>

<option value="">اختر العميل</option>

{customers.map(c=>(
<option key={c.customerNumber} value={c.customerNumber}>
{c.name}
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

<div className="col-md-2 d-flex align-items-end">

<button
className="btn btn-dark w-100"
onClick={printPDF}
disabled={!customerCode}
>

🖨️ PDF

</button>

</div>

</div>
</div>
</div>

{customerCode && (

<div className="card">

<div className="card-body">

<table className="table table-bordered table-striped">

<thead className="table-dark">

<tr>

<th>التاريخ</th>
<th>الوصف</th>
<th>رقم الفاتورة</th>
<th>مدين</th>
<th>دائن</th>
<th>الرصيد</th>

</tr>

</thead>

<tbody>

{statementRows.length === 0 && (

<tr>

<td colSpan="6" className="text-center">
لا توجد حركات
</td>

</tr>

)}

{statementRows.map((row,i)=>(

<tr key={i}>

<td>{row.date}</td>

<td>{row.description}</td>

<td>

{row.invoiceId !== "-" ?

<button
className="btn btn-sm btn-primary"
onClick={()=>navigate(`/invoice/${row.invoiceId}`)}
>

{row.invoiceId}

</button>

:

"-"

}

</td>

<td>{row.debit || "-"}</td>

<td>{row.credit || "-"}</td>

<td>{row.balance}</td>

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

export default CustomerLedger;