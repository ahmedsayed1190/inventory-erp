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

if (customer && Number(customer.openingBalance || customer.balance) !== 0) {

rows.unshift({
date: customer.openingBalanceDate || "2026-01-01",
description: "رصيد افتتاحي",
invoiceId: "-",
debit: Number(customer.openingBalance || customer.balance || 0),
credit: 0
});

}


/* ===== فواتير البيع ===== */

const selectedCustomer = customers.find(
    c => String(c.customerNumber) === String(customerCode)
);

invoices
.filter(inv => 
  String(inv.customerCode) === String(customerCode)
)
.forEach(inv => {

  // ❌ الكاش ملوش دعوة بالعميل
  if (inv.paymentMethod === "cash") return;

  // ✔️ الآجل والشيك فقط
  const debitAmount = Number(inv.total || 0);

  rows.push({
    date: inv.date,
    description:
      inv.paymentMethod === "credit"
        ? "🧾 فاتورة آجل"
        : "💳 فاتورة بشيك",

    invoiceId: inv.invoiceId,
    debit: debitAmount,
    credit: 0
  });

});

/* ===== التحصيل ===== */

cashTransactions
.filter(t =>
  String(t.customerCode) === String(customerCode) &&
  t.operationType !== "sales"   // 🔥 يمنع الكاش من الظهور
)
.forEach(t => {

  rows.push({
    id:t.id,
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

/* ===== تعديل دفعة ===== */

const editPayment = (id) => {

navigate(`/add-cash-transaction?id=${id}`);

};

/* ===== حذف دفعة ===== */

const deletePayment = (id) => {

const confirmDelete =
window.confirm("هل تريد حذف الدفعة؟");

if(!confirmDelete) return;

const cashTransactions =
JSON.parse(localStorage.getItem("cashTransactions")) || [];

const updated = cashTransactions.filter(
t => String(t.id) !== String(id)
);

localStorage.setItem(
"cashTransactions",
JSON.stringify(updated)
);

window.location.reload();

};

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

<div className="row mb-3">

<div className="col-md-3">

<div className="border rounded p-2 bg-dark text-light">

<div className="small text-secondary">
الرصيد الافتتاحي
</div>

<div className="fw-bold">

{
Number(
customers.find(
c => String(c.customerNumber) === String(customerCode)
)?.openingBalance || 0
).toFixed(2)
}

</div>

</div>

</div>

<div className="col-md-3">

<div className="border rounded p-2 bg-dark text-light">

<div className="small text-secondary">
الرصيد الحالي
</div>

<div className="fw-bold text-warning">

{
statementRows.length > 0
? statementRows[statementRows.length - 1].balance.toFixed(2)
: "0.00"
}

</div>

</div>

</div>

</div>

<table className="table table-bordered table-striped">

<thead className="table-dark">

<tr>

<th>التاريخ</th>
<th>الوصف</th>
<th>رقم الفاتورة</th>
<th>مدين</th>
<th>دائن</th>
<th>الرصيد</th>
<th>إجراءات</th>

</tr>

</thead>

<tbody>

{statementRows.length === 0 && (

<tr>

<td colSpan="7" className="text-center">
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

<td>

{row.description === "💰 تحصيل" && (

<div className="d-flex gap-1">

<button
className="btn btn-sm btn-warning"
onClick={()=>editPayment(row.id)}
>

تعديل

</button>

<button
className="btn btn-sm btn-danger"
onClick={()=>deletePayment(row.id)}
>

حذف

</button>

</div>

)}

</td>

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