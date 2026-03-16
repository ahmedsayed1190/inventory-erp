import { Link } from "react-router-dom";

function SalesInvoices() {
  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  return (
    <div className="container">
      <h3>📑 فواتير البيع</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>رقم الفاتورة</th>
            <th>التاريخ</th>
            <th>العميل</th>
            <th>الإجمالي</th>
            <th>تفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                لا توجد فواتير
              </td>
            </tr>
          )}

          {invoices.map((inv, index) => (
            <tr key={inv.id}>
              <td>{index + 1}</td>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.date}</td>
              <td>{inv.customerName}</td>
              <td>{inv.total}</td>
              <td>
                <Link
                  className="btn btn-sm btn-info"
                  to={`/sales-invoice/${index}`}
                >
                  عرض
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SalesInvoices;