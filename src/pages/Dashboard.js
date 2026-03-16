import { useMemo } from "react";
import FinancialSummary from "./FinancialSummary";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {

const {
  topCustomer,
  lowStockItems,
  totalCash,
  overdueChequesCount,
  chartData,
  todaySales,
  todayProfit,
  topItem
} = useMemo(() => {

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const customers =
    JSON.parse(localStorage.getItem("customers")) || [];

  const items =
    JSON.parse(localStorage.getItem("items")) || [];
    const warehouses =
JSON.parse(localStorage.getItem("warehouses")) || [];

  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  const payments =
    JSON.parse(localStorage.getItem("customerPayments")) || [];

  const cashTransactions =
    JSON.parse(localStorage.getItem("cashTransactions")) || [];

  /* ===== أعلى صنف مبيعًا ===== */

  const itemSales = {};

  invoices.forEach(inv => {
    inv.items?.forEach(it => {

      if (!itemSales[it.code]) {
        itemSales[it.code] = 0;
      }

      itemSales[it.code] += Number(it.qty || 0);

    });
  });

  let topItem = null;
  let maxQty = 0;

  Object.entries(itemSales).forEach(([code, qty]) => {

    if (qty > maxQty) {

      maxQty = qty;

      const item = items.find(i => i.code === code);

      topItem = item ? item.name : code;

    }

  });

  /* ===== أعلى عميل مديونية ===== */

  const topCustomer = customers
    .filter(c => Number(c.balance) > 0)
    .sort((a, b) => Number(b.balance) - Number(a.balance))[0] || null;

/* ===== تنبيه المخزون ===== */

let lowStockItems = [];

items.forEach(item => {

Object.entries(item.warehouses || {}).forEach(([warehouseId, qty]) => {

if(Number(qty) <= 5){

const warehouseObj = warehouses.find(w =>
String(w.id) === String(warehouseId)
);

lowStockItems.push({
name: item.name,
warehouse: warehouseObj?.name || warehouseId,
qty: Number(qty)
});

}

});

});

lowStockItems = lowStockItems.slice(0,10);

  /* ===== إجمالي الخزنة ===== */

 let totalCash = 0;

cashTransactions.forEach(t => {

if (t.type === "in") {
totalCash += Number(t.amount || 0);
}

if (t.type === "out") {
totalCash -= Number(t.amount || 0);
}

});

  /* ===== شيكات متأخرة ===== */

  const overdueChequesCount = payments.filter(p =>
    p.paymentMethod === "cheque" &&
    p.chequeDate &&
    p.chequeDate < todayStr &&
    !p.collected
  ).length;

  /* ===== مبيعات وربح اليوم ===== */

  let todaySales = 0;
  let todayCost = 0;

  invoices
    .filter(inv => inv.date === todayStr)
    .forEach(inv => {

      todaySales += Number(inv.total || 0);

      inv.items?.forEach(it => {

        const item = items.find(i => i.code === it.code);

        const cost = Number(item?.costPrice || 0);

        todayCost += Number(it.qty || 0) * cost;

      });

    });

  const todayProfit = todaySales - todayCost;

  /* ===== رسم بياني آخر 6 شهور ===== */

  const months = [];
  const salesData = [];
  const profitData = [];

  for (let i = 5; i >= 0; i--) {

    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);

    const monthKey = d.toISOString().slice(0, 7);

    const monthLabel = d.toLocaleString("ar-EG", { month: "short" });

    months.push(monthLabel);

    let monthSales = 0;
    let monthCost = 0;

    invoices
      .filter(inv => inv.date?.startsWith(monthKey))
      .forEach(inv => {

        monthSales += Number(inv.total || 0);

        inv.items?.forEach(it => {

          const item = items.find(i => i.code === it.code);

          const cost = Number(item?.costPrice || 0);

          monthCost += Number(it.qty || 0) * cost;

        });

      });

    salesData.push(monthSales);

    profitData.push(monthSales - monthCost);

  }

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "المبيعات",
        data: salesData,
        backgroundColor: "rgba(54,162,235,0.6)",
      },
      {
        label: "الأرباح",
        data: profitData,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return {
    topCustomer,
    lowStockItems,
    totalCash,
    overdueChequesCount,
    chartData,
    todaySales,
    todayProfit,
    topItem
  };

}, []);

return (
<div className="container">

<h2 className="mb-4">📊 لوحة التحكم</h2>

<FinancialSummary />

{/* ===== مؤشرات اليوم ===== */}

<div className="row g-3 mt-3">

<div className="col-md-6">
<div className="card text-center shadow-sm">
<div className="card-body">
<h6>مبيعات اليوم</h6>
<h5 className="text-primary">
{todaySales.toFixed(2)}
</h5>
</div>
</div>
</div>

<div className="col-md-6">
<div className="card text-center shadow-sm">
<div className="card-body">
<h6>ربح اليوم</h6>
<h5 className={todayProfit >= 0 ? "text-success" : "text-danger"}>
{todayProfit.toFixed(2)}
</h5>
</div>
</div>
</div>

</div>

{/* ===== الرسم البياني ===== */}

<div className="card mt-4">
<div className="card-body">

<h5 className="mb-3">📈 مبيعات وأرباح آخر 6 شهور</h5>

<div style={{ height: "220px" }}>
<Bar
data={chartData}
options={{
responsive: true,
maintainAspectRatio: false
}}
/>
</div>

</div>
</div>

{/* ===== الإحصائيات ===== */}

<div className="row g-3 mt-4">

<div className="col-md-4">
<div className="card text-center shadow-sm">
<div className="card-body">
<h6>أعلى صنف مبيعًا</h6>
<h5 className="text-success">
{topItem || "لا يوجد"}
</h5>
</div>
</div>
</div>

<div className="col-md-4">
  <div
    className="card text-center shadow-sm"
    style={{
      cursor:"pointer",
      transition:"0.25s",
    }}
    onMouseEnter={(e)=>{
      e.currentTarget.style.transform="scale(1.03)";
      e.currentTarget.style.boxShadow="0 10px 25px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e)=>{
      e.currentTarget.style.transform="scale(1)";
      e.currentTarget.style.boxShadow="";
    }}
    onClick={()=>window.location.href="/low-stock-report"}
  >

    <div className="card-body">

      <h6>تنبيه مخزون</h6>

      <h5 className="text-danger">
        {lowStockItems.map(i =>
`${i.name} - ${i.warehouse} (${i.qty})`
).join(", ")}
      </h5>

      <small className="text-muted">
        اضغط لعرض التقرير
      </small>

    </div>

  </div>
</div>
<div className="col-md-4">
<div className="card text-center shadow-sm">
<div className="card-body">
<h6>إجمالي الخزنة</h6>
<h5>
{totalCash.toFixed(2)}
</h5>
</div>
</div>
</div>

</div>

{/* ===== أعلى عميل ===== */}

<div className="row g-3 mt-4">

<div className="col-md-4">
<div className="card text-center shadow-sm">
<div className="card-body">

<h6>أعلى عميل مديونية</h6>

{topCustomer ? (
<>
<div>{topCustomer.name}</div>
<strong className="text-danger">
{Number(topCustomer.balance).toFixed(2)}
</strong>
</>
) : "لا يوجد"}

</div>
</div>
</div>

</div>

{/* ===== تنبيهات ===== */}

<div className="mt-4">

{overdueChequesCount > 0 && (
<div className="alert alert-warning">
⚠️ يوجد {overdueChequesCount} شيك متأخر
</div>
)}

</div>

</div>
);
}

export default Dashboard;