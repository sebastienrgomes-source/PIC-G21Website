import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const contactApiUrl = import.meta.env.VITE_CONTACT_API_URL ?? "/api/contact";

export default function Contact() {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const copy = {
    pt: {
      kicker: "Contacto",
      title: "Vamos Falar Sobre o Projeto",
      intro: "Esta mensagem é enviada para a Equipa HeatSpot OFF-Grid.",
      deliveryHint:
        "O envio é feito diretamente pelo servidor, sem abrir o teu cliente de email.",
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      namePlaceholder: "O teu nome",
      emailPlaceholder: "teuemail@exemplo.com",
      messagePlaceholder: "Quero saber mais sobre o sistema...",
      submit: "Enviar Mensagem",
      submitting: "A enviar...",
      success:
        "Mensagem enviada para a equipa com sucesso. Também foi enviada cópia para o teu email.",
      error:
        "Não foi possível enviar agora. Verifica a configuração do servidor de email e tenta novamente.",
    },
    en: {
      kicker: "Contact",
      title: "Let's Talk About the Project",
      intro: "This message is sent to the HeatSpot OFF-Grid team.",
      deliveryHint:
        "The message is sent directly by the server, without opening your email app.",
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "yourmail@example.com",
      messagePlaceholder: "I want to know more about the system...",
      submit: "Send Message",
      submitting: "Sending...",
      success:
        "Message delivered to the team successfully. A copy was also sent to your email.",
      error:
        "It was not possible to send right now. Check server email configuration and try again.",
    },
    fr: {
      kicker: "Contact",
      title: "Parlons du Projet",
      intro: "Ce message est envoyé à l'équipe HeatSpot OFF-Grid.",
      deliveryHint:
        "L'envoi est réalisé directement par le serveur, sans ouvrir votre application email.",
      name: "Nom",
      email: "Email",
      message: "Message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votremail@exemple.com",
      messagePlaceholder: "Je veux en savoir plus sur le système...",
      submit: "Envoyer le message",
      submitting: "Envoi...",
      success:
        "Message envoyé à l'équipe avec succès. Une copie a aussi été envoyée à votre email.",
      error:
        "Envoi impossible pour le moment. Vérifiez la configuration email du serveur et réessayez.",
    },
    es: {
      kicker: "Contacto",
      title: "Hablemos del Proyecto",
      intro: "Este mensaje se envía al equipo HeatSpot OFF-Grid.",
      deliveryHint:
        "El envío se realiza directamente por el servidor, sin abrir tu app de email.",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tuemail@ejemplo.com",
      messagePlaceholder: "Quiero saber más sobre el sistema...",
      submit: "Enviar Mensaje",
      submitting: "Enviando...",
      success:
        "Mensaje enviado al equipo con éxito. También se envió una copia a tu email.",
      error:
        "No fue posible enviar ahora. Revisa la configuración de email del servidor e inténtalo de nuevo.",
    },
  };

  const text = copy[language] ?? copy.pt;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: "idle", message: "" });
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      language,
    };

    try {
      const response = await fetch(contactApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result?.ok) {
        event.currentTarget.reset();
        setFeedback({ type: "success", message: text.success });
      } else {
        setFeedback({ type: "error", message: text.error });
      }
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
          <p className="contact-note">{text.deliveryHint}</p>
        </header>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="contact-honeypot" aria-hidden="true">
            Website
            <input type="text" name="website" tabIndex="-1" autoComplete="off" />
          </label>

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
