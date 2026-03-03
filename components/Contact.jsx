import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { language } = useLanguage();
  const targetEmail = "sebastien.r.gomes@tecnico.ulisboa.pt";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "idle", message: "" });

  const copy = {
    pt: {
      kicker: "Contacto",
      title: "Vamos Falar Sobre o Projeto",
      intro: "As mensagens deste formulário são enviadas para a Equipa HeatSpot OFF-Grid.",
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      namePlaceholder: "O teu nome",
      emailPlaceholder: "teuemail@exemplo.com",
      messagePlaceholder: "Quero saber mais sobre o sistema...",
      submit: "Enviar Mensagem",
      submitting: "A enviar...",
      success: "Mensagem enviada com sucesso. Obrigado pelo contacto!",
      activationNeeded:
        "O formulário está em ativação. A equipa precisa de confirmar o link de ativação uma única vez.",
      error: "Não foi possível enviar agora. Tenta novamente daqui a pouco.",
      subject: "Novo contacto | HeatSpot OFF-Grid",
    },
    en: {
      kicker: "Contact",
      title: "Let's Talk About the Project",
      intro: "Messages from this form are sent to the HeatSpot OFF-Grid team.",
      name: "Name",
      email: "Email",
      message: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "yourmail@example.com",
      messagePlaceholder: "I want to know more about the system...",
      submit: "Send Message",
      submitting: "Sending...",
      success: "Message sent successfully. Thank you for reaching out!",
      activationNeeded:
        "The form is pending activation. The team must confirm the activation link a single time.",
      error: "It was not possible to send right now. Please try again shortly.",
      subject: "New contact | HeatSpot OFF-Grid",
    },
    fr: {
      kicker: "Contact",
      title: "Parlons du Projet",
      intro: "Les messages de ce formulaire sont envoyés à l'équipe HeatSpot OFF-Grid.",
      name: "Nom",
      email: "Email",
      message: "Message",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "votremail@exemple.com",
      messagePlaceholder: "Je veux en savoir plus sur le système...",
      submit: "Envoyer le message",
      submitting: "Envoi...",
      success: "Message envoyé avec succès. Merci pour votre contact !",
      activationNeeded:
        "Le formulaire est en cours d'activation. L'équipe doit confirmer le lien une seule fois.",
      error: "Envoi impossible pour le moment. Veuillez réessayer plus tard.",
      subject: "Nouveau contact | HeatSpot OFF-Grid",
    },
    es: {
      kicker: "Contacto",
      title: "Hablemos del Proyecto",
      intro: "Los mensajes de este formulario se envían al equipo HeatSpot OFF-Grid.",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "tuemail@ejemplo.com",
      messagePlaceholder: "Quiero saber más sobre el sistema...",
      submit: "Enviar Mensaje",
      submitting: "Enviando...",
      success: "Mensaje enviado con éxito. ¡Gracias por contactarnos!",
      activationNeeded:
        "El formulario está pendiente de activación. El equipo debe confirmar el enlace una sola vez.",
      error: "No fue posible enviar ahora. Inténtalo de nuevo en unos minutos.",
      subject: "Nuevo contacto | HeatSpot OFF-Grid",
    },
  };

  const text = copy[language] ?? copy.pt;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    formData.append("_subject", text.subject);
    formData.append("_captcha", "false");
    formData.append("_template", "table");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));
      const serviceMessage = String(result?.message ?? "").toLowerCase();
      const activationPattern =
        /activat|activation|confirm|verify|inbox|check your email|email link/;
      const resultSuccess =
        result?.success === true ||
        result?.success === "true" ||
        serviceMessage.includes("success");

      if (response.ok && resultSuccess) {
        event.currentTarget.reset();
        setFeedback({ type: "success", message: text.success });
        return;
      }

      if (activationPattern.test(serviceMessage)) {
        setFeedback({ type: "error", message: text.activationNeeded });
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
