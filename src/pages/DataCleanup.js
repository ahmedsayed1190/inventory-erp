function DataCleanup() {
  const keys = [
    "products",
    "warehouses",
    "stockEntries",
    "stockTransfers",
    "salesInvoices",
    "salesReturns",
    "purchaseInvoices"
  ];

  const clearAll = () => {
    if (!window.confirm("هل أنت متأكد من مسح كل البيانات؟")) return;

    keys.forEach((k) => localStorage.removeItem(k));
    alert("تم مسح كل البيانات");
    window.location.reload();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>تنظيف البيانات</h2>

      <ul>
        {keys.map((k) => (
          <li key={k}>
            {k} :{" "}
            {localStorage.getItem(k) ? "موجود" : "فارغ"}
          </li>
        ))}
      </ul>

      <button
        onClick={clearAll}
        style={{ marginTop: 20, color: "red" }}
      >
        تفريغ البرنامج من البيانات
      </button>
    </div>
  );
}

export default DataCleanup;