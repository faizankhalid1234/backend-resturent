import { Router } from "express";
import {
  readCatalog,
  updateCategories,
  updateMenuItems,
} from "../services/catalogStore.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(readCatalog());
});

router.put("/categories", (req, res) => {
  const categories = Array.isArray(req.body) ? req.body : [];
  res.json(updateCategories(categories));
});

router.put("/items", (req, res) => {
  const menuItems = Array.isArray(req.body) ? req.body : [];
  res.json(updateMenuItems(menuItems));
});

export default router;
