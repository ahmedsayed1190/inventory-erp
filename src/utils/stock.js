export const getItemBalance = (code, warehouseId = null) => {

  const movements =
    JSON.parse(localStorage.getItem("stockMovements")) || [];

  return movements.reduce((sum, m) => {

    if (String(m.code) !== String(code)) return sum;

    if (warehouseId && String(m.warehouse) !== String(warehouseId)) return sum;

    return sum + (Number(m.in || 0) - Number(m.out || 0));

  }, 0);

};