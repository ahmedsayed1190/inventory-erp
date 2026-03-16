// ===============================
// Edit Requests Helper
// ===============================

const STORAGE_KEY = "invoiceEditRequests";

// جلب كل الطلبات
export const getEditRequests = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
};

// إضافة طلب تعديل جديد
export const createEditRequest = ({
  invoiceId,
  invoiceNumber,
  requestedBy,
  changes
}) => {
  const requests = getEditRequests();

  const newRequest = {
    id: Date.now(),
    invoiceId,
    invoiceNumber,
    requestedBy,
    changes, // تفاصيل التعديل
    status: "pending", // pending | approved | rejected
    requestDate: new Date().toLocaleString(),
    reviewedBy: null,
    reviewedDate: null,
    adminNote: ""
  };

  requests.push(newRequest);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return newRequest;
};

// موافقة الأدمن
export const approveEditRequest = (
  requestId,
  adminName
) => {
  const requests = getEditRequests();

  const updated = requests.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: "approved",
          reviewedBy: adminName,
          reviewedDate: new Date().toLocaleString()
        }
      : r
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// رفض الأدمن
export const rejectEditRequest = (
  requestId,
  adminName,
  note = ""
) => {
  const requests = getEditRequests();

  const updated = requests.map((r) =>
    r.id === requestId
      ? {
          ...r,
          status: "rejected",
          reviewedBy: adminName,
          reviewedDate: new Date().toLocaleString(),
          adminNote: note
        }
      : r
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};