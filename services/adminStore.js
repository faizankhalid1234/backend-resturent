import { createHash, randomBytes, randomUUID } from "crypto";
import { ADMIN_USERS_FILE, ADMIN_SESSIONS_FILE, DEFAULT_ADMIN, DATA_DIR } from "../config.js";
import { readJsonFile, writeJsonFile, ensureDir } from "../utils/fileStore.js";

ensureDir(DATA_DIR);

export function hashPassword(password) {
  return createHash("sha256").update(password).digest("hex");
}

function readUsers() {
  return readJsonFile(ADMIN_USERS_FILE, []);
}

function writeUsers(users) {
  writeJsonFile(ADMIN_USERS_FILE, users);
}

function readSessions() {
  return readJsonFile(ADMIN_SESSIONS_FILE, {});
}

function writeSessions(sessions) {
  writeJsonFile(ADMIN_SESSIONS_FILE, sessions);
}

export function ensureSeedAdmin() {
  const users = readUsers();
  if (users.some((u) => u.email === DEFAULT_ADMIN.email)) return;

  const seed = {
    id: "admin-seed",
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    passwordHash: hashPassword(DEFAULT_ADMIN.password),
    createdAt: new Date().toISOString(),
  };

  writeUsers([seed, ...users.filter((u) => u.email !== DEFAULT_ADMIN.email)]);
}

export function signupAdmin({ name, email, password }) {
  ensureSeedAdmin();
  const trimmedEmail = email.trim().toLowerCase();

  if (!name?.trim()) throw new Error("Name is required.");
  if (!trimmedEmail) throw new Error("Email is required.");
  if (password.length < 6) throw new Error("Password must be at least 6 characters.");

  const users = readUsers();
  if (users.some((u) => u.email === trimmedEmail)) {
    throw new Error("This email is already registered.");
  }

  const newUser = {
    id: randomUUID(),
    name: name.trim(),
    email: trimmedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, newUser]);
  return createSession(newUser);
}

export function loginAdmin({ email, password }) {
  ensureSeedAdmin();
  const trimmedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const found = users.find((u) => u.email === trimmedEmail);

  if (!found) throw new Error("Account not found. Please sign up first.");

  if (found.passwordHash !== hashPassword(password)) {
    throw new Error("Wrong password. Try again.");
  }

  return createSession(found);
}

function createSession(user) {
  const token = randomBytes(32).toString("hex");
  const sessions = readSessions();
  sessions[token] = {
    userId: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date().toISOString(),
  };
  writeSessions(sessions);

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export function getSessionUser(token) {
  if (!token) return null;
  const sessions = readSessions();
  const session = sessions[token];
  if (!session) return null;
  return { id: session.userId, name: session.name, email: session.email };
}

export function logoutAdmin(token) {
  if (!token) return;
  const sessions = readSessions();
  delete sessions[token];
  writeSessions(sessions);
}
