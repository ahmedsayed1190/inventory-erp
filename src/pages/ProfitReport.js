import { useState, useMemo } from "react";

function ProfitReport() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { totalSales, totalCost, profit, hasInvoices } =
    useMemo(() => {
      const items =
        JSON.parse(localStorage.getItem("items")) || [];

      const invoices =
        JSON.parse(localStorage.getItem("salesInvoices")) || [];

      const returns =
        JSON.parse(localStorage.getItem("salesReturns")) || [];

      let sales = 0;
      let cost = 0;

      /* ===== حساب المبيعات ===== */
      invoices.forEach((inv) => {
        const invDate = new Date(inv.date);

        if (
          (fromDate && invDate < new Date(fromDate)) ||
          (toDate && invDate > new Date(toDate))
        )
          return;

        inv.items.forEach((it) => {
          const item = items.find(
            (i) => i.code === it.code
          );

          const costPrice =
            Number(item?.costPrice || 0);

          sales += Number(it.qty) * Number(it.price);
          cost += Number(it.qty) * costPrice;
        });
      });

      /* ===== طرح المرتجعات ===== */
      returns.forEach((ret) => {
        const retDate = new Date(ret.date);

        if (
          (fromDate && retDate < new Date(fromDate)) ||
          (toDate && retDate > new Date(toDate))
        )
          return;

        sales -= Number(ret.total || 0);
      });

      return {
        totalSales: sales,
        totalCost: cost,
        profit: sales - cost,
        hasInvoices: invoices.length > 0,
      };
    }, [fromDate, toDate]);

  return (
    <div className="container">
      <h3 className="mb-4">📊 تقرير الأرباح</h3>

      {/* ===== فلترة بالتاريخ ===== */}
      <div className="card mb-4">
        <div className="card-body row g-2">
          <div className="col-md-3">
            <label>من تاريخ</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
            />
          </div>

          <div className="col-md-3">
            <label>إلى تاريخ</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* ===== الكروت ===== */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>إجمالي المبيعات</h6>
              <h4 className="text-primary">
                {totalSales.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>إجمالي التكلفة</h6>
              <h4 className="text-danger">
                {totalCost.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>صافي الربح</h6>
              <h4
                className={
                  profit >= 0
                    ? "text-success"
                    : "text-danger"
                }
              >
                {profit.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {!hasInvoices && (
        <div className="alert alert-warning mt-4">
          لا توجد فواتير بيع حتى الآن
        </div>
      )}
    </div>
  );
}

export default ProfitReport;