import { useEffect, useState } from "react";

function CashList() {

const today = new Date().toISOString().slice(0,10);

const [transactions, setTransactions] = useState([]);

const [fromDate, setFromDate] = useState("2026-01-01");
const [toDate, setToDate] = useState(today);
const [search, setSearch] = useState("");

useEffect(() => {

const data = JSON.parse(localStorage.getItem("cashTransactions")) || [];

// ترتيب العمليات حسب التاريخ
const sorted = [...data].sort(
(a, b) => new Date(a.date) - new Date(b.date)
);

setTransactions(sorted);

}, []);


/* ===== فلترة العمليات ===== */

const filteredTransactions = transactions.filter((t) => {

if (fromDate && t.date < fromDate) return false;
if (toDate && t.date > toDate) return false;

if (search) {

const s = search.toLowerCase();

const operation =
(t.operationType || "").toLowerCase();

const statement =
(t.customerName || t.expenseType || "").toLowerCase();

const description =
(t.description || "").toLowerCase();

if (
!operation.includes(s) &&
!statement.includes(s) &&
!description.includes(s)
) {
return false;
}

}

return true;

});


/* ===== حساب الرصيد الحالي ===== */

const currentBalance = filteredTransactions.reduce((total, t) => {
return t.type === "in"
? total + t.amount
: total - t.amount;
}, 0);


/* ===== إجمالي الوارد والمنصرف ===== */

let totalIn = 0;
let totalOut = 0;

filteredTransactions.forEach((t) => {

if (t.type === "in") {
totalIn += t.amount;
} else {
totalOut += t.amount;
}

});


/* ===== الرصيد التراكمي ===== */

let balance = 0;


return (

<div className="container">

<h3 className="mb-4">🏦 كشف الخزنة</h3>

{/* ===== الرصيد الحالي ===== */}

<div className="alert alert-success fw-bold">
الرصيد الحالي للخزنة: {currentBalance.toFixed(2)}
</div>


{/* ===== فلترة التاريخ ===== */}

<div className="row mb-3">

<div className="col-md-3">

<label>من تاريخ</label>

<input
type="date"
className="form-control"
value={fromDate}
onChange={(e) => setFromDate(e.target.value)}
/>

</div>

<div className="col-md-3">

<label>إلى تاريخ</label>

<input
type="date"
className="form-control"
value={toDate}
onChange={(e) => setToDate(e.target.value)}
/>

</div>
<div className="col-md-4">

<label>بحث</label>

<input
className="form-control"
placeholder="ابحث بالبيان أو الوصف أو نوع العملية"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>
</div>


{/* ===== الإجماليات ===== */}

<div className="alert alert-info d-flex gap-4 fw-bold">

<span>إجمالي الوارد: {totalIn.toFixed(2)}</span>
<span>إجمالي المنصرف: {totalOut.toFixed(2)}</span>
<span>الرصيد: {(totalIn - totalOut).toFixed(2)}</span>

</div>


{filteredTransactions.length === 0 ? (

<div className="alert alert-warning">
لا توجد حركات خزنة
</div>

) : (

<table className="table table-bordered table-striped">

<thead className="table-dark">

<tr>

<th>#</th>
<th>التاريخ</th>
<th>نوع العملية</th>
<th>البيان</th>
<th>الوصف</th>
<th>وارد</th>
<th>منصرف</th>
<th>الرصيد</th>

</tr>

</thead>


<tbody>

{filteredTransactions.map((t, index) => {

if (t.type === "in") {
balance += t.amount;
} else {
balance -= t.amount;
}

return (

<tr key={t.id}>

<td>{index + 1}</td>

<td>{t.date}</td>

{/* نوع العملية */}

<td>
{t.operationType === "deposit" && "إيداع"}
{t.operationType === "expense" && "مصروف"}
{t.operationType === "customerPayment" && "تحصيل عميل"}
{t.operationType === "supplierPayment" && "دفع مورد"}
{t.operationType === "sales" && "فاتورة بيع"}</td>

{/* البيان */}


<td>

{t.operationType === "customerPayment" && (t.customerName || "-")}
{t.operationType === "sales" && (t.customerName || "-")}

{t.operationType === "expense" && (t.expenseType || "مصروف")}

{t.operationType === "supplierPayment" && (t.supplierName || "مورد")}

{t.operationType === "deposit" && "إيداع"}

</td>


{/* الوصف */}

<td>{t.description || "-"}</td>

<td className="text-success fw-bold">
{t.type === "in" ? t.amount : ""}
</td>

<td className="text-danger fw-bold">
{t.type === "out" ? t.amount : ""}
</td>

<td className="fw-bold">
{balance.toFixed(2)}
</td>

</tr>

);

})}

</tbody>

</table>

)}

</div>

);

}

export default CashList;