function ProfitByItemReport() {
  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  const profitMap = {};

  invoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const profit =
        (item.price - item.costPrice) * item.qty;

      if (!profitMap[item.name]) {
        profitMap[item.name] = 0;
      }

      profitMap[item.name] += profit;
    });
  });

  return (
    <div className="container">
      <h3 className="mb-4">📦 ربح الأصناف</h3>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>الصنف</th>
            <th>الربح</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(profitMap).length === 0 && (
            <tr>
              <td colSpan="2" className="text-center">
                لا توجد بيانات
              </td>
            </tr>
          )}

          {Object.entries(profitMap).map(
            ([name, profit]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{profit.toFixed(2)}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProfitByItemReport;