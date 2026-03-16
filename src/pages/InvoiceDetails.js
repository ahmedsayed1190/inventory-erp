import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "../assets/css/invoice-print.css";

function InvoicePrint() {
  const { invoiceId } = useParams();

  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  const invoice = invoices.find(
    (i) => String(i.invoiceId) === String(invoiceId)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!invoice) {
    return <div style={{ padding: 20 }}>Invoice not found</div>;
  }

  return (
    <div className="print-page">
      {/* ===== HEADER ===== */}
      <div className="print-header">
        <div className="logo">
          KD TOOLS
        </div>

        <div className="invoice-title-box">
          <div className="arabic">فاتورة مبيعات</div>
          <div className="english">SALES INVOICE</div>
        </div>

        <div className="company-info">
          <div>Sharjah Industrial Area 6</div>
          <div>United Arab Emirates</div>
          <div>Tel: +971 58 985 2434</div>
        </div>
      </div>

      {/* ===== INFO ===== */}
      <div className="info-grid">
        <div><strong>Invoice No:</strong> {invoice.invoiceId}</div>
        <div><strong>Date:</strong> {invoice.date}</div>

        <div><strong>Customer:</strong> {invoice.customerName}</div>
        <div><strong>Payment:</strong> {invoice.paymentMethod}</div>
      </div>

      {/* ===== TABLE ===== */}
      <table className="print-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td style={{ textAlign: "left" }}>{item.name}</td>
              <td>{item.qty}</td>
              <td>PCS</td>
              <td>{Number(item.price).toFixed(2)}</td>
              <td>{(item.qty * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== TOTALS ===== */}
      <div className="totals-grid">
        <div>Sub Total</div>
        <div>{Number(invoice.subTotal).toFixed(2)}</div>

        <div>Discount</div>
        <div>{Number(invoice.discount || 0).toFixed(2)}</div>

        <div>Total</div>
        <div>{Number(invoice.total).toFixed(2)}</div>

        <div>Paid</div>
        <div>{Number(invoice.paidAmount || 0).toFixed(2)}</div>

        <div>Balance</div>
        <div>{Number(invoice.remainingAmount || 0).toFixed(2)}</div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="footer">
        <div>
          Receiver Signature
          <div style={{ marginTop: 30 }}>______________________</div>
        </div>

        <div>
          Authorized Signature
          <div style={{ marginTop: 30 }}>______________________</div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePrint;