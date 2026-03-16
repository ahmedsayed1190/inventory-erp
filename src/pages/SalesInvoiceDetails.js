import { useParams, useNavigate } from "react-router-dom";

function SalesInvoiceDetails() {
  const { index } = useParams();
  const navigate = useNavigate();

  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  const currentIndex = Number(index);
  const invoice = invoices[currentIndex];

  if (!invoice) {
    return <div className="alert alert-danger">الفاتورة غير موجودة</div>;
  }

  return (
    <div className="container">
      <h3>فاتورة رقم #{invoice.invoiceNumber}</h3>

      <p>التاريخ: {invoice.date}</p>
      <p>العميل: {invoice.customerName}</p>
      <p>الإجمالي: {invoice.total}</p>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>الصنف</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((i, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{i.name}</td>
              <td>{i.qty}</td>
              <td>{i.price}</td>
              <td>{i.qty * i.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex gap-2">
        <button
          onClick={() => navigate(`/sales-invoice/0`)}
          disabled={currentIndex === 0}
        >
          ⏮
        </button>

        <button
          onClick={() => navigate(`/sales-invoice/${currentIndex - 1}`)}
          disabled={currentIndex === 0}
        >
          ◀
        </button>

        <button
          onClick={() => navigate(`/sales-invoice/${currentIndex + 1}`)}
          disabled={currentIndex === invoices.length - 1}
        >
          ▶
        </button>

        <button
          onClick={() => navigate(`/sales-invoice/${invoices.length - 1}`)}
          disabled={currentIndex === invoices.length - 1}
        >
          ⏭
        </button>

        <button onClick={() => window.print()}>🖨 PDF</button>
      </div>
    </div>
  );
}

export default SalesInvoiceDetails;