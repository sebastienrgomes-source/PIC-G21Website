import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Problem from "../components/Problem";
import Solution from "../components/Solution";
import Technology from "../components/Technology";
import Features from "../components/Features";
import Applications from "../components/Applications";
import Prototype from "../components/Prototype";
import Team from "../components/Team";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
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
      <Team />
      <Contact />
      <Footer />
    </div>
  );
}
