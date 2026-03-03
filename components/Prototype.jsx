import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Prototype() {
  const { language } = useLanguage();

  const copy = {
    pt: {
      kicker: "Protótipo",
      title: "Protótipo Funcional com Custo Acessível",
      intro:
        "Construído com componentes comerciais, o protótipo já valida a viabilidade técnica e económica da solução.",
      costLabel: "Custo estimado do protótipo",
      costValue: "€200",
      points: [
        "Implementação rápida e modular",
        "Escalável para diferentes cenários",
        "Pronto para testes de campo",
      ],
    },
    en: {
      kicker: "Prototype",
      title: "Functional Prototype at an Affordable Cost",
      intro:
        "Built with commercial components, the prototype already validates the technical and economic feasibility of the solution.",
      costLabel: "Estimated prototype cost",
      costValue: "€200",
      points: [
        "Fast and modular implementation",
        "Scalable for different scenarios",
        "Ready for field testing",
      ],
    },
    fr: {
      kicker: "Prototype",
      title: "Prototype Fonctionnel à Coût Accessible",
      intro:
        "Construit avec des composants commerciaux, le prototype valide déjà la viabilité technique et économique de la solution.",
      costLabel: "Coût estimé du prototype",
      costValue: "€200",
      points: [
        "Implémentation rapide et modulaire",
        "Évolutif pour différents scénarios",
        "Prêt pour des tests sur le terrain",
      ],
    },
    es: {
      kicker: "Prototipo",
      title: "Prototipo Funcional con Costo Accesible",
      intro:
        "Construido con componentes comerciales, el prototipo ya valida la viabilidad técnica y económica de la solución.",
      costLabel: "Costo estimado del prototipo",
      costValue: "€200",
      points: [
        "Implementación rápida y modular",
        "Escalable para diferentes escenarios",
        "Listo para pruebas de campo",
      ],
    },
  };

  const text = copy[language] ?? copy.pt;

  return (
    <section id="prototipo" className="section section-dark">
      <div className="container">
        <header className="section-heading">
          <p className="kicker">{text.kicker}</p>
          <h2>{text.title}</h2>
          <p>{text.intro}</p>
        </header>

        <div className="prototype-box">
          <div>
            <p className="tiny">{text.costLabel}</p>
            <p className="price">{text.costValue}</p>
          </div>
          <div className="prototype-points">
            {text.points.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
