import { useState } from "react";
import { useWarehouses } from "../../../context/WarehouseContext";
import usePermission from "../../../hooks/usePermission";

function Warehouses() {

  /* ===== Permissions ===== */
  const {
    canView,
    canAdd,
    canDelete
  } = usePermission("warehouses");

  /* ===== Context ===== */
  const { warehouses, setWarehouses } = useWarehouses();

  /* ===== State ===== */
  const [name, setName] = useState("");

  /* ===== Guard ===== */
  if (!canView) {
    return (
      <div className="alert alert-danger">
        🚫 ليس لديك صلاحية عرض المخازن
      </div>
    );
  }

  /* ===== Add Warehouse ===== */
  const handleAdd = () => {

    if (!name.trim()) {
      alert("من فضلك أدخل اسم المخزن");
      return;
    }

    const exists = warehouses.some(
      w => w.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("اسم المخزن موجود بالفعل ❌");
      return;
    }

    const newWarehouse = {
      id: String(Date.now()),
      name: name.trim(),
      isActive: true,
      createdDate: new Date().toISOString().slice(0, 10)
    };

    setWarehouses([...warehouses, newWarehouse]);

    setName("");
  };

  /* ===== Delete Warehouse ===== */
  const handleDelete = (id) => {

    if (!window.confirm("حذف المخزن؟")) return;

    const items = JSON.parse(localStorage.getItem("items")) || [];

    /* منع حذف المخزن لو فيه كميات */
    const hasStock = items.some(item =>
      item.warehouses &&
      item.warehouses[String(id)] &&
      Number(item.warehouses[id]) > 0
    );

    if (hasStock) {
      alert("لا يمكن حذف مخزن يحتوي على كميات ❌");
      return;
    }

    setWarehouses(
      warehouses.filter(w => w.id !== id)
    );
  };

  return (
    <div className="container">

      <h3 className="mb-4">🏬 تعريف المخازن</h3>

      {/* ===== Add Warehouse ===== */}
      {canAdd && (
        <div className="card mb-4">
          <div className="card-body">

            <div className="row g-3 align-items-center">

              <div className="col-md-8">
                <input
                  className="form-control"
                  placeholder="اسم المخزن"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-md-4 d-grid">
                <button
                  className="btn btn-success"
                  onClick={handleAdd}
                >
                  إضافة مخزن
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ===== Warehouses Table ===== */}
      <div className="card">
        <div className="card-body">

          <table className="table table-bordered table-striped">

            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>اسم المخزن</th>
                <th>تاريخ الإنشاء</th>
                <th>إجراءات</th>
              </tr>
            </thead>

            <tbody>

              {warehouses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    لا توجد مخازن
                  </td>
                </tr>
              )}

              {warehouses.map((w, index) => (
                <tr key={w.id}>

                  <td>{index + 1}</td>

                  <td>{w.name}</td>

                  <td>{w.createdDate}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(w.id)}
                      disabled={!canDelete}
                    >
                      🗑 حذف
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          <small className="text-muted">
            🔐 الأزرار تتحكم فيها الصلاحيات
          </small>

        </div>
      </div>

    </div>
  );
}

export default Warehouses;