import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher"; // ✅ جديد

function Header({ onToggleSidebar, darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const appLogo = localStorage.getItem("appLogo");

  if (!user) return null;

  return (
   <div
  style={{
    position: "fixed",   // 🔥 مهم جدا
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,       // فوق كل حاجة

    height: 50,
    background: darkMode
  ? "linear-gradient(90deg,#0f172a,#1e293b)"
  : "linear-gradient(90deg,#3b82f6,#1d4ed8)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    color: darkMode ? "#fff" : "#f9fafb",

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
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    transition: "all 0.25s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
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
          background: "rgba(255,255,255,0.1)",
border: "none",
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
  onClick={() => setDarkMode(prev => !prev)}
  style={{
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    padding: "5px 10px",
    cursor: "pointer"
  }}
>
  {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>

        <button
          onClick={logout}
          style={{
            background: "rgba(255,255,255,0.1)",
border: "none",
borderRadius: 6,
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