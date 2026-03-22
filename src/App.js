import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/ui.css";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===== Auth ===== */
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext";

/* ===== Layout ===== */
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

/* ===== Dashboard ===== */
import Dashboard from "./pages/Dashboard";
import LowStockReport from "./pages/LowStockReport";
/* ===== Sales ===== */
import InvoicePrint from "./pages/InvoicePrint";
import Invoice from "./pages/Invoice";
import SalesInvoices from "./pages/SalesInvoices";
import SalesInvoiceDetails from "./pages/SalesInvoiceDetails";
import SalesReturn from "./pages/SalesReturn";
import CustomerLedger from "./pages/CustomerLedger";
import CustomerTotalBalances from "./pages/CustomerTotalBalances";
/* ===== Purchases ===== */
import PurchaseInvoice from "./pages/PurchaseInvoice";
import PurchaseInvoiceDetails from "./pages/PurchaseInvoiceDetails";
import PurchaseReturn from "./pages/PurchaseReturn";
import SupplierLedger from "./pages/SupplierLedger";
import SupplierTotalBalances from "./pages/SupplierTotalBalances";
/* ===== Definitions ===== */
import Items from "./modules/definitions/items/Items";
import Warehouses from "./modules/definitions/warehouses/Warehouses";
import Suppliers from "./modules/definitions/suppliers/Suppliers";
import Customers from "./modules/definitions/customers/Customers";
import Expenses from "./modules/definitions/expenses/Expenses";
import Revenues from "./modules/definitions/revenues/Revenues";

/* ===== Cash ===== */
import CashList from "./pages/lists/CashList";
import AddCashTransaction from "./pages/AddCashTransaction";
/* ===== Inventory ===== */
import StockEntry from "./pages/StockEntry";
import StockTransfer from "./pages/StockTransfer";

/* ===== Reports ===== */
import StockReport from "./pages/StockReport";
import ItemMovementReport from "./pages/ItemMovementReport";
import ProfitReport from "./pages/ProfitReport";

/* ===== Lists ===== */
import CustomersList from "./pages/lists/CustomersList";
import ItemsList from "./pages/lists/ItemsList";
import ExpensesList from "./pages/lists/ExpensesList";
import SuppliersList from "./pages/lists/SuppliersList";
import RevenuesList from "./pages/lists/RevenuesList";
/* ===== Settings ===== */
import UsersPage from "./modules/settings/users/UsersPage";
import SystemSettings from "./modules/settings/system/SystemSettings";
import CompanySettings from "./modules/settings/system/CompanySettings";

/* ===== Global ===== */
import GlobalSearchPage from "./modules/globalSearch/GlobalSearchPage";

/* ======================= */
/* ===== Main Layout ===== */
/* ======================= */
function MainLayout() {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 👇 ضيف دول هنا
  const [translateX, setTranslateX] = useState(-260);
  const [isDragging, setIsDragging] = useState(false);

  // 👇 لو مش عندك دول ضيفهم
  const [touchStartX, setTouchStartX] = useState(0);


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) setCollapsed(false);
      else setCollapsed(true);
    };

    handleResize(); // مهم
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
  style={{
    background: "#0f172a",
    minHeight: "100vh",
    overflowX: "hidden" // 🔥 يمنع الفلاش
  }}

  onTouchStart={(e) => {
  const x = e.touches[0].clientX;

  // يبدأ سحب بس من الحافة أو لو مفتوح
  if (x < 40 || !collapsed) {
    setIsDragging(true);
    setTouchStartX(x);
  }
}}

onTouchMove={(e) => {
  if (!isDragging) return;

  const currentX = e.touches[0].clientX;
  const diff = currentX - touchStartX;

  let newTranslate;

  if (collapsed) {
    // بيفتح
    newTranslate = Math.min(0, -260 + diff);
  } else {
    // بيقفل
    newTranslate = Math.min(0, diff);
  }

  setTranslateX(newTranslate);
}}

onTouchEnd={() => {
  if (!isDragging) return;

  setIsDragging(false);

  // قرار فتح أو قفل
  if (translateX > -130) {
    setCollapsed(false);
    setTranslateX(0);
  } else {
    setCollapsed(true);
    setTranslateX(-260);
  }
}}
>
      
      {/* Overlay */}
      {isMobile && !collapsed && (
  <div
    onClick={() => setCollapsed(true)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 9998
    }}
  />
)}

      {/* Sidebar */}
      <Sidebar
  collapsed={collapsed}
  setCollapsed={setCollapsed}
  translateX={translateX}
  isDragging={isDragging}
/>

      {/* Content */}
    <div
  style={{
    marginLeft: isMobile ? 0 : (collapsed ? 0 : 260),
    ttransition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
  }}
>
        <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

        <div style={{ padding: 20 }}>
          <Routes>

            {/* ===== Dashboard ===== */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/low-stock-report" element={<LowStockReport />} />

            {/* ===== Definitions ===== */}
            <Route path="/items" element={<Items />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/revenues" element={<Revenues />} />

            {/* ===== Lists ===== */}
            <Route path="/lists/customers" element={<CustomersList />} />
            <Route path="/lists/items" element={<ItemsList />} />
            <Route path="/lists/suppliers" element={<SuppliersList />} />
            <Route path="/lists/expenses" element={<ExpensesList />} />
            <Route path="/lists/revenues" element={<RevenuesList />} />

            {/* ===== Inventory ===== */}
            <Route path="/stock-entry" element={<StockEntry />} />
            <Route path="/stock-transfer" element={<StockTransfer />} />

            {/* ===== Purchases ===== */}
            <Route path="/purchase-invoice" element={<PurchaseInvoice />} />
            <Route path="/purchase-invoice/:index" element={<PurchaseInvoiceDetails />} />
            <Route path="/purchase-return" element={<PurchaseReturn />} />
            <Route path="/supplier-ledger" element={<SupplierLedger />} />
            <Route path="/supplier-total-balances" element={<SupplierTotalBalances />} />

            {/* ===== Sales ===== */}
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/sales-invoices" element={<SalesInvoices />} />
            <Route path="/sales-invoice/:index" element={<SalesInvoiceDetails />} />
            <Route path="/sales-return" element={<SalesReturn />} />
            <Route path="/customer-ledger" element={<CustomerLedger />} />
            <Route path="/customer-total-balances" element={<CustomerTotalBalances />} />

            {/* ===== Cash ===== */}
            <Route path="/add-cash-transaction" element={<AddCashTransaction />} />
            <Route path="/lists/cash" element={<CashList />} />

            {/* ===== Reports ===== */}
            <Route path="/item-movement-report" element={<ItemMovementReport />} />
            <Route path="/stock-report" element={<StockReport />} />
            <Route path="/profit-report" element={<ProfitReport />} />

            {/* ===== Global ===== */}
            <Route path="/global-search" element={<GlobalSearchPage />} />

            {/* ===== Settings ===== */}
            <Route path="/settings/users" element={<UsersPage />} />
            <Route path="/settings/company" element={<CompanySettings />} />
            <Route path="/settings/system" element={<SystemSettings />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
/* ======================= */
/* ========= APP ========= */
/* ======================= */

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl
        pauseOnHover
      />

      <Routes>

        {/* صفحة الطباعة */}
        <Route
          path="/invoice/:invoiceId"
          element={
            <PrivateRoute>
              <InvoicePrint />
            </PrivateRoute>
          }
        />

        {/* باقي النظام */}
        <Route
          path="/*"
          element={
            user ? (
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            ) : (
              <Login />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;