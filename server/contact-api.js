import express from "express";
import nodemailer from "nodemailer";
import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = Number(process.env.CONTACT_API_PORT ?? 8787);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const superbaseRoot = path.resolve(__dirname, "..", "superbasedata");
const usersRoot = path.join(superbaseRoot, "users");

const AUTH_COOKIE = "pic_control_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpSecure = String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const teamEmails = (process.env.TEAM_EMAILS ?? "sebastien.r.gomes@tecnico.ulisboa.pt")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

const fromName = process.env.CONTACT_FROM_NAME ?? "HeatSpot OFF-Grid Website";
const fromEmail = process.env.CONTACT_FROM_EMAIL ?? smtpUser;
const sendAck = String(process.env.CONTACT_SEND_ACK ?? "true").toLowerCase() !== "false";

if (!smtpUser || !smtpPass) {
  console.warn(
    "[contact-api] SMTP_USER / SMTP_PASS não configurados. O endpoint vai responder erro até configurar as credenciais.",
  );
}

if (!teamEmails.length) {
  console.warn("[contact-api] TEAM_EMAILS vazio. Configure pelo menos um destinatário.");
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

app.use(express.json({ limit: "250kb" }));
app.use((req, res, next) => {
  const corsOrigin = process.env.CONTACT_CORS_ORIGIN ?? "*";
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/control-auth", async (req, res) => {
  try {
    await ensureSuperbaseDirs();

    const { action, email, password, fullName } = req.body ?? {};

    const safeAction = String(action ?? "").trim();
    const safeEmail = normalizeEmail(String(email ?? ""));
    const safePassword = String(password ?? "");
    const safeFullName = String(fullName ?? "").trim();

    if (!["login", "signup"].includes(safeAction)) {
      res.status(400).json({ ok: false, code: "invalid_action", error: "Ação inválida." });
      return;
    }

    if (!safeEmail || !isValidEmail(safeEmail)) {
      res.status(400).json({ ok: false, code: "invalid_email", error: "Email inválido." });
      return;
    }

    if (safePassword.length < 6) {
      res.status(400).json({ ok: false, code: "invalid_password", error: "Password inválida." });
      return;
    }

    if (safeAction === "signup") {
      const existing = await getAccountByEmail(safeEmail);
      if (existing) {
        res.status(409).json({ ok: false, code: "email_exists", error: "Este email já existe." });
        return;
      }

      const userId = userIdFromEmail(safeEmail);
      const account = {
        id: userId,
        email: safeEmail,
        fullName: safeFullName || safeEmail.split("@")[0] || "Control User",
        passwordHash: hashPassword(safeEmail, safePassword),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await writeJson(accountFileFromUserId(userId), account);
      await writeJson(controlDataFileFromUserId(userId), buildInitialControlData(account));

      setSessionCookie(res, userId);
      res.json({
        ok: true,
        session: {
          id: account.id,
          email: account.email,
          fullName: account.fullName,
        },
      });
      return;
    }

    const account = await getAccountByEmail(safeEmail);

    if (!account) {
      res.status(404).json({ ok: false, code: "user_not_found", error: "Conta não encontrada." });
      return;
    }

    const expectedHash = hashPassword(safeEmail, safePassword);
    if (account.passwordHash !== expectedHash) {
      res.status(401).json({ ok: false, code: "invalid_credentials", error: "Email ou password inválidos." });
      return;
    }

    setSessionCookie(res, account.id);
    res.json({
      ok: true,
      session: {
        id: account.id,
        email: account.email,
        fullName: account.fullName,
      },
    });
  } catch (error) {
    console.error("[contact-api] Erro no control-auth:", error);
    res.status(500).json({ ok: false, code: "server_error", error: "Erro interno no servidor." });
  }
});

app.get("/api/control-auth/session", async (req, res) => {
  try {
    await ensureSuperbaseDirs();

    const session = await getSessionFromRequest(req);
    if (!session) {
      res.status(401).json({ ok: false, code: "unauthorized", error: "Sem sessão ativa." });
      return;
    }

    res.json({ ok: true, session });
  } catch (error) {
    console.error("[contact-api] Erro ao obter sessão:", error);
    res.status(500).json({ ok: false, code: "server_error", error: "Erro interno no servidor." });
  }
});

app.delete("/api/control-auth", (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message, language = "pt", website = "" } = req.body ?? {};

  if (website) {
    res.status(200).json({ ok: true });
    return;
  }

  const safeName = String(name ?? "").trim();
  const safeEmail = String(email ?? "").trim();
  const safeMessage = String(message ?? "").trim();

  if (!safeName || !safeEmail || !safeMessage) {
    res.status(400).json({ ok: false, error: "Dados inválidos." });
    return;
  }

  if (!smtpUser || !smtpPass || !fromEmail || !teamEmails.length) {
    res.status(500).json({
      ok: false,
      error: "Configuração de email incompleta no servidor.",
    });
    return;
  }

  const cleanName = safeName.replace(/[\r\n]+/g, " ").slice(0, 120);
  const cleanEmail = safeEmail.replace(/[\r\n]+/g, " ").slice(0, 200);
  const cleanMessage = safeMessage.slice(0, 6000);
  const submittedAt = new Date().toISOString();

  const subject = `Novo contacto | HeatSpot OFF-Grid | ${cleanName}`;
  const teamText = [
    "Novo contacto enviado pelo website",
    "",
    `Nome: ${cleanName}`,
    `Email: ${cleanEmail}`,
    `Idioma: ${language}`,
    `Data: ${submittedAt}`,
    "",
    "Mensagem:",
    cleanMessage,
  ].join("\n");

  const teamHtml = `
    <h2>Novo contacto enviado pelo website</h2>
    <p><strong>Nome:</strong> ${escapeHtml(cleanName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
    <p><strong>Idioma:</strong> ${escapeHtml(String(language))}</p>
    <p><strong>Data:</strong> ${escapeHtml(submittedAt)}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${escapeHtml(cleanMessage).replace(/\n/g, "<br>")}</p>
  `;

  try {
    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: teamEmails[0],
      cc: teamEmails.slice(1).join(",") || undefined,
      replyTo: cleanEmail,
      subject,
      text: teamText,
      html: teamHtml,
    });

    if (sendAck) {
      const ackSubject =
        language === "en"
          ? "We received your message | HeatSpot OFF-Grid"
          : language === "fr"
            ? "Nous avons reçu votre message | HeatSpot OFF-Grid"
            : language === "es"
              ? "Hemos recibido tu mensaje | HeatSpot OFF-Grid"
              : "Recebemos a tua mensagem | HeatSpot OFF-Grid";

      const ackText =
        language === "en"
          ? "Your message was delivered to the HeatSpot OFF-Grid team. We will reply soon."
          : language === "fr"
            ? "Votre message a été envoyé à l'équipe HeatSpot OFF-Grid. Nous répondrons dès que possible."
            : language === "es"
              ? "Tu mensaje fue enviado al equipo HeatSpot OFF-Grid. Responderemos pronto."
              : "A tua mensagem foi enviada para a equipa HeatSpot OFF-Grid. Vamos responder em breve.";

      try {
        await transporter.sendMail({
          from: `${fromName} <${fromEmail}>`,
          to: cleanEmail,
          subject: ackSubject,
          text: ackText,
        });
      } catch (ackError) {
        console.warn("[contact-api] Falha no email de confirmação ao remetente:", ackError);
      }
    }

    res.json({ ok: true });
  } catch (error) {
    console.error("[contact-api] Erro ao enviar email:", error);
    res.status(500).json({ ok: false, error: "Falha ao enviar email." });
  }
});

app.listen(port, async () => {
  try {
    await ensureSuperbaseDirs();
    console.log(`[contact-api] A correr em http://localhost:${port}`);
    console.log(`[contact-api] SuperbaseData em: ${superbaseRoot}`);
  } catch (error) {
    console.error("[contact-api] Erro ao inicializar diretórios de superbase:", error);
  }
});

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function userIdFromEmail(email) {
  return createHash("sha256").update(normalizeEmail(email)).digest("hex");
}

function hashPassword(email, password) {
  return createHash("sha256")
    .update(`${normalizeEmail(email)}::${String(password)}`)
    .digest("hex");
}

function accountFileFromUserId(userId) {
  return path.join(usersRoot, userId, "account.json");
}

function controlDataFileFromUserId(userId) {
  return path.join(usersRoot, userId, "control-data.json");
}

async function ensureSuperbaseDirs() {
  await mkdir(usersRoot, { recursive: true });
}

async function readJson(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function writeJson(filePath, payload) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

async function getAccountByEmail(email) {
  const userId = userIdFromEmail(email);
  const filePath = accountFileFromUserId(userId);
  const account = await readJson(filePath);

  if (!account) return null;
  return { ...account, id: userId };
}

async function getAccountById(userId) {
  const filePath = accountFileFromUserId(userId);
  const account = await readJson(filePath);

  if (!account) return null;
  return { ...account, id: userId };
}

function parseCookies(headerValue) {
  const raw = String(headerValue ?? "");
  if (!raw) return {};

  return raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const idx = part.indexOf("=");
      if (idx <= 0) return acc;

      const key = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      if (!key) return acc;

      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  parts.push(`Path=${options.path ?? "/"}`);

  if (options.httpOnly !== false) {
    parts.push("HttpOnly");
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join("; ");
}

function setSessionCookie(res, userId) {
  res.setHeader(
    "Set-Cookie",
    serializeCookie(AUTH_COOKIE, userId, {
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    }),
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    serializeCookie(AUTH_COOKIE, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    }),
  );
}

async function getSessionFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  const userId = cookies[AUTH_COOKIE];

  if (!userId) return null;

  const account = await getAccountById(userId);
  if (!account) return null;

  return {
    id: account.id,
    email: account.email,
    fullName: account.fullName,
  };
}

function buildInitialControlData(account) {
  return {
    version: 1,
    owner: {
      id: account.id,
      email: account.email,
      fullName: account.fullName,
    },
    createdAt: new Date().toISOString(),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
