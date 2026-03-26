import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "../assets/css/invoice.css";
const getWarehouseQty = (item, warehouse) => {
  if (item.warehouses && item.warehouses[warehouse] != null) {
    return Number(item.warehouses[warehouse]);
  }
  return Number(item.qty || 0); // دعم قديم
};
function Invoice() {
  const printInvoice = (invoiceId) => {
  const printWindow = window.open(
    `/invoice/${invoiceId}`,
    "_blank",
    "width=900,height=650"
  );

  if (!printWindow) return;

  const closeAfterPrint = () => {
    printWindow.close();
  };

  printWindow.onafterprint = closeAfterPrint;
};
  const { user } = useAuth();
  const { id } = useParams();
  const { t } = useTranslation();
const companyLogo = localStorage.getItem("companyLogo");
const companyName = localStorage.getItem("companyName");
const companyAddress = localStorage.getItem("companyAddress");
const companyPhone = localStorage.getItem("companyPhone");
const [darkMode, setDarkMode] = useState(false);
const [draftInvoice, setDraftInvoice] = useState(null);

  /* ================== DATA ================== */
  const [customers, setCustomers] = useState(
  JSON.parse(localStorage.getItem("customers")) || []
);

const [items, setItems] = useState(
  JSON.parse(localStorage.getItem("items")) || []
);

const warehouses = useMemo(() => {
  return JSON.parse(localStorage.getItem("warehouses")) || [];
}, []);
  const [invoices, setInvoices] = useState(
    JSON.parse(localStorage.getItem("salesInvoices")) || []
  );

  /* ================== INVOICE NUMBER ================== */
  const nextInvoiceNumber =
  invoices.length > 0
    ? Math.max(
        ...invoices.map((i) => Number(i.invoiceId)).filter((n) => !isNaN(n))
      ) + 1
    : 1;

  /* ================== STATES ================== */
  const customerRef = useRef(null);
const itemRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const displayedInvoiceNumber =
  currentIndex === -1 || !invoices[currentIndex]
    ? nextInvoiceNumber
    : invoices[currentIndex].invoiceId;
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
const [invoiceDate, setInvoiceDate] = useState(
  new Date().toISOString().slice(0, 10)
);

const [invoiceTime, setInvoiceTime] = useState(
  new Date().toTimeString().slice(0, 5)
);
const deleteItem = (index) => {
  setInvoiceItems(prev =>
    prev.filter((_, i) => i !== index)
  );
};

  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [itemSearch, setItemSearch] = useState("");
  const filteredDropdownItems = items.filter((item) => {
  if (!itemSearch.trim()) return true;

  const words = itemSearch.toLowerCase().split(" ");
const name = (item.name || "").toLowerCase();
const code = (item.code || "").toLowerCase();

  return words.every(
    (word) => name.includes(word) || code.includes(word)
  );
});
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [availableQty, setAvailableQty] = useState(0);
  /* ===== Invoice Search ===== */
const [showSearchModal, setShowSearchModal] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [filteredModalItems, setFilteredModalItems] = useState([]);
  
  const [showItemList, setShowItemList] = useState(false);

const [paymentMethod, setPaymentMethod] = useState("cash");
const [discount, setDiscount] = useState(0);      // الخصم
const [paidAmount, setPaidAmount] = useState(0);  // الدفعة
const [remainingAmount, setRemainingAmount] = useState(0);

const [chequeAmount, setChequeAmount] = useState(0);
const [chequeDate, setChequeDate] = useState("");

const [netTotal, setNetTotal] = useState(0);
// ===== رصيد العميل =====
const oldRemaining =
  currentIndex !== -1
    ? invoices[currentIndex]?.remainingAmount || 0
    : 0;

const customerBalance = selectedCustomer?.balance || 0;

const finalCustomerBalance =
  customerBalance - oldRemaining + remainingAmount;
  /* ================== EFFECTS ================== */
  /* ===== تحميل الفاتورة من الرابط ===== */

/* ===== تحميل الفاتورة غير المكتملة ===== */

useEffect(() => {

const drafts =
JSON.parse(localStorage.getItem("draftInvoices")) || [];

const draft = drafts.find(d => d.id === "currentDraft");

if (draft) {
setDraftInvoice(draft);
}

}, []);
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (customerRef.current && !customerRef.current.contains(e.target)) {
      setShowCustomerList(false);
    }

    if (itemRef.current && !itemRef.current.contains(e.target)) {
      setShowItemList(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  useEffect(() => {
  const subTotal = invoiceItems.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  const finalTotal = subTotal - Number(discount || 0);
  const net = finalTotal >= 0 ? finalTotal : 0;

  setTotal(subTotal);   // قبل الخصم
  setNetTotal(net);     // بعد الخصم
}, [invoiceItems, discount]);
useEffect(() => {
  // نقدي
  if (paymentMethod === "cash") {
    setPaidAmount(netTotal);
    setRemainingAmount(0);
  }

  // آجل
  if (paymentMethod === "credit") {
  const rem = netTotal - Number(paidAmount || 0);
  setRemainingAmount(rem > 0 ? rem : 0);
}
  // شيك
  if (paymentMethod === "cheque") {
    setPaidAmount(0);
    setRemainingAmount(netTotal - Number(chequeAmount || 0));
  }
}, [netTotal, paymentMethod, paidAmount, chequeAmount]);
useEffect(() => {
  if (!searchTerm.trim()) {
    setFilteredModalItems(items);
    return;
  }

  const words = searchTerm.toLowerCase().split(" ");

  const results = items.filter(item => {
  const name = (item.name || "").toLowerCase();
  const code = (item.code || "").toLowerCase();

    return words.every(word =>
      name.includes(word) || code.includes(word)
    );
  });

  setFilteredModalItems(results);
}, [searchTerm, items]);
useEffect(() => {

  if (!selectedItem || !selectedWarehouse) return;

  const qtyInWarehouse = getWarehouseQty(selectedItem, selectedWarehouse);

  setAvailableQty(qtyInWarehouse);

}, [selectedWarehouse, selectedItem]);
/* ===== حفظ الفاتورة غير المكتملة (Draft) ===== */

useEffect(() => {

const draft = {
customerSearch,
selectedCustomer,
selectedWarehouse,
invoiceItems,
date: invoiceDate,
time: invoiceTime
};

if (
customerSearch ||
invoiceItems.length > 0 ||
selectedWarehouse
) {

let drafts =
JSON.parse(localStorage.getItem("draftInvoices")) || [];

drafts = drafts.filter(d => d.id !== "currentDraft");

drafts.push({
id: "currentDraft",
...draft
});

localStorage.setItem(
"draftInvoices",
JSON.stringify(drafts)
);

}

}, [
customerSearch,
selectedCustomer,
selectedWarehouse,
invoiceItems,
invoiceDate,
invoiceTime
]);
  /* ================== NAVIGATION ================== */
  const goFirst = () => invoices.length && loadInvoice(0);
  const goLast = () =>
    invoices.length && loadInvoice(invoices.length - 1);
 const goPrev = () => {
  // لو فاتورة جديدة → روح لآخر فاتورة
  if (currentIndex === -1 && invoices.length > 0) {
    loadInvoice(invoices.length - 1);
    return;
  }

  if (currentIndex > 0) {
    loadInvoice(currentIndex - 1);
  }
};
  const goNext = () => {
  if (!invoices.length) return;

  // لو على آخر فاتورة محفوظة → افتح فاتورة جديدة
  if (currentIndex === invoices.length - 1) {
    resetInvoice(); // فاتورة جديدة
    return;
  }

  // لو داخل الفواتير
  if (currentIndex >= 0 && currentIndex < invoices.length - 1) {
    loadInvoice(currentIndex + 1);
  }
};
 const loadInvoice = useCallback((index) => {
  const inv = invoices[index];
  if (!inv) return;

  const customer = customers.find(c => c.code === inv.customerCode);

  setCurrentIndex(index);
  setCustomerSearch(inv.customerName);
  setSelectedCustomer(customer || null);
  setSelectedWarehouse(inv.warehouse);
  setInvoiceItems(inv.items);

}, [invoices, customers]);

/* ===== تحميل الفاتورة من الرابط ===== */
useEffect(() => {
  if (!id) return;

  const index = invoices.findIndex(
    (inv) => String(inv.invoiceId) === String(id)
  );

  if (index !== -1) {
    loadInvoice(index);
  }
}, [id, invoices, loadInvoice]);

  /* ================== RESET ================== */
 const resetInvoice = () => {
  setCurrentIndex(-1);
  setCustomerSearch("");
  setSelectedCustomer(null);
  setSelectedWarehouse("");
  setInvoiceItems([]);
  setItemSearch("");
  setSelectedItem(null);
  setQty("");
  setPrice("");
  setAvailableQty(0);

  setDiscount(0);
  setPaidAmount(0);
  setRemainingAmount(0);
  setChequeAmount(0);
  setChequeDate("");
  setPaymentMethod("cash");

  // ✅ إعادة تاريخ ووقت الفاتورة
  setInvoiceDate(new Date().toISOString().slice(0, 10));
  setInvoiceTime(new Date().toTimeString().slice(0, 5));
};

  /* ================== SELECT ITEM ================== */
 const selectItem = (item) => {

  if (!selectedWarehouse) {
    alert("⚠ اختر المخزن أولاً");
    return;
  }

  setSelectedItem(item);
  setItemSearch(item.name);
  setPrice(item.salePrice || 0);
  setUnit(item.unit || "pcs");

  const qtyInWarehouse = getWarehouseQty(item, selectedWarehouse);
  setAvailableQty(qtyInWarehouse);

  setShowItemList(false);
};
  /* ================== ADD ITEM ================== */
 const addItem = () => {
  if (!selectedItem || !qty || !price) return;
  if (Number(qty) > availableQty)
    return alert(t("invoice.qtyExceeded"));

  const existingIndex = invoiceItems.findIndex(
    (i) =>
      i.code === selectedItem.code &&
      i.warehouse === selectedWarehouse
  );

  if (existingIndex !== -1) {
    const updated = [...invoiceItems];

    const newQty =
  updated[existingIndex].qty + Number(qty);

if (newQty > availableQty)
  return alert(t("invoice.qtyExceeded"));

updated[existingIndex] = {
  ...updated[existingIndex],
  qty: newQty,
};

    setInvoiceItems(updated);
  } else {
    setInvoiceItems([
      ...invoiceItems,
      {
        code: selectedItem.code,
        name: selectedItem.name,
        unit: unit,
        qty: Number(qty),
        price: Number(price),
        warehouse: selectedWarehouse,
      },
    ]);
  }

  setItemSearch("");
  setQty("");
  setPrice("");
  setAvailableQty(0);
  setSelectedItem(null);
};

/* ================== SAVE ================== */
const saveInvoice = () => {

  if (!selectedCustomer || !selectedWarehouse || !invoiceItems.length)
    return alert(t("invoice.completeData"));

  // 🔥 هنا تحط كود رجوع المخزون القديم
  if (currentIndex !== -1) {
    // ✅ رجوع الكاش القديم لو الفاتورة كانت كاش
const oldInvoice = invoices[currentIndex];

if (oldInvoice.paymentMethod === "cash") {
  const bankCash =
    JSON.parse(localStorage.getItem("bankCash")) || [];

  if (bankCash.length) {
    bankCash[0].balance =
      Number(bankCash[0].balance || 0) -
      Number(oldInvoice.total);

    localStorage.setItem("bankCash", JSON.stringify(bankCash));
  }
}

    const restoredItems = items.map(item => {
      const oldSoldItems = oldInvoice.items.filter(
        invItem =>
          invItem.code === item.code &&
          invItem.warehouse === oldInvoice.warehouse
      );


      if (!oldSoldItems.length) return item;

      const restoredQty = oldSoldItems.reduce(
        (sum, invItem) => sum + Number(invItem.qty),
        0
      );

      if (item.warehouses && item.warehouses[oldInvoice.warehouse] != null) {
        return {
          ...item,
          warehouses: {
            ...item.warehouses,
            [oldInvoice.warehouse]:
              Number(item.warehouses[oldInvoice.warehouse]) + restoredQty
          }
        };
      }

      return item;
    });

    setItems(restoredItems);
    localStorage.setItem("items", JSON.stringify(restoredItems));
  }
  
/* ===== تسجيل حركة خزنة لو الدفع نقدي ===== */

if (paymentMethod === "cash") {

  const bankCash =
    JSON.parse(localStorage.getItem("bankCash")) || [];

  if (bankCash.length) {

    const updatedCash = [...bankCash];

    updatedCash[0].balance =
      Number(updatedCash[0].balance || 0) +
      Number(netTotal);

    localStorage.setItem(
      "bankCash",
      JSON.stringify(updatedCash)
    );
  }

  const cashTransactions =
    JSON.parse(localStorage.getItem("cashTransactions")) || [];

  cashTransactions.push({
  id: Date.now(),
  type: "in",
  operationType: "sales",
  customerName: selectedCustomer.name,
  invoiceNumber:
    currentIndex !== -1
      ? invoices[currentIndex].invoiceId
      : nextInvoiceNumber,
  amount: Number(netTotal),
  description: "فاتورة رقم " +
    (currentIndex !== -1
      ? invoices[currentIndex].invoiceId
      : nextInvoiceNumber),
  date: new Date().toISOString().split("T")[0],
});

  localStorage.setItem(
    "cashTransactions",
    JSON.stringify(cashTransactions)
  );

}

// بعد رجوع المخزون القديم (لو تعديل)
try {

  let sourceItems = items;

  if (currentIndex !== -1) {
    sourceItems = JSON.parse(localStorage.getItem("items")) || [];
  }

  const updatedItems = sourceItems.map((item) => {

    const soldItems = invoiceItems.filter(
      (invItem) =>
        invItem.code === item.code &&
        invItem.warehouse === selectedWarehouse
    );

    if (!soldItems.length) return item;

    const soldQty = soldItems.reduce(
      (sum, invItem) => sum + Number(invItem.qty),
      0
    );

    if (item.warehouses && item.warehouses[selectedWarehouse] != null) {
      const currentQty = Number(item.warehouses[selectedWarehouse]);
      const newQty = currentQty - soldQty;

      if (newQty < 0) {
        alert(`❌ لا يمكن إتمام العملية
الصنف: ${item.name}
المتاح: ${currentQty}
المطلوب: ${soldQty}`);
        throw new Error("Stock cannot be negative");
      }

      return {
        ...item,
        warehouses: {
          ...item.warehouses,
          [selectedWarehouse]: newQty
        }
      };
    }

    return item;
  });

  setItems(updatedItems);
  localStorage.setItem("items", JSON.stringify(updatedItems));



  // إنشاء الفاتورة بعد نجاح الخصم
  const newInvoice = {
    customerBalanceBefore: customerBalance,
    customerBalanceAfter: finalCustomerBalance,
    paymentMethod,
    subTotal: total,
    discount: Number(discount),
    total: netTotal,
    paidAmount,
    remainingAmount,
    id: Date.now(),
    invoiceId:
  currentIndex !== -1
    ? invoices[currentIndex].invoiceId
    : nextInvoiceNumber,
customerName: selectedCustomer.name,
customerCode: selectedCustomer.customerNumber,
    warehouse: selectedWarehouse,
    items: invoiceItems,
    date: invoiceDate,
    time: invoiceTime,
    createdBy: user?.username || "admin",
  };

 let updatedInvoices;

if (currentIndex !== -1) {
  // ✏ تعديل فاتورة قديمة
  updatedInvoices = invoices.map((inv, index) =>
    index === currentIndex ? newInvoice : inv
  );
} else {
  // ➕ إضافة فاتورة جديدة
  updatedInvoices = [...invoices, newInvoice];
}

localStorage.setItem("salesInvoices", JSON.stringify(updatedInvoices));
setInvoices(updatedInvoices);

/* ===== تسجيل حركة المخزون ===== */

let movements =
JSON.parse(localStorage.getItem("stockMovements")) || [];

invoiceItems.forEach((it) => {

movements.push({
date: invoiceDate,
code: it.code,
warehouse: selectedWarehouse,
type: "sale",
description: `بيع للعميل ${selectedCustomer.name}`,
party: selectedCustomer.name,
in: 0,
out: Number(it.qty),
reference: newInvoice.invoiceId
});

});

localStorage.setItem(
"stockMovements",
JSON.stringify(movements)
);

/* =============================== */

/* ===== تحديث رصيد العميل ===== */

let updatedCustomers = customers;

/* لو تعديل فاتورة */
if (currentIndex !== -1) {
  const oldInvoice = invoices[currentIndex];

  // رجوع الرصيد القديم لو كان آجل
  if (oldInvoice.paymentMethod !== "cash") {
    updatedCustomers = customers.map(c => {
      if (c.code === oldInvoice.customerCode) {
        return {
          ...c,
          balance:
            (Number(c.balance) || 0) -
            Number(oldInvoice.remainingAmount || 0)
        };
      }
      return c;
    });
  }
}

/* إضافة الرصيد الجديد */
if (paymentMethod !== "cash") {
  updatedCustomers = updatedCustomers.map(c => {
    if (c.code === selectedCustomer.code) {
      return {
        ...c,
        balance:
          (Number(c.balance) || 0) +
          Number(remainingAmount)
      };
    }
    return c;
  });
}

setCustomers(updatedCustomers);
localStorage.setItem("customers", JSON.stringify(updatedCustomers));

/* ===== حذف المسودة بعد حفظ الفاتورة ===== */

let drafts =
JSON.parse(localStorage.getItem("draftInvoices")) || [];

drafts = drafts.filter(d => d.id !== "currentDraft");

localStorage.setItem(
"draftInvoices",
JSON.stringify(drafts)
);
setDraftInvoice(null);

resetInvoice();

} catch (error) {
  console.error("Save Invoice Error:", error);
  alert("حدث خطأ أثناء حفظ الفاتورة");
}

};  // 👈 هنا تقفل saveInvoice صح
 /* ================== DELETE ================== */
const deleteInvoice = () => {
  if (currentIndex === -1 || !invoices[currentIndex]) return;
  if (!window.confirm(t("invoice.confirmDelete"))) return;

  const invoiceToDelete = invoices[currentIndex];

  /* ===== 1️⃣ رجوع المخزون ===== */
  const restoredItems = items.map(item => {
    const soldItems = invoiceToDelete.items.filter(
      invItem =>
        invItem.code === item.code &&
        invItem.warehouse === invoiceToDelete.warehouse
    );

    if (!soldItems.length) return item;

    const restoredQty = soldItems.reduce(
      (sum, invItem) => sum + Number(invItem.qty),
      0
    );

    if (item.warehouses && item.warehouses[invoiceToDelete.warehouse] != null) {
      return {
        ...item,
        warehouses: {
          ...item.warehouses,
          [invoiceToDelete.warehouse]:
            Number(item.warehouses[invoiceToDelete.warehouse]) + restoredQty
        }
      };
    }

    return item;
  });

  setItems(restoredItems);
  localStorage.setItem("items", JSON.stringify(restoredItems));

/* ===== تحديث رصيد العميل ===== */

let updatedCustomers = customers;

/* لو تعديل فاتورة */
if (currentIndex !== -1) {
  const oldInvoice = invoices[currentIndex];

  // رجوع الرصيد القديم لو كان آجل
  if (oldInvoice.paymentMethod !== "cash") {
    updatedCustomers = customers.map(c => {
      if (c.code === oldInvoice.customerCode) {
        return {
          ...c,
          balance:
            (Number(c.balance) || 0) -
            Number(oldInvoice.remainingAmount || 0)
        };
      }
      return c;
    });
  }
}

/* إضافة الرصيد الجديد */
if (paymentMethod !== "cash") {
  updatedCustomers = updatedCustomers.map(c => {
    if (c.code === selectedCustomer.code) {
      return {
        ...c,
        balance:
          (Number(c.balance) || 0) +
          Number(remainingAmount)
      };
    }
    return c;
  });
}

setCustomers(updatedCustomers);
localStorage.setItem("customers", JSON.stringify(updatedCustomers));

  setCustomers(updatedCustomers);
  localStorage.setItem("customers", JSON.stringify(updatedCustomers));

  /* ===== 3️⃣ حذف الفاتورة ===== */
  const updatedInvoices = invoices.filter((_, i) => i !== currentIndex);

  setInvoices(updatedInvoices);
  localStorage.setItem("salesInvoices", JSON.stringify(updatedInvoices));

   resetInvoice();
   };
const deleteDraftInvoice = () => {

let drafts =
JSON.parse(localStorage.getItem("draftInvoices")) || [];

drafts = drafts.filter(d => d.id !== "currentDraft");

localStorage.setItem(
"draftInvoices",
JSON.stringify(drafts)
);

setDraftInvoice(null);

};
   const loadDraftInvoice = () => {

if (!draftInvoice) return;

setCustomerSearch(draftInvoice.customerSearch || "");
setSelectedCustomer(draftInvoice.selectedCustomer || null);
setSelectedWarehouse(draftInvoice.selectedWarehouse || "");
setInvoiceItems(draftInvoice.invoiceItems || []);

setInvoiceDate(draftInvoice.date || invoiceDate);
setInvoiceTime(draftInvoice.time || invoiceTime);

setDraftInvoice(null);

};

  /* ================== RENDER ================== */
return (
  <>
  <div className={`container invoice-page ${darkMode ? "dark-mode" : ""}`}>
  
{draftInvoice && (

<div
style={{
background:"#fef3c7",
padding:"10px",
borderRadius:"6px",
marginBottom:"10px",
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<span>⚠ لديك فاتورة غير محفوظة</span>

<div style={{display:"flex",gap:"10px"}}>

<button
className="btn btn-warning btn-sm"
onClick={loadDraftInvoice}
>
استكمال
</button>

<button
className="btn btn-danger btn-sm"
onClick={deleteDraftInvoice}
>
حذف
</button>

</div>

</div>

)}
        {/* ===== Invoice Header ===== */}

<div className="invoice-header">
  {companyLogo && (
    <img
      src={companyLogo}
      alt="Company Logo"
      style={{ height: 70, marginBottom: 8 }}
    />
  )}

  <h5 style={{ margin: 0 }}>{companyName}</h5>

  <div style={{ fontSize: 13, color: "#555" }}>
    <div>{companyAddress}</div>
    <div>{companyPhone}</div>
  </div>
</div>

  <h4 className="invoice-title">
  {t("invoice.title")} #{displayedInvoiceNumber}
</h4>
<div className="erp-form-grid mb-3">

  <div className="form-row">
    <label>{t("invoice.date")}</label>
    <input
      type="date"
      className="erp-input small"
      value={invoiceDate}
      onChange={(e) => setInvoiceDate(e.target.value)}
    />
  </div>

  <div className="form-row">
    <label>{t("invoice.time")}</label>
    <input
      type="time"
      className="erp-input small"
      value={invoiceTime}
      onChange={(e) => setInvoiceTime(e.target.value)}
    />
  </div>

</div>
  {/* Navigation Buttons */}
  <div className="invoice-actions">
    <button
  className="btn btn-outline-dark btn-sm"
  onClick={() => setShowSearchModal(true)}
>
  🔎 بحث صنف
</button>
    <button
      className="btn btn-outline-secondary btn-sm nav-btn"
      onClick={goFirst}
      disabled={invoices.length === 0}
      title={t("nav.first")}
    >
      ⏮
    </button>

    <button
      className="btn btn-outline-secondary btn-sm nav-btn"
      onClick={goPrev}
      disabled={invoices.length === 0}
     title={t("nav.prev")}

    >
      ◀{t("nav.prev")}
    </button>

    <button
      className="btn btn-outline-secondary btn-sm nav-btn"
      onClick={goNext}
      disabled={invoices.length === 0 && currentIndex === -1}
      title={t("nav.next")}
    >
      ▶ {t("nav.next")}
    </button>

    <button
      className="btn btn-outline-secondary btn-sm nav-btn"
      onClick={goLast}
      disabled={invoices.length === 0}
      title={t("nav.last")}
    >
      ⏭
    </button>
  </div>

{/* Actions */}
<div className="d-flex flex-wrap gap-2">
  <button
    className="btn btn-dark"
    disabled={currentIndex === -1}
    onClick={() => printInvoice(displayedInvoiceNumber)}
  >
    🖨 طباعة / PDF
  </button>

  {/* 👁 زر Preview */}
  <button
    className="btn btn-secondary"
    disabled={currentIndex === -1}
    onClick={() =>
      window.open(`/invoice/${displayedInvoiceNumber}`, "_blank")
    }
  >
    👁 Preview
  </button>

  <button className="btn btn-success" onClick={resetInvoice}>
    ➕{t("invoice.new")}
  </button>

  <button className="btn btn-primary" onClick={saveInvoice}>
    💾{t("invoice.save")}
  </button>

  <button className="btn btn-danger" onClick={deleteInvoice}>
    🗑 {t("invoice.delete")}
  </button>
</div>
<div className="d-flex justify-content-end mb-2">
  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
</div>

{/* ===== CUSTOMER ===== */}
{/* ===== ERP FORM GRID (Customer / Payment / Warehouse) ===== */}
<div className="invoice-section">
  <h6 className="mb-2">👤 {t("invoice.customerData")}</h6>

  <div className="erp-form-grid">

    {/* اسم العميل */}
    <div className="form-row">
      <label>{t("invoice.customerName")}</label>
      <div ref={customerRef} className="erp-select-wrapper">
        <input
          className="erp-input"
          value={selectedCustomer ? selectedCustomer.name : customerSearch}
          onChange={(e) => {
            setCustomerSearch(e.target.value);
            setSelectedCustomer(null);
            setShowCustomerList(true);
          }}
        />
        {showCustomerList && (
          <div className="erp-dropdown">
            {customers.map(c => (
              <div
                key={c.code}
                className="erp-dropdown-item"
                onClick={() => {
                  setSelectedCustomer(c);
                  setCustomerSearch(c.name);
                  setShowCustomerList(false);
                }}
              >
                {c.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* رصيد العميل */}
    <div className="form-row">
      <label>{t("invoice.customerBalance")}</label>
      <input
        className="erp-input readonly"
        value={selectedCustomer?.balance ?? 0}
        readOnly
      />
    </div>

    {/* طريقة الدفع */}
    <div className="form-row">
      <label>{t("invoice.paymentMethod")}</label>
      <select
        className="erp-input"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="cash">{t("payment.cash")}</option>
        <option value="credit">{t("payment.credit")}</option>
        <option value="cheque">{t("payment.cheque")}</option>
      </select>
    </div>

    {/* المخزن */}
    <div className="form-row">
      <label>{t("invoice.warehouse")}</label>
     <select
  className="erp-input"
  value={selectedWarehouse}
  onChange={(e) => {

    if (invoiceItems.length > 0) {
      alert("⚠ لا يمكن تغيير المخزن بعد إضافة أصناف");
      return;
    }

    setSelectedWarehouse(e.target.value);
  }}
>
        <option value="">{t("invoice.selectWarehouse")}</option>
        {warehouses.map(w => (
<option key={w.id} value={w.id}>{w.name}</option>
))}
      </select>
    </div>

  </div>
</div>
<div className="mb-2">
  {t("invoice.paymentMethod")}:
  <strong>
    {paymentMethod === "cash" && ` ${t("payment.cash")}`}
    {paymentMethod === "credit" && ` ${t("payment.credit")}`}
    {paymentMethod === "cheque" && ` ${t("payment.cheque")}`}
  </strong>
</div>
<div className="invoice-section">
  <h6>📦 {t("invoice.addItem")}</h6>

  <div className="erp-form-grid">

    <div className="form-row">
      <label>{t("invoice.itemName")}</label>
      <div ref={itemRef} className="erp-select-wrapper">
    <input
  className="erp-input"
  disabled={!selectedWarehouse}
  placeholder={!selectedWarehouse ? "اختر المخزن أولاً" : "ابحث عن صنف"}
  value={selectedItem ? selectedItem.name : itemSearch}
  onChange={(e) => {
    setItemSearch(e.target.value);
    setSelectedItem(null);
    setShowItemList(true);
  }}
/>
        {showItemList && filteredDropdownItems.length > 0 && (
          <div className="erp-dropdown">
           {filteredDropdownItems.map((i) => (
  <div
    key={i.code}
    className="erp-dropdown-item"
    onClick={() => selectItem(i)}
    style={{ display: "flex", justifyContent: "space-between" }}
  >
    <span>{i.name}</span>
   <span style={{ color: "#16a34a", fontSize: 12 }}>
  المتاح: {getWarehouseQty(i, selectedWarehouse)}
</span>
  </div>
))}
          </div>
        )}
      </div>
    </div>
<div className="form-row">
  <label>الكمية المتاحة</label>
  <input
    type="number"
    className="erp-input readonly"
    value={availableQty}
    readOnly
  />
</div>
    <div className="form-row">
      <label>{t("invoice.qty")}</label>
    <input
  type="number"
  className="erp-input"
  value={qty}
  disabled={availableQty === 0}
  onChange={(e) => setQty(e.target.value)}
/>
    </div>

    <div className="form-row">
      <label>{t("invoice.price")}</label>
      <input
        type="number"
        className="erp-input"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>
<div className="form-row">
  <label>الوحدة</label>
  <input
    type="text"
    className="erp-input"
    value={unit}
    onChange={(e) => setUnit(e.target.value)}
  />
</div>
  </div>

<button
  className="btn btn-success mt-2"
  onClick={addItem}
  disabled={
    !selectedItem ||
    !qty ||
    Number(qty) <= 0 ||
    Number(qty) > availableQty
  }
>    ➕ {t("invoice.add")}
  </button>
</div>
{/* ===== Payment Details ===== */}
<div className="invoice-section">
  <h6>💳 {t("invoice.paymentDetails")}</h6>

  <div className="erp-form-grid">

    {/* الخصم */}
    <div className="form-row">
      <label>{t("invoice.discount")}</label>
      <input
        type="number"
        className="erp-input small discount-input"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
      />
    </div>

    {/* الدفعة – آجل */}
    {paymentMethod === "credit" && (
      <div className="form-row">
        <label>{t("invoice.paid")}</label>
        <input
          type="number"
          className="erp-input small"
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
        />
      </div>
    )}

    {/* الشيك */}
    {paymentMethod === "cheque" && (
      <>
        <div className="form-row">
          <label>{t("invoice.chequeAmount")}</label>
          <input
            type="number"
            className="erp-input small"
            value={chequeAmount}
            onChange={(e) => setChequeAmount(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>{t("invoice.chequeDate")}</label>
          <input
            type="date"
            className="erp-input small"
            value={chequeDate}
            onChange={(e) => setChequeDate(e.target.value)}
          />
        </div>
      </>
    )}

  </div>
</div>
      <table className="table table-bordered invoice-table">
    <thead>
  <tr>
    <th>#</th>
    <th>كود</th>              {/* 👈 جديد */}
    <th>{t("invoice.item")}</th>
    <th>الوحدة</th>           {/* 👈 جديد */}
    <th>{t("invoice.warehouse")}</th>
    <th>{t("invoice.qty")}</th>
    <th>{t("invoice.price")}</th>
    <th>{t("invoice.total")}</th>
    <th>{t("invoice.delete")}</th>
  </tr>
</thead>
       <tbody>
  {invoiceItems.map((i, idx) => (
    <tr key={idx}>
      <td>{idx + 1}</td>
      <td>{i.code}</td>        {/* 👈 كود الصنف */}
<td>{i.name}</td>
<td>{i.unit}</td>        {/* 👈 الوحدة */}
<td>
{warehouses.find(w => String(w.id) === String(i.warehouse))?.name || i.warehouse}
</td>
<td className={i.qty === 0 ? "text-danger fw-bold" : ""}>
{i.qty}
</td>
<td>{i.price}</td>
<td>{i.qty * i.price}</td>

      {/* زر حذف الصنف */}
      <td>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => deleteItem(idx)}
          title={t("invoice.deleteItem")}
        >
          ❌
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
{/* ===== ملخص الحساب ===== */}
      <div className="invoice-summary-grid mt-3">
  <div>
    <span>الإجمالي قبل الخصم</span>
    <strong>{total}</strong>
  </div>

  <div>
    <span>الخصم</span>
    <strong>{discount}</strong>
  </div>

  <div>
    <span>الإجمالي بعد الخصم</span>
    <strong>{netTotal}</strong>
  </div>

  <div>
    <span>المدفوع</span>
    <strong>{paidAmount}</strong>
  </div>

  <div className="danger">
    <span>المتبقي</span>
    <strong>{remainingAmount}</strong>
  </div>

  <div className="primary">
    <span>الرصيد النهائي للعميل</span>
    <strong>{finalCustomerBalance}</strong>
  </div>
  
  </div>

      {/* ===== Search Modal ===== */}
      {showSearchModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">

              <h5 className="mb-3">🔎 بحث الأصناف</h5>

              <input
                autoFocus
                className="form-control mb-3"
                placeholder="اكتب أي جزء من الاسم أو الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div style={{ maxHeight: 350, overflowY: "auto" }}>
                {filteredModalItems.length === 0 && (
                  <div className="text-muted text-center p-3">
                    لا يوجد نتائج
                  </div>
                )}

                {filteredModalItems.map(item => (
                  <div
                    key={item.code}
                    className="p-2 border-bottom"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      selectItem(item);
                      setShowSearchModal(false);
                      setSearchTerm("");
                    }}
                  >
                    <strong>{item.code}</strong> — {item.name}
                  </div>
                ))}
              </div>

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowSearchModal(false);
                    setSearchTerm("");
                  }}
                >
                  إغلاق
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  </>
  );
}

export default Invoice;