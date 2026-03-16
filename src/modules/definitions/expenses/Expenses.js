import { useState } from "react";

function ExpensesDefinitions() {

  const [definitions, setDefinitions] = useState(() => {
    const saved = localStorage.getItem("expenseDefinitions");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");

  /* ===== إضافة ===== */

  const addDefinition = () => {

    if (!name.trim()) {
      alert("اكتب اسم المصروف");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: name.trim()
    };

    const updated = [...definitions, newItem];

    setDefinitions(updated);
    localStorage.setItem(
      "expenseDefinitions",
      JSON.stringify(updated)
    );

    setName("");
  };

  /* ===== حذف ===== */

  const deleteDefinition = (id) => {

    if (!window.confirm("حذف التعريف؟")) return;

    const updated = definitions.filter(d => d.id !== id);

    setDefinitions(updated);

    localStorage.setItem(
      "expenseDefinitions",
      JSON.stringify(updated)
    );
  };

  return (

    <div className="container">

      <h3 className="mb-4">💰 تعريف المصروفات</h3>

      {/* ===== إضافة ===== */}

      <div className="card mb-4">
        <div className="card-body">

          <div className="row g-3">

            <div className="col-md-4">

              <input
                className="form-control"
                placeholder="اسم المصروف"
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />

            </div>

            <div className="col-md-2 d-grid">

              <button
                className="btn btn-primary"
                onClick={addDefinition}
              >
                إضافة
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* ===== الجدول ===== */}

      <div className="card">
        <div className="card-body">

          <table className="table table-bordered table-striped">

            <thead className="table-dark">

              <tr>
                <th>#</th>
                <th>اسم المصروف</th>
                <th>إجراءات</th>
              </tr>

            </thead>

            <tbody>

              {definitions.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    لا توجد تعريفات
                  </td>
                </tr>
              )}

              {definitions.map((d,i)=>(
                <tr key={d.id}>

                  <td>{i+1}</td>

                  <td>{d.name}</td>

                  <td>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={()=>deleteDefinition(d.id)}
                    >
                      🗑 حذف
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default ExpensesDefinitions;