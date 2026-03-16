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
          border: "1px solid red",
          borderRadius: 6,
          background: "#fff5f5"
        }}
      >
        <h3 style={{ color: "red" }}>🗑️ مسح جميع البيانات</h3>

        <ul>
          <li>جميع الفواتير</li>
          <li>المخزون</li>
          <li>العملاء والموردين</li>
          <li>بيانات الشركة</li>
        </ul>

        <button
          onClick={handleReset}
          style={{
            background: "red",
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