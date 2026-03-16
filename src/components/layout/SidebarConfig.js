import { useState } from "react";

function PermissionsPage() {
  const [permissions, setPermissions] = useState({
    items: { view: true, add: true, edit: true, delete: true },
    warehouses: { view: true, add: true, edit: true, delete: true },
    suppliers: { view: true, add: true, edit: true, delete: true },
    customers: { view: true, add: true, edit: true, delete: true },
  });

  const toggle = (module, action) => {
    setPermissions({
      ...permissions,
      [module]: {
        ...permissions[module],
        [action]: !permissions[module][action],
      },
    });
  };

  return (
    <div className="container">
      <h3 className="mb-4">🔐 إدارة الصلاحيات</h3>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>القسم</th>
            <th>عرض</th>
            <th>إضافة</th>
            <th>تعديل</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(permissions).map((module) => (
            <tr key={module}>
              <td>{module}</td>
              {["view", "add", "edit", "delete"].map((action) => (
                <td key={action} style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={permissions[module][action]}
                    onChange={() => toggle(module, action)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PermissionsPage;