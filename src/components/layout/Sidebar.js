import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Settings,
  Repeat,
  Wallet
} from "lucide-react";
function Sidebar() {
  const { t } = useTranslation();
const [openSection, setOpenSection] = useState(null);
const [collapsed, setCollapsed] = useState(false);
const sidebarWidth = collapsed ? 80 : 270;
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

const linkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  textDecoration: "none",
  color: isActive ? "#f97316" : "#cbd5e1",
  background: isActive ? "rgba(249,115,22,0.15)" : "transparent",
  borderRadius: 10,
  marginBottom: 4,
  fontSize: 13,
  transition: "all 0.25s ease",
  transform: isActive ? "translateX(5px)" : "translateX(0)"
});

  const sectionTitle = {
    marginTop: 20,
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 14,
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 10
  };

  const arrowStyle = (section) => ({
    transform: openSection === section ? "rotate(90deg)" : "rotate(0deg)",
    transition: "0.3s",
    fontSize: 12
  });

  return (
    <div
  style={{
    width: sidebarWidth,
    background: "linear-gradient(180deg,#020617,#0f172a)",
backdropFilter: "blur(12px)",
borderRight: "1px solid rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    padding: 18,
    height: "100vh",
    overflowY: "auto",
    boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
    transition: "width 0.3s ease"
  }}
>

      <div style={{ marginBottom: 15 }}>
<button
onClick={() => setCollapsed(!collapsed)}
style={{
background: "transparent",
border: "none",
color: "#fff",
fontSize: 18,
cursor: "pointer"
}}
>
☰
</button>
</div>
      {/* ================= Dashboard ================= */}
<NavLink to="/dashboard" style={linkStyle}>
<LayoutDashboard size={18} />
{!collapsed && t("sidebar.dashboard")}</NavLink>

      {/* ================= التعريفات ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("definitions")}>
        <span style={{display:"flex",alignItems:"center",gap:8}}>
  <Package size={16}/>
  {!collapsed && t("sidebar.definitions")}
</span>
        <span style={arrowStyle("definitions")}>▸</span>
      </div>

      {openSection === "definitions" && (
        <>
          <NavLink to="/items" style={linkStyle}>
  <Package size={16}/>
  {!collapsed && t("sidebarLinks.items")}
</NavLink>
          <NavLink to="/warehouses" style={linkStyle}>
  <Package size={16}/>
  {!collapsed && t("sidebarLinks.warehouses")}
</NavLink>
          <NavLink to="/customers" style={linkStyle}>
  <Users size={16}/>
  {!collapsed && t("sidebarLinks.customers")}
</NavLink>
          <NavLink to="/suppliers" style={linkStyle}>
  <Truck size={16}/>
  {!collapsed && t("sidebarLinks.suppliers")}
</NavLink>
          <NavLink to="/expenses" style={linkStyle}>💸 {t("sidebarLinks.expensesDef")}</NavLink>
          <NavLink to="/revenues" style={linkStyle}>💰 {t("sidebarLinks.revenuesDef")}</NavLink>
          <NavLink to="/cash-accounts" style={linkStyle}>🏦 {t("sidebarLinks.cashAccounts")}</NavLink>
        </>
      )}

      {/* ================= المشتريات ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("purchases")}>
        <span>🛒 {t("sidebar.purchases")}</span>
        <span style={arrowStyle("purchases")}>▸</span>
      </div>

      {openSection === "purchases" && (
  <>
    <NavLink to="/purchase-invoice" style={linkStyle}>
      📥 {t("sidebarLinks.purchaseInvoice")}
    </NavLink>

    <NavLink to="/purchase-return" style={linkStyle}>
      ↩️ {t("sidebarLinks.purchaseReturn")}
    </NavLink>

    <NavLink to="/supplier-ledger" style={linkStyle}>
      📑 {t("sidebarLinks.supplierLedger")}
    </NavLink>

    <NavLink to="/supplier-total-balances" style={linkStyle}>
  📊 {t("sidebarLinks.supplierTotalBalances")}
</NavLink>
  </>
)}

      {/* ================= المبيعات ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("sales")}>
        <span style={{display:"flex",alignItems:"center",gap:8}}>
  <DollarSign size={16}/>
  {!collapsed && t("sidebar.sales")}
</span>
        <span style={arrowStyle("sales")}>▸</span>
      </div>

      {openSection === "sales" && (
  <>
    <NavLink to="/invoice" style={linkStyle}>🧾 {t("sidebarLinks.salesInvoice")}</NavLink>
    <NavLink to="/sales-return" style={linkStyle}>↩️ {t("sidebarLinks.salesReturn")}</NavLink>
    <NavLink to="/customer-ledger" style={linkStyle}>📄 {t("sidebarLinks.customerLedger")}</NavLink>
    <NavLink to="/customer-total-balances" style={linkStyle}>
      📊 {t("sidebarLinks.customerTotal")}
    </NavLink>
  </>
)}
{/* ================= المصروفات ================= */}
<div style={sectionTitle} onClick={() => toggleSection("expenses")}>
  <span>💸 {t("sidebar.expenses")}</span>
  <span style={arrowStyle("expenses")}>▸</span>
</div>

{openSection === "expenses" && (
  <>

    <NavLink to="/lists/expenses" style={linkStyle}>
      📋 {t("sidebarLinks.expensesList")}
    </NavLink>
  </>
)}

{/* ================= الخزينة ================= */}
<div style={sectionTitle} onClick={() => toggleSection("cash")}>
  <span>🏦 {t("sidebar.cash")}</span>
  <span style={arrowStyle("cash")}>▸</span>
</div>

{openSection === "cash" && (
  <>
    <NavLink to="/add-cash-transaction" style={linkStyle}>
      ➕ {t("sidebarLinks.cashTransaction")}
    </NavLink>

    <NavLink to="/lists/cash" style={linkStyle}>
      📋 {t("sidebarLinks.cashList")}
    </NavLink>
  </>
)}      <div style={sectionTitle} onClick={() => toggleSection("transfer")}>
        <span>🔄 {t("sidebarLinks.stockTransfer")}</span>
        <span style={arrowStyle("transfer")}>▸</span>
      </div>

      {openSection === "transfer" && (
        <>
          <NavLink to="/stock-transfer" style={linkStyle}>
            🏬 {t("sidebarLinks.stockTransfer")}
          </NavLink>
        </>
      )}

      {/* ================= التقارير ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("reports")}>
        <span style={{display:"flex",alignItems:"center",gap:8}}>
  <BarChart3 size={16}/>
  {!collapsed && t("sidebar.reports")}
</span>
        <span style={arrowStyle("reports")}>▸</span>
      </div>

      {openSection === "reports" && (
        <>
          <NavLink to="/item-movement-report" style={linkStyle}>
            🔄 {t("sidebarLinks.itemMovement")}
          </NavLink>

          <NavLink to="/stock-report" style={linkStyle}>
            📦 {t("sidebarLinks.stockReport")}
          </NavLink>

          <NavLink to="/profit-report" style={linkStyle}>
            📈 {t("sidebarLinks.profitReport")}
          </NavLink>
        </>
      )}

      {/* ================= الكشوفات ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("lists")}>
        <span>📋 {t("sidebar.lists")}</span>
        <span style={arrowStyle("lists")}>▸</span>
      </div>

     {openSection === "lists" && (
  <>
    <NavLink to="/lists/items" style={linkStyle}>
      📦 {t("sidebarLinks.itemsList")}
    </NavLink>

    <NavLink to="/lists/suppliers" style={linkStyle}>
      🚚 {t("sidebarLinks.suppliersList")}
    </NavLink>

    <NavLink to="/lists/customers" style={linkStyle}>
      👥 {t("sidebarLinks.customersList")}
    </NavLink>

    <NavLink to="/lists/expenses" style={linkStyle}>
      💸 {t("sidebarLinks.expensesList")}
    </NavLink>

    <NavLink to="/lists/revenues" style={linkStyle}>
      💰 {t("sidebarLinks.revenuesList")}
    </NavLink>
  </>
)}

      {/* ================= الإعدادات ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("settings")}>
        <span style={{display:"flex",alignItems:"center",gap:8}}>
  <Settings size={16}/>
  {!collapsed && t("sidebar.settings")}
</span>
        <span style={arrowStyle("settings")}>▸</span>
      </div>

      {openSection === "settings" && (
        <>
          <NavLink to="/settings/company" style={linkStyle}>
            🏢 {t("sidebarLinks.companySettings")}
          </NavLink>

          <NavLink to="/settings/users" style={linkStyle}>
            👤 {t("sidebarLinks.usersSettings")}
          </NavLink>

          <NavLink to="/settings/system" style={linkStyle}>
            🗑️ {t("sidebarLinks.systemSettings")}
          </NavLink>
        </>
      )}

    </div>
  );
}

export default Sidebar;