function Reports() {
  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  const totalSales = invoices.reduce(
    (sum, inv) => sum + inv.total,
    0
  );

  const invoicesCount = invoices.length;

  const itemsMap = {};
  invoices.forEach(inv => {
    inv.items.forEach(item => {
      itemsMap[item.name] =
        (itemsMap[item.name] || 0) + item.qty;
    });
  });

  const totalItemsSold = Object.values(itemsMap).reduce(
    (a, b) => a + b,
    0
  );

  const topItem = Object.entries(itemsMap)
    .sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ padding: 20 }}>
      <h2>Sales Report</h2>

      <p><strong>Total Sales:</strong> {totalSales}</p>
      <p><strong>Invoices Count:</strong> {invoicesCount}</p>
      <p><strong>Total Items Sold:</strong> {totalItemsSold}</p>

      {topItem && (
        <p>
          <strong>Top Product:</strong>{" "}
          {topItem[0]} ({topItem[1]} pcs)
        </p>
      )}
    </div>
  );
}

export default Reports;