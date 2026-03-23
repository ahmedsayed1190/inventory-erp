import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

function Sidebar({ collapsed, setCollapsed, translateX, isDragging }) {
  const { t } = useTranslation();
  const [indicatorTop, setIndicatorTop] = useState(0);
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

return (
  <>
 

    {/* Sidebar */}
   <div
  className="sidebar"
  style={{
    width: isMobile ? 260 : (collapsed ? 80 : 260),
  position: "fixed",
  left: 0,
  top: 50,
  zIndex: 9999,

  transform: isMobile
  ? `translateX(${translateX}px)`
  : "translateX(0)",

  transition: isDragging
  ? "none"
  : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
  willChange: "transform",
backfaceVisibility: "hidden",
transformStyle: "preserve-3d",
  background: "rgba(15,23,42,0.85)",
  backdropFilter: "blur(14px)",
  borderRight: "1px solid rgba(255,255,255,0.08)",

  color: "#e2e8f0",
  padding: 18,
  height: "calc(100vh - 50px)",
  overflowY: "auto",
}}
>
<div
  className="active-indicator"
  style={{ top: indicatorTop }}
/>
      {/* ================= Dashboard ================= */}
<NavLink
  to="/dashboard"
  end
  className={({ isActive }) => isActive ? "active-link link" : "link"}
  ref={(el) => {
    if (el && el.classList.contains("active-link")) {
      setIndicatorTop(el.offsetTop);
    }
  }}
>
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
         <NavLink to="/items" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🧾 {t("sidebarLinks.items")}
</NavLink>

<NavLink to="/warehouses" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🏬 {t("sidebarLinks.warehouses")}
</NavLink>

<NavLink to="/customers" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  👥 {t("sidebarLinks.customers")}
</NavLink>

<NavLink to="/suppliers" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🚚 {t("sidebarLinks.suppliers")}
</NavLink>

<NavLink to="/expenses" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  💸 {t("sidebarLinks.expensesDef")}
</NavLink>

<NavLink to="/revenues" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  💰 {t("sidebarLinks.revenuesDef")}
</NavLink>

<NavLink to="/cash-accounts" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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
   <NavLink to="/purchase-invoice" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  📥 {t("sidebarLinks.purchaseInvoice")}
</NavLink>

<NavLink to="/purchase-return" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  ↩️ {t("sidebarLinks.purchaseReturn")}
</NavLink>

<NavLink to="/supplier-ledger" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  📑 {t("sidebarLinks.supplierLedger")}
</NavLink>

<NavLink to="/supplier-total-balances" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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
   <NavLink to="/invoice" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🧾 {t("sidebarLinks.salesInvoice")}
</NavLink>

<NavLink to="/sales-return" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  ↩️ {t("sidebarLinks.salesReturn")}
</NavLink>

<NavLink to="/customer-ledger" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  📄 {t("sidebarLinks.customerLedger")}
</NavLink>

<NavLink to="/customer-total-balances" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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

   <NavLink to="/lists/expenses" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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
    <NavLink to="/add-cash-transaction" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  ➕ {t("sidebarLinks.cashTransaction")}
</NavLink>

<NavLink to="/lists/cash" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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
        <NavLink to="/stock-transfer" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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
    <NavLink to="/item-movement-report" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🔄 {t("sidebarLinks.itemMovement")}
</NavLink>

<NavLink to="/stock-report" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  📦 {t("sidebarLinks.stockReport")}
</NavLink>

<NavLink to="/profit-report" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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
  <NavLink to="/lists/items" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  📦 {t("sidebarLinks.itemsList")}
</NavLink>

<NavLink to="/lists/suppliers" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🚚 {t("sidebarLinks.suppliersList")}
</NavLink>

<NavLink to="/lists/customers" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  👥 {t("sidebarLinks.customersList")}
</NavLink>

<NavLink to="/lists/revenues" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
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
        <NavLink to="/settings/company" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🏢 {t("sidebarLinks.companySettings")}
</NavLink>

<NavLink to="/settings/users" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  👤 {t("sidebarLinks.usersSettings")}
</NavLink>

<NavLink to="/settings/system" className={({ isActive }) => isActive ? "active-link link" : "link"} ref={(el)=>{if(el && el.classList.contains("active-link")) setIndicatorTop(el.offsetTop);}}>
  🗑️ {t("sidebarLinks.systemSettings")}
</NavLink>
        </>
      )}

   </div>
</>
);
}

export default Sidebar;