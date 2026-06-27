import { Router } from "express";
import { DEFAULT_ADMIN } from "../config.js";
import {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  getSessionUser,
  ensureSeedAdmin,
} from "../services/adminStore.js";

const router = Router();

function getToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

router.get("/health", (_req, res) => {
  ensureSeedAdmin();
  res.json({ ok: true });
});

router.get("/me", (req, res) => {
  const user = getSessionUser(getToken(req));
  if (!user) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  res.json({ user });
});

router.post("/signup", (req, res) => {
  try {
    const result = signupAdmin(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", (req, res) => {
  try {
    const result = loginAdmin(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.post("/logout", (req, res) => {
  logoutAdmin(getToken(req));
  res.json({ ok: true });
});

router.get("/defaults", (_req, res) => {
  res.json({
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
  });
});

export default router;
