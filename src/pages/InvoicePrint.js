import { useParams } from "react-router-dom";
import { useState } from "react";
import "../assets/css/invoice-print.css";

function InvoicePrint() {
  const { invoiceId } = useParams();

  /* ================= ZOOM ================= */
  const DEFAULT_ZOOM = 0.55;
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  /* ================= PAGE NAVIGATION ================= */
  const [currentPage, setCurrentPage] = useState(0);

  /* ================= LOAD INVOICE ================= */
  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  const invoice = invoices.find(
    (i) => String(i.invoiceId) === String(invoiceId)
  );

  if (!invoice) return <div>Invoice not found</div>;

  /* ================= MULTI PAGE LOGIC ================= */
  const ITEMS_PER_PAGE = 15;

  const pages = [];
  for (let i = 0; i < invoice.items.length; i += ITEMS_PER_PAGE) {
    pages.push(invoice.items.slice(i, i + ITEMS_PER_PAGE));
  }

  const totalPages = pages.length;

  return (
    <>
      {/* ================= PAGE CONTROLS ================= */}
      <div className="page-controls">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀
        </button>

        <span>
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          ▶
        </button>
      </div>

      {/* ================= ZOOM CONTROLS ================= */}
      <div className="zoom-controls">
        <button onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>
          ＋
        </button>

        <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}>
          －
        </button>

        <button onClick={() => setZoom(DEFAULT_ZOOM)}>
          {Math.round(zoom * 100)}%
        </button>
      </div>

      {/* ================= PRINT WRAPPER ================= */}
      <div
        className="print-wrapper"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="print-page">

          {/* ================= HEADER ================= */}
          <table className="header-table">
            <tbody>
              <tr>
                <td className="logo-box">
                  <img
                    src="/kd-logo.png"
                    alt="KD logo"
                    className="logo-img"
                  />
                </td>

                <td className="title-box">
                  <div className="title-ar">فاتورة مبيعات</div>
                  <div className="title-en">Sales Invoice</div>
                </td>

                <td className="company-box">
                  <div className="company-name">KD TOOLS</div>
                  <div>Sharjah Industrial Area 6</div>
                  <div>+971 58 985 2434</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ================= INFO (أول صفحة فقط) ================= */}
          {currentPage === 0 && (
            <table className="info-table">
              <tbody>
                <tr>
                  <th>Invoice Time</th>
                  <td>{invoice.time}</td>
                  <th>Branch</th>
                  <td>Main</td>
                </tr>

                <tr>
                  <th>Customer</th>
                  <td>{invoice.customerName}</td>
                  <th>Customer No</th>
                  <td>{invoice.customerCode || "-"}</td>
                </tr>

                <tr>
                  <th>Sales Man</th>
                  <td>{invoice.createdBy}</td>
                  <th>Invoice No</th>
                  <td>{invoice.invoiceId}</td>
                </tr>

                <tr>
                  <th>Payment</th>
                  <td>{invoice.paymentMethod}</td>
                  <th>Invoice Date</th>
                  <td>{invoice.date}</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ================= ITEMS ================= */}
          <table className="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ITEM NO</th>
                <th>DESCRIPTION</th>
                <th>UNIT</th>
                <th>QTY</th>
                <th>UNIT PRICE</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {pages[currentPage].map((it, i) => (
                <tr key={i}>
                  <td>{currentPage * ITEMS_PER_PAGE + i + 1}</td>
                  <td>{it.code}</td>
                  <td className="desc">{it.name}</td>
                  <td>pcs</td>
                  <td>{it.qty}</td>
                  <td>{Number(it.price).toFixed(2)}</td>
                  <td>{(it.qty * it.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= TOTALS (آخر صفحة فقط) ================= */}
          {currentPage === totalPages - 1 && (
            <table className="totals-table">
              <tbody>
                <tr>
                  <th>SUB TOTAL</th>
                  <td>{Number(invoice.subTotal).toFixed(2)}</td>
                </tr>
                <tr>
                  <th>VAT (5%)</th>
                  <td>0.00</td>
                </tr>
                <tr>
                  <th>DISCOUNT</th>
                  <td>{Number(invoice.discount).toFixed(2)}</td>
                </tr>
                <tr className="grand">
                  <th>TOTAL</th>
                  <td>{Number(invoice.total).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}

        </div>
      </div>
    </>
  );
}

export default InvoicePrint;