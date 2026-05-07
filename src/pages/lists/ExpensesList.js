import { useState, useMemo } from "react";

function ExpensesList() {

/* ===== التاريخ الافتراضي ===== */

const today = new Date();
const currentYear = today.getFullYear();

const [search,setSearch] = useState("");
const [expenseFilter,setExpenseFilter] = useState("");

const [fromDate,setFromDate] = useState(`${currentYear}-01-01`);
const [toDate,setToDate] = useState(today.toISOString().slice(0,10));

/* ===== قراءة البيانات ===== */

const expenses = useMemo(() => {
  return JSON.parse(localStorage.getItem("cashTransactions")) || [];
}, []);

const expenseDefinitions =
JSON.parse(localStorage.getItem("expenseDefinitions")) || [];

/* ===== الفلترة ===== */

const filteredExpenses = useMemo(()=>{

return expenses
.filter(e => e.operationType === "expense")
.filter(e=>{

if(search && !e.description?.toLowerCase().includes(search.toLowerCase()))
return false;

if (expenseFilter && e.expenseType !== expenseFilter)
return false;

if(fromDate && new Date(e.date) < new Date(fromDate))
return false;

if(toDate && new Date(e.date) > new Date(toDate))
return false;

return true;

});

},[expenses,search,expenseFilter,fromDate,toDate]);

/* ===== الإجمالي ===== */

const totalExpenses = filteredExpenses.reduce(
(sum,e)=> sum + Number(e.amount || 0)
,0);

/* ===== حذف ===== */

const deleteExpense = (id)=>{

if(!window.confirm("حذف المصروف؟")) return;

const updated = expenses.filter(e=>e.id !== id);

localStorage.setItem(
"cashTransactions",
JSON.stringify(updated)
);

window.location.reload();

};

return(

<div className="container">

<h3 className="mb-4">💰 كشف المصروفات</h3>

<div className="card mb-3">
<div className="card-body row g-3">

<div className="col-md-3">
<input
className="form-control"
placeholder="بحث بالوصف"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>
</div>

<div className="col-md-3">
<select
className="form-select"
value={expenseFilter}
onChange={(e)=>setExpenseFilter(e.target.value)}
>
<option value="">كل المصروفات</option>

{expenseDefinitions.map(d=>(
<option key={d.id} value={d.name}>
{d.name}
</option>
))}
</select>
</div>

<div className="col-md-3">
<input
type="date"
className="form-control"
value={fromDate}
onChange={(e)=>setFromDate(e.target.value)}
/>
</div>

<div className="col-md-3">
<input
type="date"
className="form-control"
value={toDate}
onChange={(e)=>setToDate(e.target.value)}
/>
</div>

</div>
</div>

<div className="card mb-3">
<div className="card-body">
<strong>
إجمالي المصروفات: {totalExpenses}
</strong>
</div>
</div>

<div className="card">
<div className="card-body">

<table className="table table-bordered table-striped">

<thead className="table-dark">
<tr>
<th>#</th>
<th>التاريخ</th>
<th>المصروف</th>
<th>القيمة</th>
<th>تعديل</th>
<th>حذف</th>
</tr>
</thead>

<tbody>

{filteredExpenses.length === 0 && (
<tr>
<td colSpan="6" className="text-center">
لا يوجد مصروفات
</td>
</tr>
)}

{filteredExpenses.map((e,i)=>(

<tr key={e.id}>
<td>{i+1}</td>
<td>{e.date}</td>
<td>{e.expenseType || e.description}</td>
<td>{e.amount}</td>

<td>
<button
className="btn btn-sm btn-warning"
onClick={() =>
  window.location.href = `/add-cash-transaction?id=${e.id}`
}
>
✏️
</button>
</td>

<td>
<button
className="btn btn-sm btn-danger"
onClick={()=>deleteExpense(e.id)}
>
🗑
</button>
</td>

</tr>

))}

</tbody>

</table>

</div>
</div>

</div>

);

}

export default ExpensesList;