export function addCashTransaction({
  type,
  amount,
  description,
  operationType
}) {

  const cashTransactions =
    JSON.parse(localStorage.getItem("cashTransactions")) || [];

  const newTransaction = {
    id: Date.now(),
    type,
    operationType,
    amount: Number(amount),
    description,
    date: new Date().toISOString().slice(0,10)
  };

  localStorage.setItem(
    "cashTransactions",
    JSON.stringify([...cashTransactions, newTransaction])
  );
}