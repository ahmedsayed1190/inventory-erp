import { useState } from "react";

function SalesReturn() {
  /* ===== Data ===== */
  const invoices =
    JSON.parse(localStorage.getItem("salesInvoices")) || [];

  const items =
    JSON.parse(localStorage.getItem("items")) || [];

  const customers =
    JSON.parse(localStorage.getItem("customers")) || [];

  /* ===== State ===== */
  const [invoiceIndex, setInvoiceIndex] = useState("");
  const [returnItems, setReturnItems] = useState({});

  const invoice =
    invoiceIndex !== ""
      ? invoices[Number(invoiceIndex)]
      : null;

  /* ===== Change Qty ===== */
  const changeQty = (code, qty) => {
    if (qty < 0) return;

    setReturnItems((prev) => ({
      ...prev,
      [code]: Number(qty)
    }));
  };

  /* ===== Save Return ===== */
  const handleReturn = () => {
    if (!invoice) {
      alert("اختر فاتورة أولاً");
      return;
    }

    let totalReturn = 0;

    /* ===== 1️⃣ تحديث المخزون ===== */
    const updatedItems = items.map((item) => {
      const returnedQty = returnItems[item.code];

      if (!returnedQty) return item;

      const soldItem = invoice.items.find(
        (i) => i.code === item.code
      );

      if (!soldItem) return item;

      const qty = Math.min(
        returnedQty,
        soldItem.qty
      );

      totalReturn += qty * soldItem.price;

      return {
        ...item,
        warehouses: {
          ...item.warehouses,
          [soldItem.warehouse]:
            Number(item.warehouses?.[soldItem.warehouse] || 0) + qty
        }
      };
    });

    localStorage.setItem(
      "items",
      JSON.stringify(updatedItems)
    );

    /* ===== تسجيل حركة المخزون ===== */

let movements =
JSON.parse(localStorage.getItem("stockMovements")) || [];

invoice.items.forEach((it) => {

const returnedQty = Number(returnItems[it.code] || 0);

if (returnedQty > 0) {

movements.push({
date: new Date().toISOString().slice(0,10),
code: it.code,
warehouse: it.warehouse,
type: "sales_return",
description: `مرتجع بيع من العميل ${invoice.customerName}`,
in: returnedQty,
out: 0,
reference: invoice.invoiceId
});

}

});

localStorage.setItem(
"stockMovements",
JSON.stringify(movements)
);

/* =============================== */

    /* ===== 2️⃣ تحديث رصيد العميل ===== */
    const updatedCustomers = customers.map((c) => {
      if (c.code === invoice.customerCode) {
        return {
          ...c,
          balance:
            (Number(c.balance) || 0) - totalReturn
        };
      }
      return c;
    });

    localStorage.setItem(
      "customers",
      JSON.stringify(updatedCustomers)
    );

    /* ===== 3️⃣ حفظ مستند المرتجع ===== */
    const returns =
      JSON.parse(
        localStorage.getItem("salesReturns")
      ) || [];

    returns.push({
      id: Date.now(),
      invoiceId: invoice.invoiceId,
      customerCode: invoice.customerCode,
      items: returnItems,
      total: totalReturn,
      date: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem(
      "salesReturns",
      JSON.stringify(returns)
    );

    alert("تم تنفيذ مرتجع البيع بنجاح ✅");

    setInvoiceIndex("");
    setReturnItems({});
  };

  return (
    <div className="container">
      <h3 className="mb-4">↩️ مرتجع بيع</h3>

      <div className="card mb-4">
        <div className="card-body">
          <select
            className="form-select"
            value={invoiceIndex}
            onChange={(e) =>
              setInvoiceIndex(e.target.value)
            }
          >
            <option value="">
              اختر فاتورة البيع
            </option>
            {invoices.map((inv, i) => (
              <option key={inv.id} value={i}>
                {inv.date} - {inv.customerName} - {inv.total}
              </option>
            ))}
          </select>
        </div>
      </div>

      {invoice && (
        <div className="card">
          <div className="card-body">
            <h5>تفاصيل الفاتورة</h5>

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>الصنف</th>
                  <th>الكمية المباعة</th>
                  <th>مرتجع</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((it) => (
                  <tr key={it.code}>
                    <td>{it.name}</td>
                    <td>{it.qty}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max={it.qty}
                        className="form-control"
                        value={
                          returnItems[it.code] || ""
                        }
                        onChange={(e) =>
                          changeQty(
                            it.code,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="btn btn-danger"
              onClick={handleReturn}
            >
              تنفيذ المرتجع
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesReturn;