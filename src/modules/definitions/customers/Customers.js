import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePermission from "../../../hooks/usePermission";

function Customers() {
  const { t } = useTranslation();
  const { canView, canAdd } = usePermission("customers");
  const navigate = useNavigate();
  const location = useLocation();

  /* ===== State ===== */
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentIndex, setCurrentIndex] = useState(-1);

  const [customerNumber, setCustomerNumber] = useState("");
  const [name, setName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
const [openingBalanceDate, setOpeningBalanceDate] = useState(
  new Date().toISOString().split("T")[0]
);  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  /* ===== Auto Number ===== */
  const getNextCustomerNumber = useCallback(() => {
    if (!customers.length) return 1;
    return Math.max(...customers.map(c => c.customerNumber || 0)) + 1;
  }, [customers]);

  /* ===== Helpers ===== */
  const resetForm = useCallback(() => {
    setCurrentIndex(-1);
    setCustomerNumber(getNextCustomerNumber());
    setName("");
    setOpeningBalance("");
    setOpeningBalanceDate(new Date().toISOString().split("T")[0]);
    setPhone("");
    setAddress("");
  }, [getNextCustomerNumber]);

  /* ===== Load Customer ===== */
  const loadCustomer = useCallback(
    (index) => {
      const c = customers[index];
      if (!c) return;

      setCurrentIndex(index);
      setCustomerNumber(c.customerNumber);
      setName(c.name);
      setOpeningBalance(c.openingBalance || 0);
      setOpeningBalanceDate(c.openingBalanceDate || "");
      setPhone(c.phone || "");
      setAddress(c.address || "");
    },
    [customers]
  );

  /* ===== Init / Edit from List ===== */
  useEffect(() => {
    if (location.state?.id && customers.length) {
      const index = customers.findIndex(c => c.id === location.state.id);
      if (index !== -1) loadCustomer(index);
    } else {
      setCustomerNumber(getNextCustomerNumber());
    }
  }, [location.state, customers, loadCustomer, getNextCustomerNumber]);

  /* ===== Guard ===== */
  if (!canView) {
return (
  <div className="alert alert-danger">
    🚫 {t("common.noPermission")}
  </div>
);  }

  /* ===== Navigation ===== */
  const first = () => customers.length && loadCustomer(0);
  const last = () => customers.length && loadCustomer(customers.length - 1);
  const next = () =>
    currentIndex < customers.length - 1 &&
    loadCustomer(currentIndex + 1);
  const prev = () =>
    currentIndex > 0 &&
    loadCustomer(currentIndex - 1);

  /* ===== Save ===== */
  const saveCustomer = () => {
    if (!name) {
      alert(t("definitions.customers.enterName"));
      return;
    }

    const customerData = {
      id: currentIndex === -1 ? Date.now() : customers[currentIndex].id,
      customerNumber,
      name,
      phone,
      address,
openingBalance: Number(openingBalance) || 0,
openingBalanceDate,
balance: Number(openingBalance) || 0
    };

    const updated = [...customers];

    if (currentIndex === -1) updated.push(customerData);
    else updated[currentIndex] = customerData;

    setCustomers(updated);
    localStorage.setItem("customers", JSON.stringify(updated));
    resetForm();
  };

  /* ===== Delete ===== */
  const deleteCustomer = () => {
    if (currentIndex === -1) return;
    if (!window.confirm(t("definitions.customers.confirmDelete"))) return;

    const updated = customers.filter((_, i) => i !== currentIndex);
    setCustomers(updated);
    localStorage.setItem("customers", JSON.stringify(updated));
    resetForm();
  };

  return (
    <div className="container">
      <h3 className="mb-3">👤 {t("definitions.customers.title")}</h3>

      {/* ===== Actions ===== */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button className="btn btn-outline-secondary btn-sm" onClick={first}>⏮</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={prev}>◀️</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={next}>▶️</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={last}>⏭</button>

        {canAdd && (
          <button className="btn btn-success btn-sm" onClick={saveCustomer}>
           💾 {t("definitions.customers.save")}
          </button>
        )}

        <button
          className="btn btn-danger btn-sm"
          onClick={deleteCustomer}
          disabled={currentIndex === -1}
        >
          🗑 {t("definitions.customers.delete")}
        </button>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate("/lists/customers")}
        >
         📋 {t("definitions.customers.list")}
        </button>
      </div>

      {/* ===== Form ===== */}
      <div className="card">
        <div className="card-body">

         <div className="row g-3">

  {/* الصف الأول */}
  <div className="col-md-3">
    <label>{t("definitions.customers.number")}</label>
    <input className="form-control" value={customerNumber} disabled />
  </div>

  <div className="col-md-5">
    <label>{t("definitions.customers.name")}</label>
    <input
  className="form-control"
  autoComplete="new-password"
  name="customer-name-field"
  value={name}
  onChange={e => setName(e.target.value)}
/>
  </div>

  <div className="col-md-4">
    <label>Opening Balance Date</label>
    <input
      type="date"
      className="form-control"
      value={openingBalanceDate}
      onChange={e => setOpeningBalanceDate(e.target.value)}
    />
  </div>

  {/* الصف الثاني */}
  <div className="col-md-4">
    <label>{t("definitions.customers.openingBalance")}</label>
    <input
      type="number"
      className="form-control"
      value={openingBalance}
      onChange={e => setOpeningBalance(e.target.value)}
    />
  </div>

  <div className="col-md-4">
    <label>{t("definitions.customers.phone")}</label>
    <input
      className="form-control"
      value={phone}
      onChange={e => setPhone(e.target.value)}
    />
  </div>

  <div className="col-md-4">
    <label>{t("definitions.customers.address")}</label>
    <input
      className="form-control"
      value={address}
      onChange={e => setAddress(e.target.value)}
    />
  </div>

</div>
        
        </div>
      </div>
    </div>
  );
}

export default Customers;