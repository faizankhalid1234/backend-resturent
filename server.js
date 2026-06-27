import express from "express";
import cors from "cors";
import { PORT, CORS_ORIGINS } from "./config.js";
import { ensureSeedAdmin } from "./services/adminStore.js";
import ordersRouter from "./routes/orders.js";
import catalogRouter from "./routes/catalog.js";
import adminRouter from "./routes/admin.js";

ensureSeedAdmin();

const app = express();

app.use(
  cors({
    origin: CORS_ORIGINS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "2mb" }));

app.use((err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON in request body" });
    return;
  }
  next(err);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "bhandu-khan-api" });
});

app.use("/api/orders", ordersRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/admin", adminRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Bhandu Khan API running at http://localhost:${PORT}`);
});
