import fs from "fs";
import path from "path";
import os from "os";

export function ensureDir(dir) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    return true;
  } catch (err) {
    if (err?.code === "EROFS" || err?.code === "EACCES") return false;
    throw err;
  }
}

function fallbackPath(filePath) {
  const fallbackDir = path.join(os.tmpdir(), "bhandu-khan-data");
  return path.join(fallbackDir, path.basename(filePath));
}

export function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      const fb = fallbackPath(filePath);
      if (fs.existsSync(fb)) return JSON.parse(fs.readFileSync(fb, "utf8"));
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    try {
      const fb = fallbackPath(filePath);
      if (fs.existsSync(fb)) return JSON.parse(fs.readFileSync(fb, "utf8"));
    } catch (e) {
      // ignore
    }
    return fallback;
  }
}

export function writeJsonFile(filePath, data) {
  try {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return;
  } catch (err) {
    console.error(`writeJsonFile failed for ${filePath}:`, err?.message || err);
  }

  // Try writing to fallback tmp dir when filesystem is read-only
  try {
    const fb = fallbackPath(filePath);
    ensureDir(path.dirname(fb) || path.dirname(fb));
    fs.mkdirSync(path.dirname(fb), { recursive: true });
    fs.writeFileSync(fb, JSON.stringify(data, null, 2));
    console.info(`Wrote data to fallback path: ${fb}`);
  } catch (err) {
    console.error(`Fallback write failed for ${filePath}:`, err?.message || err);
  }
}
