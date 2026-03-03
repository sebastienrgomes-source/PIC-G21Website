import express from "express";
import nodemailer from "nodemailer";

const app = express();
const port = Number(process.env.CONTACT_API_PORT ?? 8787);

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
    "[contact-api] SMTP_USER / SMTP_PASS não configurados. O endpoint vai responder erro até configurar as credenciais."
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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
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

app.listen(port, () => {
  console.log(`[contact-api] A correr em http://localhost:${port}`);
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
