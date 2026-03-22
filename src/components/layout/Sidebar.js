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
  display: "flex",
  alignItems: "center",
  gap: 10,

  padding: collapsed ? "8px 10px" : "10px 16px",

  textDecoration: "none",
  color: isActive ? "#38bdf8" : "#cbd5e1",

  background: isActive
    ? "rgba(56,189,248,0.15)"
    : "transparent",

  borderRadius: 10,
  marginBottom: 6,
  fontSize: collapsed ? 12 : 13,

  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",

  transform: isActive ? "translateX(6px)" : "translateX(0)",

  borderLeft: isActive
  ? "3px solid #38bdf8"
  : "3px solid transparent",

boxShadow: isActive
  ? "0 0 12px rgba(56,189,248,0.3)"
  : "none",
});
 const sectionTitle = {
  marginTop: 18,
  marginBottom: 6,
  fontWeight: 600,
  fontSize: 13,
  color: "#64748b",
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  gap: 8,

  padding: "8px 12px",
  borderRadius: 8,

  transition: "0.25s"
};

  const arrowStyle = (section) => ({
    transform: openSection === section ? "rotate(90deg)" : "rotate(0deg)",
    transition: "0.3s",
    fontSize: 12
  });
  const sectionHover = {
  onMouseEnter: (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.background = "transparent";
  }
};

 const hoverEffect = {
  onMouseEnter: (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
    e.currentTarget.style.transform = "translateX(4px)";
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.transform = "translateX(0)";
  }
};
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
  width: isMobile ? 260 : (collapsed ? 80 : 260),

  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 9999,

  transform: collapsed ? "translateX(-100%)" : "translateX(0)",

  // ✅ نسخة واحدة بس
  background: "rgba(15,23,42,0.85)",
  backdropFilter: "blur(14px)",
  borderRight: "1px solid rgba(255,255,255,0.08)",

  color: "#e2e8f0",
  padding: 18,
  height: "100vh",
  overflowY: "auto",
  boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
}}
>

      {/* ================= Dashboard ================= */}
<NavLink to="/dashboard" style={linkStyle} {...hoverEffect}>
  📊 {t("sidebar.dashboard")}
</NavLink>
      {/* ================= التعريفات ================= */}
      <div
  style={sectionTitle}
  onClick={() => toggleSection("definitions")}
  {...sectionHover}
>
  <span>📦 {t("sidebar.definitions")}</span>
  <span style={arrowStyle("definitions")}>▸</span>
</div>

      {openSection === "definitions" && (
        <>
          <NavLink to="/items" style={linkStyle} {...hoverEffect}>
  🧾 {t("sidebarLinks.items")}
</NavLink>

<NavLink to="/warehouses" style={linkStyle} {...hoverEffect}>
  🏬 {t("sidebarLinks.warehouses")}
</NavLink>

<NavLink to="/customers" style={linkStyle} {...hoverEffect}>
  👥 {t("sidebarLinks.customers")}
</NavLink>

<NavLink to="/suppliers" style={linkStyle} {...hoverEffect}>
  🚚 {t("sidebarLinks.suppliers")}
</NavLink>

<NavLink to="/expenses" style={linkStyle} {...hoverEffect}>
  💸 {t("sidebarLinks.expensesDef")}
</NavLink>

<NavLink to="/revenues" style={linkStyle} {...hoverEffect}>
  💰 {t("sidebarLinks.revenuesDef")}
</NavLink>

<NavLink to="/cash-accounts" style={linkStyle} {...hoverEffect}>
  🏦 {t("sidebarLinks.cashAccounts")}
</NavLink>
        </>
      )}

      {/* ================= المشتريات ================= */}
  <div
  style={sectionTitle}
  onClick={() => toggleSection("purchases")}
  {...sectionHover}
>
  <span>🛒 {t("sidebar.purchases")}</span>
  <span style={arrowStyle("purchases")}>▸</span>
</div>

      {openSection === "purchases" && (
  <>
    <NavLink to="/purchase-invoice" style={linkStyle} {...hoverEffect}>
  📥 {t("sidebarLinks.purchaseInvoice")}
</NavLink>

<NavLink to="/purchase-return" style={linkStyle} {...hoverEffect}>
  ↩️ {t("sidebarLinks.purchaseReturn")}
</NavLink>

<NavLink to="/supplier-ledger" style={linkStyle} {...hoverEffect}>
  📑 {t("sidebarLinks.supplierLedger")}
</NavLink>

<NavLink to="/supplier-total-balances" style={linkStyle} {...hoverEffect}>
  📊 {t("sidebarLinks.supplierTotalBalances")}
</NavLink>
  </>
)}

      {/* ================= المبيعات ================= */}
     <div
  style={sectionTitle}
  onClick={() => toggleSection("sales")}
  {...sectionHover}
>
  <span>💵 {t("sidebar.sales")}</span>
  <span style={arrowStyle("sales")}>▸</span>
</div>

      {openSection === "sales" && (
  <>
    <NavLink to="/invoice" style={linkStyle} {...hoverEffect}>
  🧾 {t("sidebarLinks.salesInvoice")}
</NavLink>

<NavLink to="/sales-return" style={linkStyle} {...hoverEffect}>
  ↩️ {t("sidebarLinks.salesReturn")}
</NavLink>

<NavLink to="/customer-ledger" style={linkStyle} {...hoverEffect}>
  📄 {t("sidebarLinks.customerLedger")}
</NavLink>

<NavLink to="/customer-total-balances" style={linkStyle} {...hoverEffect}>
  📊 {t("sidebarLinks.customerTotal")}
</NavLink>
  </>
)}
{/* ================= المصروفات ================= */}
<div
  style={sectionTitle}
  onClick={() => toggleSection("expenses")}
  {...sectionHover}
>
  <span>💸 {t("sidebar.expenses")}</span>
  <span style={arrowStyle("expenses")}>▸</span>
</div>

{openSection === "expenses" && (
  <>

    <NavLink to="/lists/expenses" style={linkStyle} {...hoverEffect}>
  📋 {t("sidebarLinks.expensesList")}
</NavLink>
  </>
)}

{/* ================= الخزينة ================= */}
<div
  style={sectionTitle}
  onClick={() => toggleSection("cash")}
  {...sectionHover}
>
  <span>🏦 {t("sidebar.cash")}</span>
  <span style={arrowStyle("cash")}>▸</span>
</div>

{openSection === "cash" && (
  <>
    <NavLink to="/add-cash-transaction" style={linkStyle} {...hoverEffect}>
  ➕ {t("sidebarLinks.cashTransaction")}
</NavLink>

<NavLink to="/lists/cash" style={linkStyle} {...hoverEffect}>
  📋 {t("sidebarLinks.cashList")}
</NavLink>
  </>
)}    <div
  style={sectionTitle}
  onClick={() => toggleSection("transfer")}
  {...sectionHover}
>
  <span>🔄 {t("sidebarLinks.stockTransfer")}</span>
  <span style={arrowStyle("transfer")}>▸</span>
</div>

      {openSection === "transfer" && (
        <>
          <NavLink to="/stock-transfer" style={linkStyle} {...hoverEffect}>
  🏬 {t("sidebarLinks.stockTransfer")}
</NavLink>
        </>
      )}

      {/* ================= التقارير ================= */}
     <div
  style={sectionTitle}
  onClick={() => toggleSection("reports")}
  {...sectionHover}
>
  <span>📊 {t("sidebar.reports")}</span>
  <span style={arrowStyle("reports")}>▸</span>
</div>

      {openSection === "reports" && (
        <>
          <NavLink to="/item-movement-report" style={linkStyle} {...hoverEffect}>
  🔄 {t("sidebarLinks.itemMovement")}
</NavLink>

<NavLink to="/stock-report" style={linkStyle} {...hoverEffect}>
  📦 {t("sidebarLinks.stockReport")}
</NavLink>

<NavLink to="/profit-report" style={linkStyle} {...hoverEffect}>
  📈 {t("sidebarLinks.profitReport")}
</NavLink>
        </>
      )}

      {/* ================= الكشوفات ================= */}
      <div
  style={sectionTitle}
  onClick={() => toggleSection("lists")}
  {...sectionHover}
>
  <span>📋 {t("sidebar.lists")}</span>
  <span style={arrowStyle("lists")}>▸</span>
</div>

     {openSection === "lists" && (
  <>
   <NavLink to="/lists/items" style={linkStyle} {...hoverEffect}>
  📦 {t("sidebarLinks.itemsList")}
</NavLink>

<NavLink to="/lists/suppliers" style={linkStyle} {...hoverEffect}>
  🚚 {t("sidebarLinks.suppliersList")}
</NavLink>

<NavLink to="/lists/customers" style={linkStyle} {...hoverEffect}>
  👥 {t("sidebarLinks.customersList")}
</NavLink>

<NavLink to="/lists/expenses" style={linkStyle} {...hoverEffect}>
  💸 {t("sidebarLinks.expensesList")}
</NavLink>

<NavLink to="/lists/revenues" style={linkStyle} {...hoverEffect}>
  💰 {t("sidebarLinks.revenuesList")}
</NavLink>
  </>
)}

      {/* ================= الإعدادات ================= */}
  <div
  style={sectionTitle}
  onClick={() => toggleSection("settings")}
  {...sectionHover}
>
  <span>⚙️ {t("sidebar.settings")}</span>
  <span style={arrowStyle("settings")}>▸</span>
</div>

      {openSection === "settings" && (
        <>
         <NavLink to="/settings/company" style={linkStyle} {...hoverEffect}>
  🏢 {t("sidebarLinks.companySettings")}
</NavLink>

<NavLink to="/settings/users" style={linkStyle} {...hoverEffect}>
  👤 {t("sidebarLinks.usersSettings")}
</NavLink>

<NavLink to="/settings/system" style={linkStyle} {...hoverEffect}>
  🗑️ {t("sidebarLinks.systemSettings")}
</NavLink>
        </>
      )}

   </div>
</>
);
}

export default Sidebar;