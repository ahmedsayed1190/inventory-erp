import { useState } from "react";

const ROLES = ["admin", "staff"];
const ACTIONS = ["view", "add", "edit", "delete"];

function Permissions() {
  const [permissions, setPermissions] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("permissions")) || {
        admin: { view: true, add: true, edit: true, delete: true },
        staff: { view: true, add: false, edit: false, delete: false }
      }
    );
  });

  const togglePermission = (role, action) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [action]: !prev[role][action]
      }
    }));
  };

  const savePermissions = () => {
    localStorage.setItem(
      "permissions",
      JSON.stringify(permissions)
    );
    alert("تم حفظ الصلاحيات ✅");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>إدارة الصلاحيات</h2>

      {ROLES.map((role) => (
        <div key={role} style={{ marginBottom: 20 }}>
          <h4>{role.toUpperCase()}</h4>

          {ACTIONS.map((action) => (
            <label key={action} style={{ marginRight: 15 }}>
              <input
                type="checkbox"
                checked={permissions[role][action]}
                onChange={() =>
                  togglePermission(role, action)
                }
              />{" "}
              {action}
            </label>
          ))}
        </div>
      ))}

      <button onClick={savePermissions}>
        حفظ الصلاحيات
      </button>
    </div>
  );
}

export default Permissions;