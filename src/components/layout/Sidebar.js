import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar({ collapsed, setCollapsed }) {
  const { t } = useTranslation();
const [openSection, setOpenSection] = useState(null);
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
useEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

  
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: collapsed ? "8px 10px" : "10px 16px",
    textDecoration: "none",
    color: isActive ? "#22d3ee" : "#cbd5e1",
    background: isActive ? "rgba(34,211,238,0.12)" : "transparent",
    borderRadius: 8,
    marginBottom: 4,
    fontSize: collapsed ? 12 : 13,
    transition: "all 0.25s ease",
transform: isActive ? "translateX(6px)" : "translateX(0)",
  });

  const sectionTitle = {
    marginTop: 20,
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 14,
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
alignItems: "center",
justifyContent: "flex-start",
gap: 10,
    padding: "10px 12px",
    borderRadius: 10
  };

  const arrowStyle = (section) => ({
    transform: openSection === section ? "rotate(90deg)" : "rotate(0deg)",
    transition: "0.3s",
    fontSize: 12
  });

  
return (
  <>
    {/* Overlay */}
    {isMobile && !collapsed && (
      <div
        onClick={() => setCollapsed(true)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          zIndex: 9998
        }}
      />
    )}
      

    {/* Sidebar */}
   <div
  style={{
    width: isMobile ? 260 : (collapsed ? 200 : 260),

    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 9999,

    transform: isMobile
  ? (collapsed ? "translateX(-100%)" : "translateX(0)")
  : "translateX(0)",

    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",

    background: "linear-gradient(180deg,#0f172a,#1e293b)",
    color: "#e2e8f0",
    padding: 18,
    height: "100vh",
    overflowY: "auto",
    boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
  }}
>

      {/* ================= Dashboard ================= */}
<NavLink to="/dashboard" style={linkStyle}>
📊 {t("sidebar.dashboard")}</NavLink>

      {/* ================= التعريفات ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("definitions")}>
        <span>📦 {!collapsed && t("sidebar.definitions")}</span>
        <span style={arrowStyle("definitions")}>▸</span>
      </div>

      {openSection === "definitions" && !collapsed && (
        <>
          <NavLink to="/items" style={linkStyle}>🧾 {t("sidebarLinks.items")}</NavLink>
          <NavLink to="/warehouses" style={linkStyle}>🏬 {t("sidebarLinks.warehouses")}</NavLink>
          <NavLink to="/customers" style={linkStyle}>👥 {t("sidebarLinks.customers")}</NavLink>
          <NavLink to="/suppliers" style={linkStyle}>🚚 {t("sidebarLinks.suppliers")}</NavLink>
          <NavLink to="/expenses" style={linkStyle}>💸 {t("sidebarLinks.expensesDef")}</NavLink>
          <NavLink to="/revenues" style={linkStyle}>💰 {t("sidebarLinks.revenuesDef")}</NavLink>
          <NavLink to="/cash-accounts" style={linkStyle}>🏦 {t("sidebarLinks.cashAccounts")}</NavLink>
        </>
      )}

      {/* ================= المشتريات ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("purchases")}>
        <span>🛒 {!collapsed &&t("sidebar.purchases")}</span>
        <span style={arrowStyle("purchases")}>▸</span>
      </div>

      {openSection === "purchases" && !collapsed && (
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
        <span>💵 {!collapsed &&t("sidebar.sales")}</span>
        <span style={arrowStyle("sales")}>▸</span>
      </div>

      {openSection === "sales" && !collapsed && (
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
  <span>💸 {!collapsed &&t("sidebar.expenses")}</span>
  <span style={arrowStyle("expenses")}>▸</span>
</div>

{openSection === "expenses" && !collapsed && (
  <>

    <NavLink to="/lists/expenses" style={linkStyle}>
      📋 {t("sidebarLinks.expensesList")}
    </NavLink>
  </>
)}

{/* ================= الخزينة ================= */}
<div style={sectionTitle} onClick={() => toggleSection("cash")}>
  <span>🏦 {!collapsed &&t("sidebar.cash")}</span>
  <span style={arrowStyle("cash")}>▸</span>
</div>

{openSection === "cash" && !collapsed && (
  <>
    <NavLink to="/add-cash-transaction" style={linkStyle}>
      ➕ {t("sidebarLinks.cashTransaction")}
    </NavLink>

    <NavLink to="/lists/cash" style={linkStyle}>
      📋 {t("sidebarLinks.cashList")}
    </NavLink>
  </>
)}      <div style={sectionTitle} onClick={() => toggleSection("transfer")}>
        <span>🔄 {!collapsed &&t("sidebarLinks.stockTransfer")}</span>
        <span style={arrowStyle("transfer")}>▸</span>
      </div>

      {openSection === "transfer" && !collapsed && (
        <>
          <NavLink to="/stock-transfer" style={linkStyle}>
            🏬 {t("sidebarLinks.stockTransfer")}
          </NavLink>
        </>
      )}

      {/* ================= التقارير ================= */}
      <div style={sectionTitle} onClick={() => toggleSection("reports")}>
        <span>📊 {!collapsed &&t("sidebar.reports")}</span>
        <span style={arrowStyle("reports")}>▸</span>
      </div>

      {openSection === "reports" && !collapsed && (
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
        <span>📋 {!collapsed &&t("sidebar.lists")}</span>
        <span style={arrowStyle("lists")}>▸</span>
      </div>

     {openSection === "lists" && !collapsed && (
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
        <span>⚙️ {!collapsed &&t("sidebar.settings")}</span>
        <span style={arrowStyle("settings")}>▸</span>
      </div>

      {openSection === "settings" && !collapsed && (
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
</>
);
}

export default Sidebar;