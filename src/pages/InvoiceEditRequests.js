import { useState, useEffect } from "react";

function InvoiceEditRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(localStorage.getItem("invoiceEditRequests")) || [];
    setRequests(data);
  }, []);

 const approveRequest = (id, invoiceNumber) => {
  // نشيل الطلب من الليست
  const updated = requests.filter((r) => r.id !== id);
  localStorage.setItem(
    "invoiceEditRequests",
    JSON.stringify(updated)
  );
  setRequests(updated);

  // نسمح بتعديل الفاتورة
  const editableInvoices =
    JSON.parse(localStorage.getItem("editableInvoices")) || [];

  if (!editableInvoices.includes(invoiceNumber)) {
    editableInvoices.push(invoiceNumber);
  }

  localStorage.setItem(
    "editableInvoices",
    JSON.stringify(editableInvoices)
  );

  alert("✅ تم قبول الطلب ويمكن تعديل الفاتورة");
};

  const rejectRequest = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    localStorage.setItem(
      "invoiceEditRequests",
      JSON.stringify(updated)
    );
    setRequests(updated);
    alert("❌ تم رفض الطلب");
  };

  return (
    <div className="container">
      <h3 className="mb-3">طلبات تعديل الفواتير</h3>

      {requests.length === 0 && (
        <p>لا يوجد طلبات حالياً</p>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>رقم الفاتورة</th>
            <th>المستخدم</th>
            <th>سبب التعديل</th>
            <th>الإجراء</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r, index) => (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td>{r.invoiceNumber}</td>
              <td>{r.userName}</td>
              <td>{r.reason}</td>
              <td>
                <button
  className="btn btn-success btn-sm me-2"
  onClick={() =>
    approveRequest(r.id, r.invoiceNumber)
  }
>
  موافقة
</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => rejectRequest(r.id)}
                >
                  رفض
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceEditRequests;