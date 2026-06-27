import { Router } from "express";
import {
  readOrders,
  addOrder,
  replaceOrders,
  updateOrder,
  deleteOrder,
  getOrderById,
} from "../services/ordersStore.js";

const router = Router();

function normalizePhone(phone = "") {
  return String(phone).replace(/\D/g, "");
}

router.get("/", (req, res) => {
  let orders = readOrders();
  const phone = req.query.phone?.trim();
  if (phone) {
    const target = normalizePhone(phone);
    orders = orders.filter((o) => normalizePhone(o.customer?.phone) === target);
  }
  res.json(orders);
});

router.get("/:id", (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

router.put("/", (req, res) => {
  const orders = Array.isArray(req.body) ? req.body : [];
  replaceOrders(orders);
  res.json(orders);
});

router.post("/", (req, res) => {
  const order = req.body;
  if (!order?.id) {
    res.status(400).json({ error: "Invalid order" });
    return;
  }
  addOrder(order);
  res.status(201).json(order);
});

router.patch("/:id", (req, res) => {
  const updated = updateOrder(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: "Order not found" });
    return;
  }

  const messages = {
    rejected: "Order rejected successfully",
    approved: "Order approved successfully",
    processing: "Order is now processing",
    paid: "Payment recorded successfully",
    pending: "Order set to pending",
  };

  res.json({
    success: true,
    status: updated.status,
    message: messages[updated.status] || "Order updated successfully",
    order: updated,
  });
});

router.delete("/:id", (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: "Order not found" });
    return;
  }
  deleteOrder(req.params.id);
  res.json({
    success: true,
    message: "Order deleted successfully",
    id: req.params.id,
  });
});

export default router;
