import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Solution from "../components/Solution";
import Technology from "../components/Technology";
import Features from "../components/Features";
import Applications from "../components/Applications";
import Prototype from "../components/Prototype";
import Roadmap from "../components/Roadmap";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { language } = useLanguage();

  useEffect(() => {
    const titles = {
      pt: "HeatSpot OFF-Grid",
      en: "HeatSpot OFF-Grid",
      fr: "HeatSpot OFF-Grid",
      es: "HeatSpot OFF-Grid",
    };

    document.title = titles[language] ?? titles.pt;
  }, [language]);

  return (
    <div className="site">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Technology />
      <Features />
      <Applications />
      <Prototype />
      <Roadmap />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
