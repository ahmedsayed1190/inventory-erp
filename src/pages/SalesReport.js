function SalesReport() {

const invoices =
JSON.parse(localStorage.getItem("salesInvoices")) || [];

const warehouses =
JSON.parse(localStorage.getItem("warehouses")) || [];

/* ===== تجهيز الصفوف ===== */

let rows = [];

invoices.forEach(inv => {

(inv.items || []).forEach(item => {

const warehouseName =
warehouses.find(w =>
String(w.id) === String(inv.warehouse)
)?.name || inv.warehouse;

rows.push({
name: item.name,
warehouse: warehouseName,
qty: item.qty,
price: item.price,
total: item.qty * item.price,
date: inv.date
});

});

});

/* ===== إجمالي المبيعات ===== */

const totalSales = rows.reduce(
(sum, r) => sum + r.total,
0
);

return (
<div className="container">

<h3 className="mb-4">🧾 تقرير المبيعات</h3>

<table className="table table-bordered table-striped">

<thead className="table-dark">
<tr>
<th>الصنف</th>
<th>المخزن</th>
<th>الكمية</th>
<th>السعر</th>
<th>الإجمالي</th>
<th>التاريخ</th>
</tr>
</thead>

<tbody>

{rows.length === 0 && (
<tr>
<td colSpan="6" className="text-center">
لا توجد مبيعات
</td>
</tr>
)}

{rows.map((row, i) => (

<tr key={i}>

<td>{row.name}</td>
<td>{row.warehouse}</td>
<td>{row.qty}</td>
<td>{row.price}</td>
<td>{row.total}</td>
<td>{row.date}</td>

</tr>

))}

</tbody>

</table>

<h5 className="mt-3">
💰 إجمالي المبيعات: {totalSales}
</h5>

</div>
);
}

export default SalesReport;