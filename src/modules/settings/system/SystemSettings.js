function SystemSettings() {

  /* ================== Reset System ================== */
  const handleReset = () => {

    const confirm1 = window.confirm(
      "⚠️ تحذير: سيتم مسح جميع البيانات (فواتير – مخزون – عملاء – موردين – بيانات الشركة).\nهل أنت متأكد؟"
    );
    if (!confirm1) return;

    const confirm2 = window.confirm(
      "❗ تأكيد أخير: لا يمكن التراجع عن هذه العملية.\nهل تريد المتابعة؟"
    );
    if (!confirm2) return;

    /* مسح كل بيانات البرنامج بالكامل */
    localStorage.clear();

    alert("✅ تم مسح جميع البيانات بنجاح");

    window.location.reload();
  };

  /* ================== Render ================== */
  return (
    <div style={{ maxWidth: 600 }}>
      <h2>⚙️ إعدادات النظام</h2>

      {/* ===== Danger Zone ===== */}
      <div
        style={{
          marginTop: 30,
          padding: 20,
          borderRadius: 6,
          background: "rgba(15,23,42,0.9)",
          color: "#e2e8f0",
          border: "1px solid rgba(255,0,0,0.4)"
        }}
      >
        <h3 style={{ color: "#f87171" }}>🗑️ مسح جميع البيانات</h3>

        <ul>
          <li>جميع الفواتير</li>
          <li>المخزون</li>
          <li>العملاء والموردين</li>
          <li>بيانات الشركة</li>
        </ul>

        <button
          onClick={handleReset}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: 4
          }}
        >
          مسح كل البيانات
        </button>

      </div>
    </div>
  );
}

export default SystemSettings;