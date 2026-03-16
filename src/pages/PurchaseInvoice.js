import { useState } from "react";
function PurchaseInvoice(){

const today = new Date().toISOString().slice(0,10);

/* ===== DATA ===== */

const suppliers =
JSON.parse(localStorage.getItem("suppliers")) || [];

const items =
JSON.parse(localStorage.getItem("items")) || [];

const warehouses =
JSON.parse(localStorage.getItem("warehouses")) || [];


/* ===== رقم الفاتورة ===== */

const purchaseInvoices =
JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

const getNextInvoiceNumber = () => {

if(!purchaseInvoices.length) return "PI-1001";

const numbers = purchaseInvoices.map(i =>
parseInt(i.invoiceNumber.replace("PI-",""))
);

const max = Math.max(...numbers);

return `PI-${max + 1}`;

};

const invoiceNumber = getNextInvoiceNumber();

/* ===== HEADER ===== */

const [date,setDate] = useState(today);
const [supplierId,setSupplierId] = useState("");
const [warehouseId,setWarehouseId] = useState("");
const [paymentType,setPaymentType] = useState("credit");


/* ===== ITEM INPUT ===== */

const [itemCode,setItemCode] = useState("");
const [qty,setQty] = useState("");
const [price,setPrice] = useState("");


/* ===== TABLE ===== */

const [invoiceItems,setInvoiceItems] = useState([]);


/* ===== المورد ===== */

const selectedSupplier = suppliers.find(
s => String(s.id) === String(supplierId)
);

const supplierBalance = selectedSupplier?.balance || 0;


/* ===== الصنف ===== */

const selectedItem = items.find(
i => String(i.code) === String(itemCode)
);


/* ===== إضافة صنف ===== */

const addItem = ()=>{

if(!warehouseId){
alert("اختر المخزن أولاً");
return;
}

if(!itemCode || !qty || !price){
alert("أكمل بيانات الصنف");
return;
}

const newItem = {

code:selectedItem.code,
name:selectedItem.name,
unit:selectedItem.unit || "",
warehouse:warehouseId,

qty:Number(qty),
price:Number(price),

total:Number(qty)*Number(price)

};

setInvoiceItems([...invoiceItems,newItem]);

setItemCode("");
setQty("");
setPrice("");

};


/* ===== حذف صنف ===== */

const deleteItem = (index)=>{

const updated = invoiceItems.filter((_,i)=>i!==index);

setInvoiceItems(updated);

};


/* ===== الإجمالي ===== */

const total = invoiceItems.reduce(
(sum,i)=>sum+i.total,0
);


/* ===== حفظ الفاتورة ===== */

const saveInvoice = ()=>{

if(!supplierId){
alert("اختر المورد");
return;
}

if(invoiceItems.length===0){
alert("لا توجد أصناف");
return;
}

const purchaseInvoices =
JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

const newInvoice = {

id:Date.now(),

invoiceNumber:invoiceNumber,

supplierId,
supplierName:selectedSupplier.name,

date,
warehouseId,

paymentType,

items:invoiceItems,

total

};

localStorage.setItem(
"purchaseInvoices",
JSON.stringify([...purchaseInvoices,newInvoice])
);


/* ===== تحديث المخزون ===== */

const stockMovements =
JSON.parse(localStorage.getItem("stockMovements")) || [];

invoiceItems.forEach(i=>{

stockMovements.push({

id:Date.now()+Math.random(),

date,

itemCode:i.code,
itemName:i.name,

warehouseId,

qty:i.qty,

type:"purchase"

});

});

localStorage.setItem(
"stockMovements",
JSON.stringify(stockMovements)
);


/* ===== تحديث حساب المورد ===== */

const supplierLedger =
JSON.parse(localStorage.getItem("supplierLedger")) || [];

supplierLedger.push({

id:Date.now(),

supplierId,
supplierName:selectedSupplier.name,

date,

description:"فاتورة شراء",

debit:total,
credit:0

});

localStorage.setItem(
"supplierLedger",
JSON.stringify(supplierLedger)
);


/* ===== لو الدفع كاش ===== */

if(paymentType==="cash"){

const cashTransactions =
JSON.parse(localStorage.getItem("cashTransactions")) || [];

cashTransactions.push({

id:Date.now(),

type:"out",

operationType:"supplierPayment",

supplierName:selectedSupplier.name,

amount:total,

date

});

localStorage.setItem(
"cashTransactions",
JSON.stringify(cashTransactions)
);

}

alert("تم حفظ الفاتورة ✅");

setInvoiceItems([]);

};


/* ===== UI ===== */

return(

<div className="container">

{/* ===== Invoice Header ===== */}

<div className="mb-3">

<h3 className="mb-3">

Purchase Invoice #{invoiceNumber}

</h3>
<div className="mb-3 d-flex gap-2 flex-wrap">

<button className="btn btn-dark">
🖨️ PDF
</button>

<button className="btn btn-secondary">
👁 Preview
</button>

<button
className="btn btn-success"
onClick={()=>window.location.reload()}
>
+ New Invoice
</button>

<button
className="btn btn-primary"
onClick={saveInvoice}
>
💾 Save Invoice
</button>

<button className="btn btn-danger">
🗑 Delete Invoice
</button>

</div>
<div className="row g-2">

<div className="col-md-3">

<label>Invoice Date</label>

<input
type="date"
className="form-control"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>

</div>

<div className="col-md-3">

<label>Time</label>

<input
type="time"
className="form-control"
defaultValue={new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
/>

</div>

</div>

</div>

<div className="card mb-3">

<div className="card-body">

<div className="row g-2">


<div className="col-md-3">

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


<div className="col-md-2">

<label>رصيد المورد</label>

<input
className="form-control"
value={supplierBalance}
disabled
/>

</div>


<div className="col-md-2">

<label>طريقة الدفع</label>

<select
className="form-select"
value={paymentType}
onChange={(e)=>setPaymentType(e.target.value)}
>

<option value="credit">آجل</option>
<option value="cash">كاش</option>

</select>

</div>


<div className="col-md-2">

<label>المخزن</label>

<select
className="form-select"
value={warehouseId}
onChange={(e)=>setWarehouseId(e.target.value)}
>

<option value="">اختر المخزن</option>

{warehouses.map(w=>(

<option key={w.id} value={w.id}>
{w.name}
</option>

))}

</select>

</div>


</div>

</div>

</div>


{/* ===== إضافة صنف ===== */}

<div className="card mb-3">

<div className="card-body">

<div className="row g-2">


<div className="col-md-3">

<label>الصنف</label>

<select
className="form-select"
value={itemCode}
onChange={(e)=>setItemCode(e.target.value)}
disabled={!warehouseId}
>

<option value="">
{warehouseId ? "اختر الصنف" : "اختر المخزن أولاً"}
</option>

{items.map(i=>(

<option key={i.code} value={i.code}>
{i.code} - {i.name}
</option>

))}

</select>

</div>


<div className="col-md-2">

<label>الوحدة</label>

<input
className="form-control"
value={selectedItem?.unit || ""}
disabled
/>

</div>


<div className="col-md-2">

<label>الكمية</label>

<input
type="number"
className="form-control"
value={qty}
onChange={(e)=>setQty(e.target.value)}
/>

</div>


<div className="col-md-2">

<label>سعر الشراء</label>

<input
type="number"
className="form-control"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

</div>


<div className="col-md-2 d-flex align-items-end">

<button
className="btn btn-success w-100"
onClick={addItem}
>

➕ إضافة

</button>

</div>


</div>

</div>

</div>






{/* ===== جدول الأصناف ===== */}

<div className="card">

<div className="card-body">

<table className="table table-bordered">

<thead className="table-dark">

<tr>

<th>كود</th>
<th>الصنف</th>
<th>الوحدة</th>
<th>المخزن</th>
<th>كمية</th>
<th>السعر</th>
<th>الإجمالي</th>
<th>حذف</th>

</tr>

</thead>


<tbody>

{invoiceItems.map((i,index)=>(

<tr key={index}>

<td>{i.code}</td>
<td>{i.name}</td>
<td>{i.unit}</td>
<td>
{warehouses.find(w => String(w.id) === String(i.warehouse))?.name || ""}
</td>
<td>{i.qty}</td>
<td>{i.price}</td>
<td>{i.total}</td>

<td>

<button
className="btn btn-danger btn-sm"
onClick={()=>deleteItem(index)}
>

❌

</button>

</td>

</tr>

))}

</tbody>

</table>


<h5 className="mt-3">

إجمالي الفاتورة : {total}

</h5>


</div>

</div>

</div>

);

}

export default PurchaseInvoice;