import { useState } from "react";
import { useWarehouses } from "../context/WarehouseContext";
import { useStock } from "../context/StockContext";

function WarehouseStockReport() {
  const { warehouses } = useWarehouses();
  const { stocks } = useStock();

  const products =
    JSON.parse(localStorage.getItem("products")) || [];

  const [warehouseId, setWarehouseId] = useState("");

  const getQty = (productId) => {
    return (
      stocks.find(
        (s) =>
          s.productId === productId &&
          s.warehouseId === Number(warehouseId)
      )?.qty || 0
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>تقرير مخزن واحد</h2>

      <select
        value={warehouseId}
        onChange={(e) => setWarehouseId(e.target.value)}
      >
        <option value="">اختر المخزن</option>
        {warehouses.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>

      <hr />

      {!warehouseId && <p>اختر مخزن لعرض الرصيد</p>}

      {warehouseId && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>الصنف</th>
              <th>الرصيد</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const qty = getQty(p.id);
              if (qty === 0) return null;

              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{qty}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WarehouseStockReport;