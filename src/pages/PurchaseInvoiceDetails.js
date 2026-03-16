import { useParams } from "react-router-dom";

function PurchaseInvoiceDetails() {
  const { index } = useParams();

  const invoices =
    JSON.parse(localStorage.getItem("purchaseInvoices")) || [];

  const suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [];

  const products =
    JSON.parse(localStorage.getItem("products")) || [];

  const invoice = invoices[index];

  if (!invoice) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          الفاتورة غير موجودة
        </div>
      </div>
    );
  }

  const supplierName =
    suppliers.find((s) => s.id === invoice.supplierId)
      ?.name || "-";

  const getProductName = (id) =>
    products.find((p) => p.id === Number(id))
      ?.name || "-";

  return (
    <div className="container">
      {/* ===== Print Button ===== */}
      <div className="d-print-none mb-3">
        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          🖨️ طباعة الفاتورة
        </button>
      </div>

      {/* ===== Invoice ===== */}
      <div className="card">
        <div className="card-body">

          <h3 className="text-center mb-4">
            فاتورة شراء
          </h3>

          <div className="mb-3">
            <strong>المورد:</strong> {supplierName}
          </div>

          <div className="mb-3">
            <strong>التاريخ:</strong> {invoice.date}
          </div>

          <table className="table table-bordered">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>الصنف</th>
                <th>الكمية</th>
                <th>سعر التكلفة</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(invoice.items).map(
                ([productId, qty], i) => {
                  if (Number(qty) === 0) return null;

                  const cost =
                    Number(invoice.costs?.[productId]) ||
                    0;

                  return (
                    <tr key={productId}>
                      <td>{i + 1}</td>
                      <td>
                        {getProductName(productId)}
                      </td>
                      <td>{qty}</td>
                      <td>{cost}</td>
                      <td>{cost * qty}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}

export default PurchaseInvoiceDetails;