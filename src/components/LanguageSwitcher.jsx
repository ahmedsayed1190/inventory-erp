import { useState } from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setOpen(false);

  };

  return (
    <div style={{ position: "relative" }}>
      {/* 🌍 أيقونة اللغة */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: 18,
          cursor: "pointer",
        }}
        title="Change Language"
      >
        🌍
      </button>

      {/* القائمة */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            background: "#fff",
            color: "#000",
            borderRadius: 4,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            overflow: "hidden",
            minWidth: 120,
            zIndex: 1000,
          }}
        >
          <div
            onClick={() => changeLang("ar")}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            🇪🇬 عربي
          </div>

          <div
            onClick={() => changeLang("en")}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            🇺🇸 English
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;