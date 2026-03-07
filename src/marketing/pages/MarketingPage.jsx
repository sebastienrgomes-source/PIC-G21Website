import { useEffect } from "react";
import Home from "./Home";

export default function MarketingPage({ sectionId = null }) {
  useEffect(() => {
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const scrollToSection = () => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.setTimeout(scrollToSection, 0);
  }, [sectionId]);

  return <Home />;
}
