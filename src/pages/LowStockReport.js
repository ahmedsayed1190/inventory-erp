import { useMemo, useState } from "react";

function LowStockReport(){

const [search,setSearch] = useState("");

const items = useMemo(()=>{
return JSON.parse(localStorage.getItem("items")) || [];
},[]);

const warehouses = useMemo(()=>{
return JSON.parse(localStorage.getItem("warehouses")) || [];
},[]);

const stockMovements = useMemo(()=>{
return JSON.parse(localStorage.getItem("stockMovements")) || [];
},[]);


/* ===== حساب المخزون لكل مخزن ===== */

const stockData = useMemo(()=>{

let stock = {};

stockMovements.forEach(m=>{

const code = String(m.itemCode || m.code || "").trim();
const warehouseId = String(m.warehouse || "main");

const key = code + "_" + warehouseId;

if(!stock[key]){
stock[key] = {
warehouse:warehouseId,
code:code,
qty:0
};
}

stock[key].qty += Number(m.in || 0);
stock[key].qty -= Number(m.out || 0);

});

let result = [];

Object.values(stock).forEach(s=>{

const item = items.find(i =>
String(i.code).trim() === String(s.code).trim()
);

const warehouseObj = warehouses.find(w =>
String(w.id) === String(s.warehouse)
);

const itemName =
item?.name ||
stockMovements.find(m =>
String(m.itemCode || m.code || "").trim() === String(s.code).trim()
)?.itemName ||
"غير معروف";

const itemCode =
item?.code ||
stockMovements.find(m =>
String(m.itemCode || m.code || "").trim() === String(s.code).trim()
)?.itemCode ||
s.code;

if(Math.max(0,s.qty) <= 5 && s.code){

result.push({

warehouse: warehouseObj?.name || s.warehouse,

code: itemCode,

name: itemName,

qty: Math.max(0,s.qty)

});

}

});

return result.sort((a,b)=>a.qty-b.qty);

},[items,warehouses,stockMovements]);


/* ===== البحث ===== */

const filtered = stockData.filter(i=>
(i.name || "").toLowerCase().includes(search.toLowerCase()) ||
(i.code || "").toString().includes(search)
);

return(

<div className="container">

<h3 className="mb-4">⚠️ تقرير المخزون المنخفض</h3>

<input
className="form-control mb-3"
placeholder="🔎 ابحث عن الصنف..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<table className="table table-bordered">

<thead className="table-dark">

<tr>
<th>#</th>
<th>المخزن</th>
<th>كود الصنف</th>
<th>اسم الصنف</th>
<th>الكمية</th>
<th>الحالة</th>
</tr>

</thead>

<tbody>

{filtered.length===0 && (
<tr>
<td colSpan="6" className="text-center">
لا يوجد أصناف منخفضة
</td>
</tr>
)}

{filtered.map((row,i)=>{

let status="";
let color="";

if(row.qty===0){
status="🔴 نفد المخزون";
color="red";
}
else if(row.qty<=5){
status="🟠 منخفض";
color="orange";
}

return(

<tr key={i}>
<td>{i+1}</td>
<td>{row.warehouse}</td>
<td>{row.code}</td>
<td>{row.name}</td>

<td style={{color:row.qty===0?"red":""}}>
{row.qty}
</td>

<td style={{color:color,fontWeight:"bold"}}>
{status}
</td>

</tr>

);

})}

</tbody>

</table>

</div>

);

}

export default LowStockReport;