import { useState } from "react";
import SalesSearch from "./SalesSearch";
import PurchasesSearch from "./PurchasesSearch";
import TransfersSearch from "./TransfersSearch";
import ExpensesSearch from "./ExpensesSearch";

function GlobalSearchPage() {
  const [type, setType] = useState("sales");

  return (
    <div>
      <h2>🔍 شاشة البحث الشامل</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ padding: 8, marginBottom: 20, minWidth: 250 }}
      >
        <option value="sales">بحث المبيعات</option>
        <option value="purchases">بحث المشتريات</option>
        <option value="transfers">بحث التحويلات</option>
        <option value="expenses">بحث المصروفات</option>
      </select>

      <div style={{ border: "1px solid #ccc", padding: 15 }}>
        {type === "sales" && <SalesSearch />}
        {type === "purchases" && <PurchasesSearch />}
        {type === "transfers" && <TransfersSearch />}
        {type === "expenses" && <ExpensesSearch />}
      </div>
    </div>
  );
}

export default GlobalSearchPage;