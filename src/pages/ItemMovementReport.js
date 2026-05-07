import { useState, useMemo } from "react";

function ItemMovementReport() {

const items =
JSON.parse(localStorage.getItem("items")) || [];

const warehouses =
JSON.parse(localStorage.getItem("warehouses")) || [];

const [itemCode, setItemCode] = useState("");
const [itemSearch, setItemSearch] = useState("");
const [warehouse, setWarehouse] = useState("");

const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

const [fromDate, setFromDate] = useState(
lastMonth.toISOString().slice(0, 10)
);

const [toDate, setToDate] = useState(
today.toISOString().slice(0, 10)
);

/* ===== البحث بالاسم أو الكود ===== */

const filteredItems = items.filter((item) => {

if (!itemSearch.trim()) return true;

const search = itemSearch.toLowerCase();

return (
(item.name || "").toLowerCase().includes(search) ||
(item.code || "").toLowerCase().includes(search)
);

});

const stockMovements =
JSON.parse(localStorage.getItem("stockMovements")) || [];

const allMovements = stockMovements.filter(
m =>
String(m.itemCode || m.code) === String(itemCode) &&
(!warehouse || String(m.warehouse) === String(warehouse)) &&
m.reference !== "opening" &&
m.type !== "deleted" // 🔥 حماية إضافية
);

const movements = useMemo(() => {

if (!itemCode) return [];

let rows = [...allMovements];

rows = rows.filter((row) => {

const d = new Date(row.date);

if (fromDate && d < new Date(fromDate)) return false;
if (toDate && d > new Date(toDate)) return false;

return true;

});

rows.sort((a, b) => new Date(a.date) - new Date(b.date));

return rows;

}, [itemCode, fromDate, toDate, allMovements]);

/* ===== حساب رصيد أول المدة ===== */

const item = items.find(
i => String(i.code).trim() === String(itemCode).trim()
);

/* ===== حساب الحركة قبل الفترة ===== */



const openingBalance =
Number(item?.openingQty?.[warehouse] || 0);

let runningBalance = openingBalance;

const finalRows = movements.map((row) => {

runningBalance += row.in - row.out;

return { ...row, balance: runningBalance };

});

const currentBalance =
finalRows.length > 0
? finalRows[finalRows.length - 1].balance
: openingBalance;

return (

<div className="container">

<h3 className="mb-4">🔄 تقرير حركة الصنف</h3>

<div className="card mb-3">

<div className="card-body row g-2">

{/* البحث بالاسم أو الكود */}

<div className="col-md-4">

<div className="col-md-11 position-relative">

<input
className="form-control"
placeholder="ابحث بالاسم أو الكود"
value={itemSearch}
onChange={(e) => {
  setItemSearch(e.target.value);
  setItemCode("");
}}
style={{
  backgroundColor: "#0f172a",
  color: "#fff",
  border: "1px solid #334155"
}}
/>

{itemSearch && (

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

{filteredItems.map((i) => (

<div
key={i.code}
style={{
padding: "6px 10px",
cursor: "pointer",
borderBottom: "1px solid #eee"
}}
onClick={() => {
setItemCode(i.code);
setItemSearch(`${i.code} - ${i.name}`);
setWarehouse("");
}}
>

{i.code} - {i.name}

</div>

))}

</div>

)}

</div>

</div>

<div className="col-md-2">

<select
className="form-select"
value={warehouse}
onChange={(e) => setWarehouse(e.target.value)}
>

<option value="">اختر المخزن</option>

{warehouses.map((w) => (
<option key={w.id} value={w.id}>
{w.name}
</option>
))}

</select>

</div>

<div className="col-md-3">

<input
type="date"
className="form-control"
value={fromDate}
onChange={(e) => setFromDate(e.target.value)}
/>

</div>

<div className="col-md-3">

<input
type="date"
className="form-control"
value={toDate}
onChange={(e) => setToDate(e.target.value)}
/>

</div>

</div>

</div>

{itemCode && warehouse !== "" && (

<>

<div className="card mb-3">

<div className="card-body">

<div style={{ display: "flex", justifyContent: "space-between" }}>

<div
style={{
background: "#ecfdf5",
padding: "10px",
borderRadius: "6px",
fontWeight: "bold",
minWidth: "160px",
textAlign: "center"
}}
>

الرصيد الحالي

<div style={{ fontSize: "18px", color: "#16a34a" }}>
{currentBalance}
</div>

</div>

<div
style={{
background: "#f1f5f9",
padding: "10px",
borderRadius: "6px",
fontWeight: "bold",
minWidth: "160px",
textAlign: "center"
}}
>

رصيد أول المدة

<div style={{ fontSize: "18px", color: "#2563eb" }}>
{openingBalance}
</div>

</div>

</div>

</div>

</div>

<table className="table table-bordered table-striped">

<thead className="table-dark">

<tr>

<th>التاريخ</th>
<th>اسم الصنف</th>
<th>البيان</th>
<th>الكمية</th>
<th>الرصيد</th>
<th>المورد / العميل</th>
<th>رقم المرجع</th>
<th>كود الصنف</th>

</tr>

</thead>

<tbody>

{/* صف رصيد أول المدة */}

<tr style={{ background: "#f1f5f9", fontWeight: "bold" }}>

<td>{new Date().toISOString().slice(0,10)}</td>
<td>{item?.name || "-"}</td>

<td>رصيد أول المدة</td>

<td>{openingBalance}</td>

<td>{openingBalance}</td>

<td>رصيد أول المدة</td>

<td>-</td>

<td>{item?.code || "-"}</td>

</tr>

{finalRows.length === 0 && (

<tr>

<td colSpan="8" className="text-center">

لا توجد حركة

</td>

</tr>

)}

{finalRows.map((row, i) => (

<tr key={i}>

<td>{row.date}</td>

<td>{item?.name || row.itemName || "-"}</td>

<td>

{row.type === "sale" && "فاتورة مبيعات"}
{row.type === "purchase" && "فاتورة مشتريات"}
{row.type === "transfer_out" && "صرف أصناف"}
{row.type === "transfer_in" && "إضافة أصناف"}
{row.type === "sales_return" && "مرتجع مبيعات"}
{row.type === "purchase_return" && "مرتجع مشتريات"}

</td>

<td
style={{
color: row.in ? "#16a34a" : "#dc2626",
fontWeight: "bold"
}}
>

{row.in ? `+${row.in}` : `-${row.out}`}

</td>

<td style={{ fontWeight: "bold" }}>

{row.balance}

</td>

<td>

{row.party && row.party}

{!row.party && row.type === "transfer_out" &&
row.description?.split("إلى ")[1]}

{!row.party && row.type === "transfer_in" &&
row.description?.split("من ")[1]?.split(" إلى")[0]}

{!row.party && !row.type && "رصيد أول المدة"}

</td>

<td>{row.reference || "-"}</td>

<td>{item?.code || row.itemCode || row.code || "-"}</td>

</tr>

))}

</tbody>

</table>

</>

)}

</div>

);

}

export default ItemMovementReport;