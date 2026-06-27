import { ORDERS_FILE, DATA_DIR } from "../config.js";
import { readJsonFile, writeJsonFile, ensureDir } from "../utils/fileStore.js";

ensureDir(DATA_DIR);

export function readOrders() {
  return readJsonFile(ORDERS_FILE, []);
}

export function writeOrders(orders) {
  writeJsonFile(ORDERS_FILE, orders);
}

export function addOrder(order) {
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return order;
}

export function replaceOrders(orders) {
  writeOrders(orders);
  return orders;
}

export function updateOrder(id, patch) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const updated = {
    ...orders[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  orders[idx] = updated;
  writeOrders(orders);
  return updated;
}

export function deleteOrder(id) {
  const orders = readOrders().filter((o) => o.id !== id);
  writeOrders(orders);
  return { ok: true, id };
}

export function getOrderById(id) {
  return readOrders().find((o) => o.id === id) || null;
}
