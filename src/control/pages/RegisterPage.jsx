import { Link } from "react-router-dom";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { AuthForm } from "../components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const copy = {
  pt: {
    backToMarketing: "Voltar ao marketing",
    title: "Criar conta",
    description: "Acesso ao Control Center para monitorizacao e controlo remoto.",
  },
  en: {
    backToMarketing: "Back to marketing",
    title: "Create account",
    description: "Access the Control Center for monitoring and remote control.",
  },
};

export default function RegisterPage() {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  return (
    <main className="control-app hs-hero-bg relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="hs-hero-glow pointer-events-none absolute inset-0" />
      <div className="hs-hero-grid pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-2xl pt-8 md:pt-16">
        <div className="mb-4 text-center">
          <Link className="text-sm text-blue-100 underline underline-offset-4" to="/">
            {text.backToMarketing}
          </Link>
        </div>
        <Card className="border-blue-100/75 bg-white/96 shadow-[0_18px_50px_rgba(10,29,76,.24)]">
          <CardHeader className="pb-4">
            <CardTitle className="font-heading text-2xl text-[#0a1b58]">{text.title}</CardTitle>
            <CardDescription>{text.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm initialMode="signup" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
