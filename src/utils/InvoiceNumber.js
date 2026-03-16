export function getNextInvoiceNumber() {
  const key = "last_sales_invoice_number";

  const last = Number(localStorage.getItem(key)) || 0;
  const next = last + 1;

  localStorage.setItem(key, next);

  return next;
}