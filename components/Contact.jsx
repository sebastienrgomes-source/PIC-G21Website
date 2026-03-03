import React, { useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const teamEmails = useMemo(() => {
    const raw = import.meta.env.VITE_TEAM_EMAILS ?? "sebastien.r.gomes@tecnico.ulisboa.pt";
    return raw
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
  }, []);

  const teamEmailDisplay = teamEmails.join(", ");
  const primaryEmail = teamEmails[0] ?? "sebastien.r.gomes@tecnico.ulisboa.pt";
  const ccEmails = teamEmails.slice(1);

  const copy = {
    pt: {
      kicker: "Contacto",
      title: "Vamos Falar Sobre o Projeto",
      intro: `Esta mensagem é enviada para a Equipa HeatSpot OFF-Grid: ${teamEmailDisplay}.`,
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      namePlaceholder: "O teu nome",
      emailPlaceholder: "teuemail@exemplo.com",
      messagePlaceholder: "Quero saber mais sobre o sistema...",
      submit: "Enviar Mensagem",
      success:
        "Abrimos o teu cliente de email com a mensagem pronta para enviar à equipa.",
      error:
        "Não foi possível abrir o cliente de email automaticamente. Envia manualmente para a equipa.",
      subject: "Novo contacto | HeatSpot OFF-Grid",
      bodyName: "Nome",
      bodyEmail: "Email",
      bodyMessage: "Mensagem",
      bodyDate: "Data",
    },
    en: {
      kicker: "Contact",
      title: "Let's Talk About the Project",
      intro: `This message is sent to the HeatSpot OFF-Grid team: ${teamEmailDisplay}.`,
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "yourmail@example.com",
      messagePlaceholder: "I want to know more about the system...",
      submit: "Send Message",
      success:
        "Your email app was opened with the message ready to send to the team.",
      error:
        "It was not possible to open your email app automatically. Please send manually to the team.",
      subject: "New contact | HeatSpot OFF-Grid",
      bodyName: "Name",
      bodyEmail: "Email",
      bodyMessage: "Message",
      bodyDate: "Date",
    },
    fr: {
      kicker: "Contact",
      title: "Parlons du Projet",
      intro: `Ce message est envoyé à l'équipe HeatSpot OFF-Grid : ${teamEmailDisplay}.`,
      name: "Nom",
      email: "Email",
      message: "Message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votremail@exemple.com",
      messagePlaceholder: "Je veux en savoir plus sur le système...",
      submit: "Envoyer le message",
      success:
        "Votre application email a été ouverte avec le message prêt à être envoyé à l'équipe.",
      error:
        "Impossible d'ouvrir automatiquement votre application email. Veuillez envoyer manuellement à l'équipe.",
      subject: "Nouveau contact | HeatSpot OFF-Grid",
      bodyName: "Nom",
      bodyEmail: "Email",
      bodyMessage: "Message",
      bodyDate: "Date",
    },
    es: {
      kicker: "Contacto",
      title: "Hablemos del Proyecto",
      intro: `Este mensaje se envía al equipo HeatSpot OFF-Grid: ${teamEmailDisplay}.`,
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tuemail@ejemplo.com",
      messagePlaceholder: "Quiero saber más sobre el sistema...",
      submit: "Enviar Mensaje",
      success:
        "Se abrió tu aplicación de email con el mensaje listo para enviarse al equipo.",
      error:
        "No fue posible abrir tu aplicación de email automáticamente. Envíalo manualmente al equipo.",
      subject: "Nuevo contacto | HeatSpot OFF-Grid",
      bodyName: "Nombre",
      bodyEmail: "Email",
      bodyMessage: "Mensaje",
      bodyDate: "Fecha",
    },
  };

  const text = copy[language] ?? copy.pt;

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const senderName = String(formData.get("name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const senderMessage = String(formData.get("message") ?? "").trim();
    const timestamp = new Date().toISOString();

    const body = [
      `${text.bodyName}: ${senderName}`,
      `${text.bodyEmail}: ${senderEmail}`,
      "",
      `${text.bodyMessage}:`,
      senderMessage,
      "",
      `${text.bodyDate}: ${timestamp}`,
    ].join("\n");

    const params = new URLSearchParams();
    if (ccEmails.length) {
      params.set("cc", ccEmails.join(","));
    }
    params.set("subject", text.subject);
    params.set("body", body);

    try {
      window.location.href = `mailto:${primaryEmail}?${params.toString()}`;
      event.currentTarget.reset();
      setFeedback({ type: "success", message: text.success });
    } catch {
      setFeedback({ type: "error", message: text.error });
    }
  };

  return (
    <section id="contacto" className="section section-light">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            {text.name}
            <input
              type="text"
              name="name"
              placeholder={text.namePlaceholder}
              autoComplete="name"
              required
            />
          </label>
          <label>
            {text.email}
            <input
              type="email"
              name="email"
              placeholder={text.emailPlaceholder}
              autoComplete="email"
              required
            />
          </label>
          <label>
            {text.message}
            <textarea
              rows="4"
              name="message"
              placeholder={text.messagePlaceholder}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary">
            {text.submit}
          </button>
          {feedback.message ? (
            <p className={`contact-feedback contact-feedback-${feedback.type}`}>
              {feedback.message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
