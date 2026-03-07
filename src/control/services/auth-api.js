const AUTH_ENDPOINT = "/api/control-auth";
const LOCAL_ACCOUNTS_KEY = "pic_control_accounts_v1";
const LOCAL_SESSION_KEY = "pic_control_session_v1";

const hasWindow = () => typeof window !== "undefined";

const storage = () => {
  if (!hasWindow()) return null;
  return window.localStorage;
};

const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

const buildAuthError = (message, code, status) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
};

const shouldUseLocalFallback = (error) => {
  if (!error) return false;
  if (error.code === "service_unavailable") return true;
  if (error.status !== 404 && error.status !== 405) return false;
  return error.code === "auth_error" || error.code === "unauthorized";
};

const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

async function sha256Hex(value) {
  const input = String(value ?? "");

  if (hasWindow() && window.crypto?.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return toHex(new Uint8Array(digest));
  }

  let hash = 0;
  for (let idx = 0; idx < input.length; idx += 1) {
    hash = (hash * 31 + input.charCodeAt(idx)) >>> 0;
  }
  return `fallback-${hash.toString(16).padStart(8, "0")}`;
}

async function userIdFromEmail(email) {
  return sha256Hex(normalizeEmail(email));
}

async function hashPassword(email, password) {
  return sha256Hex(`${normalizeEmail(email)}::${String(password ?? "")}`);
}

function readLocalJson(key, fallback) {
  const store = storage();
  if (!store) return fallback;

  try {
    const raw = store.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson(key, value) {
  const store = storage();
  if (!store) return;
  store.setItem(key, JSON.stringify(value));
}

function readLocalAccounts() {
  return readLocalJson(LOCAL_ACCOUNTS_KEY, {});
}

function writeLocalAccounts(accounts) {
  writeLocalJson(LOCAL_ACCOUNTS_KEY, accounts);
}

function setLocalSession(session) {
  writeLocalJson(LOCAL_SESSION_KEY, session);
}

function clearLocalSession() {
  const store = storage();
  if (!store) return;
  store.removeItem(LOCAL_SESSION_KEY);
}

function readLocalSession() {
  return readLocalJson(LOCAL_SESSION_KEY, null);
}

function validateAuthPayload({ email, password }) {
  const safeEmail = normalizeEmail(email);
  const safePassword = String(password ?? "");

  if (!safeEmail || !isValidEmail(safeEmail)) {
    throw buildAuthError("Email inválido.", "invalid_email", 400);
  }

  if (safePassword.length < 6) {
    throw buildAuthError("Password inválida.", "invalid_password", 400);
  }

  return { safeEmail, safePassword };
}

async function localSignup({ email, password, fullName }) {
  const { safeEmail, safePassword } = validateAuthPayload({ email, password });

  const accounts = readLocalAccounts();
  if (accounts[safeEmail]) {
    throw buildAuthError("Este email já existe.", "email_exists", 409);
  }

  const id = await userIdFromEmail(safeEmail);
  const account = {
    id,
    email: safeEmail,
    fullName: String(fullName ?? "").trim() || safeEmail.split("@")[0] || "Control User",
    passwordHash: await hashPassword(safeEmail, safePassword),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  accounts[safeEmail] = account;
  writeLocalAccounts(accounts);

  const session = {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
  };

  setLocalSession(session);
  return session;
}

async function localLogin({ email, password }) {
  const { safeEmail, safePassword } = validateAuthPayload({ email, password });

  const accounts = readLocalAccounts();
  const account = accounts[safeEmail] ?? null;

  if (!account) {
    throw buildAuthError("Conta não encontrada.", "user_not_found", 404);
  }

  const expectedHash = await hashPassword(safeEmail, safePassword);
  if (account.passwordHash !== expectedHash) {
    throw buildAuthError("Email ou password inválidos.", "invalid_credentials", 401);
  }

  const session = {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
  };

  setLocalSession(session);
  return session;
}

async function localGetSession() {
  const session = readLocalSession();
  if (!session) {
    throw buildAuthError("Sem sessão ativa.", "unauthorized", 401);
  }

  const accounts = readLocalAccounts();
  const account = accounts[normalizeEmail(session.email)] ?? null;

  if (!account) {
    clearLocalSession();
    throw buildAuthError("Sem sessão ativa.", "unauthorized", 401);
  }

  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
  };
}

async function localLogout() {
  clearLocalSession();
}

async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch {
    throw buildAuthError("Authentication service unavailable.", "service_unavailable", 503);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw buildAuthError(payload.error ?? "Authentication request failed.", payload.code ?? "auth_error", response.status);
  }

  return payload;
}

export async function getSessionRequest() {
  try {
    const response = await fetch(`${AUTH_ENDPOINT}/session`, {
      method: "GET",
      credentials: "same-origin",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw buildAuthError(payload.error ?? "No active session.", payload.code ?? "unauthorized", response.status);
    }

    return payload.session ?? null;
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localGetSession();
    }

    throw error;
  }
}

export async function loginRequest({ email, password }) {
  try {
    const payload = await requestJson(AUTH_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ action: "login", email, password }),
    });

    return payload.session;
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localLogin({ email, password });
    }

    throw error;
  }
}

export async function signupRequest({ email, password, fullName }) {
  try {
    const payload = await requestJson(AUTH_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ action: "signup", email, password, fullName }),
    });

    return payload.session;
  } catch (error) {
    if (shouldUseLocalFallback(error)) {
      return localSignup({ email, password, fullName });
    }

    throw error;
  }
}

export async function logoutRequest() {
  try {
    await fetch(AUTH_ENDPOINT, {
      method: "DELETE",
      credentials: "same-origin",
    });
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }
  }

  await localLogout();
}

