import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../marketing/context/LanguageContext";
import { useAuth } from "../auth/AuthContext";
import { Button } from "./ui/button";

export function SignOutButton({ className, label, variant = "outline" }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { logout } = useAuth();

  const resolvedLabel = label ?? (language === "pt" ? "Sair" : "Logout");

  const onClick = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <Button className={className} onClick={onClick} variant={variant}>
      {resolvedLabel}
    </Button>
  );
}
