import { useState } from "react";

function Search() {
  const [keyword, setKeyword] = useState("");

  const items =
    JSON.parse(localStorage.getItem("items")) || [];

  const customers =
    JSON.parse(localStorage.getItem("customers")) || [];

  const suppliers =
    JSON.parse(localStorage.getItem("suppliers")) || [];

  const search = (list, fields) => {
    return list.filter((obj) =>
      fields.some((f) =>
        String(obj[f] || "")
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )
    );
  };

  const filteredItems = search(items, ["code", "name"]);
  const filteredCustomers = search(customers, ["name", "phone"]);
  const filteredSuppliers = search(suppliers, ["name", "phone"]);

  return (
    <div className="container">
      <h3 className="mb-4">🔍 البحث</h3>

      {/* ===== Search Box ===== */}
      <div className="card mb-4">
        <div className="card-body">
          <input
            className="form-control"
            placeholder="اكتب كلمة البحث (اسم – كود – تليفون)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      {!keyword && (
        <p className="text-muted">
          اكتب كلمة للبحث في الأصناف أو العملاء أو الموردين
        </p>
      )}

      {keyword && (
        <>
          {/* ===== Items ===== */}
          <div className="card mb-4">
            <div className="card-body">
              <h5>📦 الأصناف</h5>

              {filteredItems.length === 0 && (
                <p>لا توجد نتائج</p>
              )}

              {filteredItems.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>الكود</th>
                      <th>الاسم</th>
                      <th>الكمية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((i) => (
                      <tr key={i.id}>
                        <td>{i.code}</td>
                        <td>{i.name}</td>
                        <td>{i.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ===== Customers ===== */}
          <div className="card mb-4">
            <div className="card-body">
              <h5>👤 العملاء</h5>

              {filteredCustomers.length === 0 && (
                <p>لا توجد نتائج</p>
              )}

              {filteredCustomers.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>التليفون</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ===== Suppliers ===== */}
          <div className="card mb-4">
            <div className="card-body">
              <h5>🏭 الموردين</h5>

              {filteredSuppliers.length === 0 && (
                <p>لا توجد نتائج</p>
              )}

              {filteredSuppliers.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>التليفون</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Search;