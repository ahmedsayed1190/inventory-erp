import { useState, useEffect } from "react";

function Treasuries() {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [treasuries, setTreasuries] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("treasuries")) || [];
    setTreasuries(data);
  }, []);

  const saveTreasury = () => {
    if (!name || balance === "") {
      alert("من فضلك ادخل اسم الخزينة والرصيد");
      return;
    }

    const newTreasury = {
      id: Date.now(),
      name,
      balance: Number(balance)
    };

    const updated = [...treasuries, newTreasury];
    setTreasuries(updated);
    localStorage.setItem(
      "treasuries",
      JSON.stringify(updated)
    );

    setName("");
    setBalance("");
  };

  return (
    <div className="container">
      <h3>تعريف الخزينة</h3>

      <div style={{ maxWidth: 400 }}>
        <input
          className="form-control mb-2"
          placeholder="اسم الخزينة"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="الرصيد الافتتاحي"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={saveTreasury}
        >
          حفظ الخزينة
        </button>
      </div>

      <hr />

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>اسم الخزينة</th>
            <th>الرصيد</th>
          </tr>
        </thead>
        <tbody>
          {treasuries.map((t, i) => (
            <tr key={t.id}>
              <td>{i + 1}</td>
              <td>{t.name}</td>
              <td>{t.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Treasuries;