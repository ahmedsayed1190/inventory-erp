import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

function ItemsList() {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");

  /* ===== تجهيز البيانات ===== */
  const { rows, totalItems } = useMemo(() => {
    const items =
      JSON.parse(localStorage.getItem("items")) || [];
      const warehouses =
JSON.parse(localStorage.getItem("warehouses")) || [];

    let result = [];

    items.forEach((item) => {
      if (!item.warehouses) {
      
        const openingQty =
Object.values(item.openingQty || {})[0] || 0;

result.push({
  code: item.code,
  name: item.name,
  warehouse: "-",
  openingQty: Number(openingQty),
  qty: Number(item.qty || 0),
          costPrice: item.costPrice,
          salePrice: item.salePrice,
          createdDate: item.createdDate,
          id: item.id,
        });
      } else {
        
        Object.entries(item.warehouses).forEach(
([warehouseId, qty]) => {

const warehouseName =
warehouses.find(w =>
String(w.id) === String(warehouseId)
)?.name || warehouseId;
        
const openingQty =
Number(item.openingQty?.[warehouseId] ?? 0);

result.push({
  code: item.code,
  name: item.name,
  warehouse: warehouseName,
  openingQty: openingQty,
  qty: Number(qty),
  costPrice: item.costPrice,
  salePrice: item.salePrice,
  createdDate: item.createdDate,
  id: item.id,
});
          }
        );
      }
    });

    /* ===== بحث ===== */
    if (search) {
      result = result.filter(
        (r) =>
          r.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          r.code
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    return {
      rows: result,
      totalItems: result.length,
    };
  }, [search]);

  /* ===== حذف ===== */
  const deleteItem = (id) => {
    if (!window.confirm(t("items.confirmDelete")))
      return;

    const items =
      JSON.parse(localStorage.getItem("items")) || [];

    const updated = items.filter(
      (item) => item.id !== id
    );

    localStorage.setItem(
      "items",
      JSON.stringify(updated)
    );

    window.location.reload(); // لتحديث العرض
  };

  return (
    <div className="container">
      <h3 className="mb-3">
        📦 {t("items.listTitle")}
      </h3>

      {/* ===== بحث ===== */}
      <div className="mb-3 col-md-4">
        <input
          className="form-control"
          placeholder="بحث بالاسم أو الكود"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* ===== جدول ===== */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
  <tr>
    <th>{t("items.code")}</th>
    <th>{t("items.name")}</th>
    <th>المخزن</th>
    <th>رصيد أول المدة</th>
    <th>{t("items.qty")}</th>
            <th>{t("items.cost")}</th>
            <th>{t("items.sale")}</th>
            <th>{t("items.createdDate")}</th>
            <th>{t("items.delete")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">

                {t("items.noData")}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i}>
                <td>{row.code}</td>
                <td>{row.name}</td>
                <td>{row.warehouse}</td>
<td>{row.openingQty}</td>

<td
  className={
    row.qty === 0
      ? "text-danger fw-bold"
      : ""
  }
>
  {row.qty}
</td>
                <td>{row.costPrice}</td>
                <td>{row.salePrice}</td>
                <td>{row.createdDate}</td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteItem(row.id)
                    }
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-2 text-muted">
        إجمالي الصفوف: {totalItems}
      </div>
    </div>
  );
}

export default ItemsList;