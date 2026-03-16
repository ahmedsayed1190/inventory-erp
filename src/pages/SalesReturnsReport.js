function SalesReturnsReport() {
  const returns =
    JSON.parse(localStorage.getItem("salesReturns")) || [];

  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  if (returns.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>تقرير مرتجعات المبيعات</h2>
        <p>لا توجد مرتجعات</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>تقرير مرتجعات المبيعات</h2>

      {returns.map((ret, i) => {
        const invoice = invoices[ret.invoiceIndex];

        return (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10
            }}
          >
            <p>
              <strong>التاريخ:</strong> {ret.date}
            </p>

            <p>
              <strong>فاتورة:</strong>{" "}
              {invoice
                ? `فاتورة ${Number(ret.invoiceIndex) + 1}`
                : "غير موجودة"}
            </p>

            <table border="1" cellPadding="6">
              <thead>
                <tr>
                  <th>الصنف</th>
                  <th>الكمية المرتجعة</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ret.items).map(
                  ([name, qty], idx) =>
                    qty > 0 && (
                      <tr key={idx}>
                        <td>{name}</td>
                        <td>{qty}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default SalesReturnsReport;