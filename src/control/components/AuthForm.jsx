import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const copy = {
  pt: {
    tabs: {
      login: "Login",
      signup: "Registo",
    },
    fields: {
      fullName: "Nome",
      fullNamePlaceholder: "Nome completo",
      email: "Email",
      emailPlaceholder: "nome@exemplo.com",
      password: "Password",
    },
    hints: {
      loginHelp: "Insere o teu email e password para entrar.",
      created: "Conta criada com sucesso.",
      redirectSignup: "Conta não encontrada. Vamos criar uma nova conta.",
    },
    actions: {
      processing: "A processar...",
      create: "Criar conta",
      enter: "Entrar",
    },
    errors: {
      generic: "Falha na autenticação.",
    },
  },
  en: {
    tabs: {
      login: "Login",
      signup: "Sign up",
    },
    fields: {
      fullName: "Full name",
      fullNamePlaceholder: "Full name",
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Password",
    },
    hints: {
      loginHelp: "Enter your email and password to sign in.",
      created: "Account created successfully.",
      redirectSignup: "Account not found. Redirecting to sign up.",
    },
    actions: {
      processing: "Processing...",
      create: "Create account",
      enter: "Sign in",
    },
    errors: {
      generic: "Authentication failed.",
    },
  },
};

export function AuthForm({ initialMode = "login" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { login, register } = useAuth();

  const text = copy[language] ?? copy.en;
  const nextPath = searchParams.get("next") ?? "/control";
  const prefilledEmail = searchParams.get("email") ?? "";

  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    try {
      if (mode === "signup") {
        await register({ email, password, fullName });
        setInfo(text.hints.created);
      } else {
        await login({ email, password });
      }

      navigate(nextPath, { replace: true });
    } catch (submitError) {
      if (mode === "login" && submitError?.code === "user_not_found") {
        setInfo(text.hints.redirectSignup);
        navigate(`/register?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`, { replace: true });
        return;
      }

      setError(submitError instanceof Error ? submitError.message : text.errors.generic);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-blue-100 bg-[#f4f7ff] p-1.5">
        <Button className="h-10" onClick={() => setMode("login")} type="button" variant={mode === "login" ? "default" : "ghost"}>
          {text.tabs.login}
        </Button>
        <Button className="h-10" onClick={() => setMode("signup")} type="button" variant={mode === "signup" ? "default" : "ghost"}>
          {text.tabs.signup}
        </Button>
      </div>

      {mode === "signup" ? (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="full-name">
            {text.fields.fullName}
          </Label>
          <Input
            className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
            id="full-name"
            onChange={(event) => setFullName(event.target.value)}
            placeholder={text.fields.fullNamePlaceholder}
            value={fullName}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="email">
          {text.fields.email}
        </Label>
        <Input
          className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder={text.fields.emailPlaceholder}
          required
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#4d5f8e]" htmlFor="password">
          {text.fields.password}
        </Label>
        <Input
          className="h-11 rounded-xl border-blue-200 bg-[#f7f9ff]"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>

      {mode === "login" ? (
        <p className="rounded-lg border border-blue-100 bg-[#f5f8ff] px-3 py-2 text-xs text-[#3e5186]">{text.hints.loginHelp}</p>
      ) : null}

      {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {info ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p> : null}

      <Button className="h-11 w-full" disabled={busy} type="submit">
        {busy ? text.actions.processing : mode === "signup" ? text.actions.create : text.actions.enter}
      </Button>
    </form>
  );
}
