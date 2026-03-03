import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();
  const teamInboxTopic =
    import.meta.env.VITE_TEAM_INBOX_TOPIC ?? "heatspot-offgrid-g21-contact-3f6k9m2q8v";
  const teamInboxUrl = `https://ntfy.sh/${teamInboxTopic}`;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const copy = {
    pt: {
      kicker: "Contacto",
      title: "Vamos Falar Sobre o Projeto",
      intro: "As mensagens deste formulário são partilhadas com a Equipa HeatSpot OFF-Grid.",
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      namePlaceholder: "O teu nome",
      emailPlaceholder: "teuemail@exemplo.com",
      messagePlaceholder: "Quero saber mais sobre o sistema...",
      submit: "Enviar Mensagem",
      submitting: "A enviar...",
      success: "Mensagem enviada com sucesso. Obrigado pelo contacto!",
      error: "Não foi possível enviar agora. Tenta novamente daqui a pouco.",
      subject: "Novo contacto",
    },
    en: {
      kicker: "Contact",
      title: "Let's Talk About the Project",
      intro: "Messages from this form are shared with the HeatSpot OFF-Grid team.",
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "yourmail@example.com",
      messagePlaceholder: "I want to know more about the system...",
      submit: "Send Message",
      submitting: "Sending...",
      success: "Message sent successfully. Thank you for reaching out!",
      error: "It was not possible to send right now. Please try again shortly.",
      subject: "New contact",
    },
    fr: {
      kicker: "Contact",
      title: "Parlons du Projet",
      intro: "Les messages de ce formulaire sont partagés avec l'équipe HeatSpot OFF-Grid.",
      name: "Nom",
      email: "Email",
      message: "Message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votremail@exemple.com",
      messagePlaceholder: "Je veux en savoir plus sur le système...",
      submit: "Envoyer le message",
      submitting: "Envoi...",
      success: "Message envoyé avec succès. Merci pour votre contact !",
      error: "Envoi impossible pour le moment. Veuillez réessayer plus tard.",
      subject: "Nouveau contact",
    },
    es: {
      kicker: "Contacto",
      title: "Hablemos del Proyecto",
      intro: "Los mensajes de este formulario se comparten con el equipo HeatSpot OFF-Grid.",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tuemail@ejemplo.com",
      messagePlaceholder: "Quiero saber más sobre el sistema...",
      submit: "Enviar Mensaje",
      submitting: "Enviando...",
      success: "Mensaje enviado con éxito. ¡Gracias por contactarnos!",
      error: "No fue posible enviar ahora. Inténtalo de nuevo en unos minutos.",
      subject: "Nuevo contacto",
    },
  };

  const text = copy[language] ?? copy.pt;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const senderName = String(formData.get("name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const senderMessage = String(formData.get("message") ?? "").trim();
    const timestamp = new Date().toISOString();
    const payload = [
      `HeatSpot OFF-Grid | ${text.subject}`,
      `Nome/Name: ${senderName}`,
      `Email: ${senderEmail}`,
      `Mensagem/Message: ${senderMessage}`,
      `Data/Date: ${timestamp}`,
    ].join("\n");

    try {
      const response = await fetch(teamInboxUrl, {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        event.currentTarget.reset();
        setFeedback({ type: "success", message: text.success });
        return;
      }

      setFeedback({ type: "error", message: text.error });
    } catch {
      setFeedback({ type: "error", message: text.error });
    } finally {
      setIsSubmitting(false);
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
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? text.submitting : text.submit}
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
