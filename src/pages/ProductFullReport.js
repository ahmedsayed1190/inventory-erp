import { useState } from "react";

function ProductFullReport() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const stockEntries = JSON.parse(localStorage.getItem("stockEntries")) || [];
  const stockTransfers = JSON.parse(localStorage.getItem("stockTransfers")) || [];
  const salesInvoices = JSON.parse(localStorage.getItem("salesInvoices")) || [];
  const warehouses = JSON.parse(localStorage.getItem("warehouses")) || [];

  const [productId, setProductId] = useState("");

  const product = products.find(p => String(p.id) === productId);

  const getWarehouseName = (id) =>
    warehouses.find(w => w.id === id)?.name || "-";

  let movements = [];

  // وارد مخزن
  stockEntries.forEach(e => {
    if (String(e.productId) === productId) {
      movements.push({
        type: "وارد",
        qty: e.qty,
        warehouse: getWarehouseName(e.warehouseId),
        date: e.date
      });
    }
  });

  // تحويلات
  stockTransfers.forEach(t => {
    if (String(t.productId) === productId) {
      movements.push({
        type: "تحويل صادر",
        qty: -t.qty,
        warehouse: getWarehouseName(t.fromWarehouseId),
        date: t.date
      });

      movements.push({
        type: "تحويل وارد",
        qty: t.qty,
        warehouse: getWarehouseName(t.toWarehouseId),
        date: t.date
      });
    }
  });

  // مبيعات
  salesInvoices.forEach(inv => {
    inv.items.forEach(item => {
      if (String(item.productId) === productId) {
        movements.push({
          type: "مبيعات",
          qty: -item.qty,
          warehouse: getWarehouseName(item.warehouseId),
          date: inv.date
        });
      }
    });
  });

  return (
    <div style={{ padding: 20 }}>
      <h2>تقرير حركة صنف</h2>

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >
        <option value="">اختر الصنف</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {!product && <p style={{ marginTop: 20 }}>اختر صنف لعرض التقرير</p>}

      {product && (
        <>
          <h3 style={{ marginTop: 20 }}>
            الصنف: {product.name}
          </h3>

          <table border="1" cellPadding="6" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>النوع</th>
                <th>المخزن</th>
                <th>الكمية</th>
              </tr>
            </thead>
            <tbody>
              {movements.length === 0 && (
                <tr>
                  <td colSpan="4">لا توجد حركة</td>
                </tr>
              )}

              {movements.map((m, i) => (
                <tr key={i}>
                  <td>{m.date}</td>
                  <td>{m.type}</td>
                  <td>{m.warehouse}</td>
                  <td>{m.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default ProductFullReport;