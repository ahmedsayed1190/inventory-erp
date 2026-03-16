import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

/* ===== Modules & Actions ===== */
const MODULES = [
  "items",
  "warehouses",
  "suppliers",
  "customers",
  "expenses",
  "revenues"
];

const ACTIONS = ["view", "add", "edit", "delete"];

function PermissionsPage() {
  const { user } = useAuth();

  /* ===== State (ALWAYS on top) ===== */
  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem("permissions");
    return saved ? JSON.parse(saved) : {};
  });

  /* ===== Save Automatically ===== */
  useEffect(() => {
    localStorage.setItem("permissions", JSON.stringify(permissions));
  }, [permissions]);

  /* ===== Guard (AFTER hooks) ===== */
  if (!user || !user.isAdmin) {
    return (
      <div className="alert alert-danger">
        🚫 هذه الصفحة متاحة للأدمن فقط
      </div>
    );
  }

  /* ===== Toggle Permission ===== */
  const togglePermission = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev?.[module]?.[action]
      }
    }));
  };

  return (
    <div className="container">
      <h3 className="mb-4">🔐 إدارة الصلاحيات</h3>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>القسم</th>
            {ACTIONS.map((action) => (
              <th key={action}>{action.toUpperCase()}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {MODULES.map((module) => (
            <tr key={module}>
              <td style={{ fontWeight: "bold" }}>{module}</td>

              {ACTIONS.map((action) => (
                <td key={action}>
                  <input
                    type="checkbox"
                    checked={permissions?.[module]?.[action] || false}
                    onChange={() =>
                      togglePermission(module, action)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <small className="text-muted">
        ⚠️ التغييرات تُحفظ تلقائيًا
      </small>
    </div>
  );
}

export default PermissionsPage;