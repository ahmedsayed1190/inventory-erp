import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function SupplierTotalBalances() {

const navigate = useNavigate();

/* ===== STATES ===== */

const [selectedSupplier,setSelectedSupplier] = useState("");
const today = new Date().toISOString().slice(0,10);

const [fromDate,setFromDate] = useState("2026-01-01");
const [toDate,setToDate] = useState(today);
const [invoiceMode,setInvoiceMode] = useState("credit");
const [sortByDebt,setSortByDebt] = useState(false);

/* ===== DATA ===== */

const suppliers = useMemo(()=>{
return JSON.parse(localStorage.getItem("suppliers")) || [];
},[]);

const purchaseInvoices = useMemo(()=>{
return JSON.parse(localStorage.getItem("purchaseInvoices")) || [];
},[]);

const purchaseReturns = useMemo(()=>{
return JSON.parse(localStorage.getItem("purchaseReturns")) || [];
},[]);

const cashTransactions = useMemo(()=>{
return JSON.parse(localStorage.getItem("cashTransactions")) || [];
},[]);

/* ===== حساب الرصيد ===== */

const suppliersWithBalance = useMemo(()=>{

return suppliers.map((supplier)=>{

let credit = Number(supplier.openingBalance || 0);
let debit = 0;
/* ===== فواتير الآجل فقط ===== */

const creditInvoiceNumbers = purchaseInvoices
.filter(i => String(i.supplierId) === String(supplier.id))
.filter(i => i.paymentType === "credit")
.map(i => i.invoiceNumber);

/* فواتير الشراء */
purchaseInvoices
.filter(i => String(i.supplierId) === String(supplier.id))
.filter(i=>{

if(invoiceMode === "all") return true;

return i.paymentType === "credit";

})
.forEach(i=>{

const d = new Date(i.date);

if(
(!fromDate || d >= new Date(fromDate)) &&
(!toDate || d <= new Date(toDate+"T23:59:59"))
){
credit += Number(i.total || 0);
}

});

/* مرتجع شراء */

purchaseReturns
.filter(r => String(r.supplierId) === String(supplier.id))
.forEach(r=>{

const d = new Date(r.date);

if(
(!fromDate || d >= new Date(fromDate)) &&
(!toDate || d <= new Date(toDate+"T23:59:59"))
){
debit += Number(r.total || 0);
}

});

/* الدفع للمورد */

cashTransactions
.filter(t => t.operationType === "supplierPayment")
.filter(t => t.supplierName === supplier.name)
.filter(t=>{

if(invoiceMode === "all") return true;

/* الآجل فقط */

return creditInvoiceNumbers.includes(t.invoiceNumber);

})
.forEach(t=>{
const d = new Date(t.date);

if(
(!fromDate || d >= new Date(fromDate)) &&
(!toDate || d <= new Date(toDate+"T23:59:59"))
){
debit += Number(t.amount || 0);
}

});

const balance = credit - debit;

return { ...supplier, filteredBalance: balance };

});

},[
suppliers,
purchaseInvoices,
purchaseReturns,
cashTransactions,
fromDate,
toDate,
invoiceMode
]);

/* ===== فلترة المورد ===== */

const finalSuppliers = useMemo(()=>{

let filtered = suppliersWithBalance;

if(selectedSupplier){

filtered = filtered.filter(
s => String(s.id) === String(selectedSupplier)
);

}

if(sortByDebt){

filtered = [...filtered].sort(
(a,b)=> Number(b.filteredBalance) - Number(a.filteredBalance)
);

}

return filtered;

},[suppliersWithBalance,selectedSupplier,sortByDebt]);

/* ===== الإجماليات ===== */

const totalDebit = finalSuppliers
.filter(s => s.filteredBalance < 0)
.reduce((sum,s)=> sum + Math.abs(s.filteredBalance),0);

const totalCredit = finalSuppliers
.filter(s => s.filteredBalance > 0)
.reduce((sum,s)=> sum + s.filteredBalance,0);

const totalBalance = totalCredit - totalDebit;

/* ===== UI ===== */

return(

<div className="container">

<h3 className="mb-4">كشف حساب إجمالي الموردين</h3>

<div className="card mb-3">
<div className="card-body">

<div className="row g-2">

<div className="col-md-3">

<label>المورد</label>

<select
className="form-select"
value={selectedSupplier}
onChange={(e)=>setSelectedSupplier(e.target.value)}
>
<option value="">اختر المورد</option>

{suppliers.map(s=>(
<option key={s.id} value={s.id}>
{s.name}
</option>
))}

</select>

</div>

<div className="col-md-2">

<label>من تاريخ</label>

<input
type="date"
className="form-control"
value={fromDate}
onChange={(e)=>setFromDate(e.target.value)}
/>

</div>

<div className="col-md-2">

<label>نوع الفواتير</label>

<select
className="form-select"
value={invoiceMode}
onChange={(e)=>setInvoiceMode(e.target.value)}
>

<option value="credit">
الآجل فقط
</option>

<option value="all">
الكاش والآجل
</option>

</select>

</div>

<div className="col-md-2">

<label>إلى تاريخ</label>

<input
type="date"
className="form-control"
value={toDate}
onChange={(e)=>setToDate(e.target.value)}
/>

</div>

<div className="col-md-2 d-grid">

<button
className="btn btn-warning"
onClick={()=>setSortByDebt(!sortByDebt)}
>

ترتيب أعلى مديونية

</button>

</div>

</div>

</div>
</div>

<div className="card">
<div className="card-body">

<table className="table table-bordered table-striped">

<thead className="table-dark">

<tr>

<th>#</th>
<th>اسم المورد</th>
<th>الرصيد</th>
<th>الحالة</th>
<th>التفاصيل</th>

</tr>

</thead>

<tbody>

{finalSuppliers.map((s,i)=>(

<tr key={s.id}>

<td>{i+1}</td>

<td>{s.name}</td>

<td className={
s.filteredBalance>0
?"text-danger fw-bold"
:s.filteredBalance<0
?"text-success fw-bold"
:""
}>

{s.filteredBalance.toFixed(2)}
</td>

<td>

{s.filteredBalance>0
?"دائن"
:s.filteredBalance<0
?"مدين"
:"متزن"}

</td>

<td>

<button
className="btn btn-sm btn-primary"
onClick={()=>navigate(`/supplier-ledger?supplier=${s.id}`)}
>

كشف الحساب

</button>

</td>

</tr>

))}

</tbody>

<tfoot className="table-light">

<tr>
<th colSpan="2">إجمالي الدائن</th>
<th>{totalCredit}</th>
</tr>

<tr>
<th colSpan="2">إجمالي المدين</th>
<th>{totalDebit}</th>
</tr>

<tr>
<th colSpan="2">الصافي</th>
<th>{totalBalance}</th>
</tr>

</tfoot>

</table>

</div>
</div>

</div>

);

}

export default SupplierTotalBalances;