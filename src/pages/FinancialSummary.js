import { useMemo } from "react";

function FinancialSummary() {

  const today = new Date().toISOString().slice(0, 10);

  const { dailyBalance, totalCredit, overdueCheques } = useMemo(() => {

    const customers =
      JSON.parse(localStorage.getItem("customers")) || [];

    const payments =
      JSON.parse(localStorage.getItem("customerPayments")) || [];

    const cashTransactions =
      JSON.parse(localStorage.getItem("cashTransactions")) || [];

    /* ===== رصيد اليوم من حركات الخزنة ===== */

    const dailyBalance = cashTransactions
      .filter(t => t.date === today)
      .reduce((sum, t) => {

        if (t.type === "in") {
          return sum + Number(t.amount || 0);
        }

        if (t.type === "out") {
          return sum - Number(t.amount || 0);
        }

        return sum;

      }, 0);

    /* ===== إجمالي الكريدت ===== */

    const totalCredit = customers
      .filter(c => Number(c.balance) > 0)
      .reduce((sum, c) => sum + Number(c.balance), 0);

    /* ===== الشيكات المتأخرة ===== */

    const overdueCheques = payments
      .filter(p =>
        p.paymentMethod === "cheque" &&
        p.chequeDate < today &&
        !p.collected
      )
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      dailyBalance,
      totalCredit,
      overdueCheques
    };

  }, [today]);

  return (
    <div className="row g-3">

      <div className="col-md-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h6>رصيد اليوم</h6>
            <h4 className="text-primary">
              {dailyBalance.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h6>إجمالي الكريدت</h6>
            <h4 className="text-danger">
              {totalCredit.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-center shadow-sm">
          <div className="card-body">
            <h6>شيكات متأخرة</h6>
            <h4 className="text-warning">
              {overdueCheques.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>

    </div>
  );
}

export default FinancialSummary;