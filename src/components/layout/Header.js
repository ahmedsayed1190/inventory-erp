import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher"; // ✅ جديد

function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const appLogo = localStorage.getItem("appLogo");

  if (!user) return null;

  return (
    <div
      style={{
        height: 50,
        background: "#2c3e50",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px"
      }}
    >
      {/* ☰ زر السايدبار + اللوجو */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            fontSize: 22,
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ☰
        </button>

        {/* 🖥️ لوجو البرنامج */}
        {appLogo && (
          <img
            src={appLogo}
            alt="App Logo"
            style={{
              height: 32,
              objectFit: "contain"
            }}
          />
        )}
      </div>

      {/* 🔍 البحث الشامل */}
      <Link
        to="/global-search"
        style={{
          color: "#fff",
          textDecoration: "none",
          border: "1px solid #fff",
          padding: "5px 12px",
          borderRadius: 4
        }}
      >
        🔍 البحث الشامل
      </Link>

      {/* 🌍 اللغة + المستخدم */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        {/* ✅ محول اللغة */}
        <LanguageSwitcher />

        <span>
          👤 {user.username} {user.isAdmin && "(Admin)"}
        </span>

        <button
          onClick={logout}
          style={{
            background: "transparent",
            border: "1px solid #fff",
            color: "#fff",
            padding: "5px 10px",
            cursor: "pointer"
          }}
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

export default Header;