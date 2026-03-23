import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

/* 👇 خلي الأيقونات هنا */
import {
  DollarSign,
  BarChart3,
  AlertTriangle,
  Wallet,
  Users,
  Package
} from "lucide-react";

/* 👇 بعد كل الـ imports */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function Dashboard() {
const navigate = useNavigate();
const {
  topCustomer,
  lowStockItems,
  totalCash,
  overdueChequesCount,
  chartData,
  todaySales,
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

  invoices
    .filter(inv => inv.date === todayStr)
    .forEach(inv => {

      todaySales += Number(inv.total || 0);

      inv.items?.forEach(it => {

      });

    });


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
    backgroundColor: "rgba(59,130,246,0.7)",
    borderRadius: 6,
    barThickness: 18
  },
  {
    label: "الأرباح",
    data: profitData,
    backgroundColor: "rgba(16,185,129,0.7)",
    borderRadius: 6,
    barThickness: 18
  }
]
  };

  return {
    topCustomer,
    lowStockItems,
    totalCash,
    overdueChequesCount,
    chartData,
    todaySales,
    topItem
  };

}, []);

return (
<div className="container">

<h2 className="mb-4" style={{display:"flex",alignItems:"center",gap:8}}>
  <BarChart3 size={22}/>
  لوحة التحكم
</h2>



{/* ===== الكروت الرئيسية ===== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(5,1fr)",
    gap: 12,
    marginTop: 15
  }}
>
{/* تنبيه مخزون */}
<div
  className="glass-card text-center fade-in"
  style={{cursor:"pointer"}}
  onClick={() => navigate("/low-stock-report")}
>
  <div className="card-body">
    <h6><AlertTriangle size={16}/> تنبيه مخزون</h6>
    <h6 style={{fontSize:12}}>
      {lowStockItems.length > 0
        ? lowStockItems.slice(0,2).map(i =>
            `${i.name} (${i.qty})`
          ).join(" - ")
        : "لا يوجد نقص"}
    </h6>
  </div>
</div>



{/* عدد الأصناف */}
<div
  className="glass-card text-center fade-in"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/lists/items")}
>
  <div className="card-body">
    <h6>عدد الأصناف</h6>
    <h5 className="text-warning">
  {JSON.parse(localStorage.getItem("items") || "[]").length}
</h5>
  </div>
</div>

{/* عدد العملاء */}
<div
  className="glass-card text-center fade-in"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/lists/customers")}
>
  <div className="card-body">
    <h6>عدد العملاء</h6>
    <h5 className="text-warning">
  {JSON.parse(localStorage.getItem("customers") || "[]").length}
</h5>
  </div>
</div>

  <div className="glass-card text-center fade-in">
    <div className="card-body">
      <h6><DollarSign size={16}/> مبيعات اليوم</h6>
      <h5 className="text-primary">{todaySales.toFixed(2)}</h5>
    </div>
  </div>


  <div
  className="glass-card text-center fade-in"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/lists/cash")}
>
    <div className="card-body">
      <h6><Wallet size={16}/> إجمالي الخزنة</h6>
      <h5 className="text-info">{totalCash.toFixed(2)}</h5>
    </div>
  </div>

  <div
  className="glass-card text-center fade-in"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/lists/items")}
>
    <div className="card-body">
      <h6><Package size={16}/> أعلى صنف</h6>
      <h5 className="text-success">
  {topItem || "لا يوجد"}
</h5>
    </div>
  </div>
  <div className="glass-card text-center fade-in">
  <div className="card-body">
    <h6>رصيد اليوم</h6>
    <h5 className="text-primary">0.00</h5>
  </div>
</div>
<div className="glass-card text-center fade-in">
  <div className="card-body">
    <h6>إجمالي الكريديت</h6>
    <h5 className="text-danger">0.00</h5>
  </div>
</div>
<div
  className="glass-card text-center fade-in"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/customer-ledger")}
>
  <div className="card-body">
    <h6>شيكات متأخرة</h6>
    <h5 className="text-danger">{overdueChequesCount}</h5>
  </div>
</div>


  <div className="glass-card text-center fade-in">
    <div className="card-body">
      <h6><Users size={16}/> أعلى عميل</h6>
      <h5 className="text-success">
  {topCustomer ? topCustomer.name : "لا يوجد"}
</h5>
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

{/* ===== الرسم البياني ===== */}

<div className="glass-card mt-4 fade-in">
  <div className="card-body">

    <h5 style={{display:"flex",alignItems:"center",gap:6}}>
      <BarChart3 size={18}/>
      مبيعات وأرباح آخر 6 شهور
    </h5>

    <div style={{ height: "220px" }}>
    <Bar
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#e2e8f0",
          font: {
            size: 12
          }
        }
      },

      tooltip: {
        backgroundColor: "#020617",
        borderColor: "#334155",
        borderWidth: 1,
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 8
      }
    },

    scales: {
      x: {
        ticks: {
          color: "#94a3b8"
        },
        grid: {
          display: false
        }
      },

      y: {
        ticks: {
          color: "#94a3b8"
        },
        grid: {
          color: "rgba(148,163,184,0.1)"
        }
      }
    },

    animation: {
      duration: 1200,
      easing: "easeOutQuart"
    }
  }}
/>
    </div>

  </div>
</div>
</div>
);
}

export default Dashboard;