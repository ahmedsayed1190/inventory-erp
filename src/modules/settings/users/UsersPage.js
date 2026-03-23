  import { useState, useEffect } from "react";
  import { useAuth } from "../../../context/AuthContext";

  const MODULES = [
    "items",
    "warehouses",
    "suppliers",
    "customers",
    "expenses",
    "revenues"
  ];

  const ACTIONS = ["view", "add", "edit", "delete"];

  function UsersPage() {
    const { user } = useAuth();

    /* ===== States (بدون شروط) ===== */
    const [users, setUsers] = useState(() => {
      const saved = localStorage.getItem("users");
      return saved ? JSON.parse(saved) : [];
    });

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [permissions, setPermissions] = useState(() => {
      const obj = {};
      MODULES.forEach((m) => {
        obj[m] = { view: false, add: false, edit: false, delete: false };
      });
      return obj;
    });

    /* ===== Save Users ===== */
    useEffect(() => {
      localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    /* ===== Guard AFTER hooks ===== */
    // ⏳ استنى لحد ما user يتحمل
if (!user) {
  return <div>Loading...</div>;
}

// ❌ لو مش admin
if (!user) {
  return <div>Loading...</div>;
}

if (user.isAdmin !== true) {
  return (
    <div className="alert alert-danger">
      🚫 هذه الصفحة متاحة للأدمن فقط
    </div>
  );
}

    /* ===== Handlers ===== */
    const togglePermission = (module, action) => {
      setPermissions((prev) => ({
        ...prev,
        [module]: {
          ...prev[module],
          [action]: !prev[module][action]
        }
      }));
    };

    const addUser = () => {
      if (!username || !password) {
        alert("من فضلك أدخل اسم المستخدم وكلمة المرور");
        return;
      }

      const exists = users.find((u) => u.username === username);
      if (exists) {
        alert("اسم المستخدم موجود بالفعل");
        return;
      }

      const newUser = {
        id: Date.now(),
        username,
        password,
        permissions
      };

      setUsers([...users, newUser]);

      // reset
      setUsername("");
      setPassword("");
    };

    return (
      <div className="container">
        <h3 className="mb-4">👥 إدارة المستخدمين</h3>

        {/* ===== Add User ===== */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">

              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="col-md-4 d-grid">
                <button className="btn btn-success" onClick={addUser}>
                  إضافة مستخدم
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ===== Permissions Table ===== */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">🔐 الصلاحيات</h5>

            <table className="table table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>القسم</th>
                  {ACTIONS.map((a) => (
                    <th key={a}>{a.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {MODULES.map((module) => (
                  <tr key={module}>
                    <td>{module}</td>
                    {ACTIONS.map((action) => (
                      <td key={action}>
                        <input
                          type="checkbox"
                          checked={permissions[module][action]}
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
          </div>
        </div>

        {/* ===== Users List ===== */}
        <div className="card">
          <div className="card-body">
            <h5>📋 المستخدمون</h5>

            {users.length === 0 && (
              <p className="text-muted">لا يوجد مستخدمين</p>
            )}

            {users.map((u) => (
              <div key={u.id}>
                👤 {u.username}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  export default UsersPage;