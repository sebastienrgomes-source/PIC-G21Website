const AUTH_ENDPOINT = "/api/control-auth";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.error ?? "Authentication request failed.");
    error.code = payload.code ?? "auth_error";
    throw error;
  }

  return payload;
}

export async function getSessionRequest() {
  const response = await fetch(`${AUTH_ENDPOINT}/session`, {
    method: "GET",
    credentials: "same-origin",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.error ?? "No active session.");
    error.code = payload.code ?? "unauthorized";
    throw error;
  }

  return payload.session ?? null;
}

export async function loginRequest({ email, password }) {
  const payload = await requestJson(AUTH_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ action: "login", email, password }),
  });

  return payload.session;
}

export async function signupRequest({ email, password, fullName }) {
  const payload = await requestJson(AUTH_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ action: "signup", email, password, fullName }),
  });

  return payload.session;
}

export async function logoutRequest() {
  await fetch(AUTH_ENDPOINT, {
    method: "DELETE",
    credentials: "same-origin",
  });
}
