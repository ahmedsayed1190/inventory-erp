import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar() {
  const { t } = useTranslation();

  const [openSection, setOpenSection] = useState(null);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const resize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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
    transform: isActive ? "translateX(5px)" : "translateX(0)",
    cursor: "pointer"
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
    <>
      {/* Overlay للموبايل */}
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
            zIndex: 998
          }}
        />
      )}

      <div
        style={{
          width: isMobile ? 260 : sidebarWidth,
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 999,
          transform: isMobile
            ? collapsed
              ? "translateX(-100%)"
              : "translateX(0)"
            : "translateX(0)",
          background: "linear-gradient(180deg,#020617,#0f172a)",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          color: "#e2e8f0",
          padding: 18,
          height: "100vh",
          overflowY: "auto",
          boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
          transition: "0.3s ease"
        }}
      >

        {/* زرار */}
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

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          style={linkStyle}
          onMouseEnter={(e)=>{
            e.currentTarget.style.transform="translateX(6px)";
          }}
          onMouseLeave={(e)=>{
            e.currentTarget.style.transform="";
          }}
        >
          <LayoutDashboard size={18} />
          {!collapsed && t("sidebar.dashboard")}
        </NavLink>

        {/* Definitions */}
        <div style={sectionTitle} onClick={() => toggleSection("definitions")}>
          <span style={{display:"flex",gap:8}}>
            <Package size={16}/>
            {!collapsed && t("sidebar.definitions")}
          </span>
          <span style={arrowStyle("definitions")}>▸</span>
        </div>

        <div style={{
          maxHeight: openSection === "definitions" ? 500 : 0,
          overflow: "hidden",
          transition: "0.3s"
        }}>
          <NavLink to="/items" style={linkStyle}>📦 {t("sidebarLinks.items")}</NavLink>
          <NavLink to="/warehouses" style={linkStyle}>🏬 {t("sidebarLinks.warehouses")}</NavLink>
          <NavLink to="/customers" style={linkStyle}>👥 {t("sidebarLinks.customers")}</NavLink>
          <NavLink to="/suppliers" style={linkStyle}>🚚 {t("sidebarLinks.suppliers")}</NavLink>
        </div>

        {/* Purchases */}
        <div style={sectionTitle} onClick={() => toggleSection("purchases")}>
          <span>🛒 {t("sidebar.purchases")}</span>
          <span style={arrowStyle("purchases")}>▸</span>
        </div>

        {openSection === "purchases" && (
          <>
            <NavLink to="/purchase-invoice" style={linkStyle}>📥 فاتورة شراء</NavLink>
            <NavLink to="/purchase-return" style={linkStyle}>↩️ مرتجع</NavLink>
          </>
        )}

        {/* Sales */}
        <div style={sectionTitle} onClick={() => toggleSection("sales")}>
          <span style={{display:"flex",gap:8}}>
            <DollarSign size={16}/>
            {!collapsed && t("sidebar.sales")}
          </span>
          <span style={arrowStyle("sales")}>▸</span>
        </div>

        {openSection === "sales" && (
          <>
            <NavLink to="/invoice" style={linkStyle}>🧾 فاتورة</NavLink>
            <NavLink to="/sales-return" style={linkStyle}>↩️ مرتجع</NavLink>
          </>
        )}

        {/* Reports */}
        <div style={sectionTitle} onClick={() => toggleSection("reports")}>
          <span style={{display:"flex",gap:8}}>
            <BarChart3 size={16}/>
            {!collapsed && t("sidebar.reports")}
          </span>
          <span style={arrowStyle("reports")}>▸</span>
        </div>

        {openSection === "reports" && (
          <>
            <NavLink to="/stock-report" style={linkStyle}>📦 مخزون</NavLink>
            <NavLink to="/profit-report" style={linkStyle}>📈 أرباح</NavLink>
          </>
        )}

        {/* Settings */}
        <div style={sectionTitle} onClick={() => toggleSection("settings")}>
          <span style={{display:"flex",gap:8}}>
            <Settings size={16}/>
            {!collapsed && t("sidebar.settings")}
          </span>
          <span style={arrowStyle("settings")}>▸</span>
        </div>

        {openSection === "settings" && (
          <>
            <NavLink to="/settings/company" style={linkStyle}>🏢 الشركة</NavLink>
            <NavLink to="/settings/users" style={linkStyle}>👤 المستخدمين</NavLink>
          </>
        )}

      </div>
    </>
  );
}

export default Sidebar;