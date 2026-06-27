import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

export const PORT = Number(process.env.PORT) || 3001;
export const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "";
export const MONGODB_DB = process.env.MONGODB_DB || "ghazi_restaurant";

const envDataDir = process.env.DATA_DIR;
let dataDir;
if (envDataDir) {
  dataDir = envDataDir;
} else {
  const defaultDataDir = path.join(__dirname, "data");
  try {
    fs.mkdirSync(defaultDataDir, { recursive: true });
    fs.accessSync(defaultDataDir, fs.constants.W_OK);
    dataDir = defaultDataDir;
  } catch (err) {
    const tmpDataDir = path.join(os.tmpdir(), "bhandu-khan-data");
    try {
      fs.mkdirSync(tmpDataDir, { recursive: true });
      dataDir = tmpDataDir;
      console.warn(`Data dir not writable; falling back to tmp dir: ${dataDir}`);
    } catch (e) {
      dataDir = defaultDataDir;
    }
  }
}

export const DATA_DIR = dataDir;
export const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
export const ADMIN_USERS_FILE = path.join(DATA_DIR, "admin-users.json");
export const ADMIN_SESSIONS_FILE = path.join(DATA_DIR, "admin-sessions.json");
export const SITE_FILE = path.join(DATA_DIR, "site.json");

export const DEFAULT_ADMIN = {
  email: "admin@bhandukhan.com",
  password: "admin123",
  name: "Admin",
};

const EXTRA_CORS_ORIGINS = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

export const CORS_ORIGINS = [...new Set(EXTRA_CORS_ORIGINS)];
