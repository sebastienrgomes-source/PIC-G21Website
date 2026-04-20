// ─── INSTRUCCIONES DE PERSONALIZACIÓN ────────────────────────────────────
//
// IMAGEN DEL PROTOTIPO (paso 2 — Hardware):
//   1. Coloca la imagen en src/marketing/assets/prototype-idea.png
//   2. Descomenta el import de abajo
//   3. Sustituye `prototypeImage: null` por `prototypeImage: prototypeIdea`
//
// import prototypeIdea from "../assets/prototype-idea.png";
//
// LOGOS DE LAS EMPRESAS (pasos 3 y 4):
//   1. Coloca cada logo en src/marketing/assets/logos/
//   2. Importa cada uno (ejemplo): import company1Logo from "../assets/logos/company1.png";
//   3. Sustituye el `logo: null` correspondiente por el import
//
// ──────────────────────────────────────────────────────────────────────────

export const roadmapEsMilestones = [
  {
    id: "requirements",
    step: "1",
    title: "Requisitos",
    subtitle: "Definición y alcance",
    phaseLabel: "Finalizando",
    phaseTone: "current",
    current: true,
    details: [
      "Cierre de requisitos funcionales y técnicos del prototipo.",
      "Priorización de casos de uso para operación remota y a baja temperatura.",
      "Definición de criterios de aceptación para las próximas fases.",
    ],
    partners: ["Equipo HeatSpot", "Asesores IST", "Stakeholders del proyecto"],
  },
  {
    id: "hardware",
    step: "2",
    title: "Hardware",
    subtitle: "Diseño y montaje",
    phaseLabel: "Planificado",
    phaseTone: "planned",
    current: false,
    // TODO: reemplazar null con el import de la imagen del prototipo (ver instrucciones arriba)
    prototypeImage: null,
    details: [
      "Diseño eléctrico para integrar panel, batería y controlador.",
      "Montaje mecánico de la carcasa y el módulo de calefacción.",
      "Pruebas iniciales de banco para seguridad y comportamiento térmico.",
    ],
    partners: ["Equipo HeatSpot", "Laboratorio de Electrónica"],
  },
  {
    id: "companies-contacted",
    step: "3",
    title: "Empresas Contactadas",
    subtitle: "Contactos y retroalimentación del sector",
    phaseLabel: "Completado",
    phaseTone: "done",
    current: false,
    summary: [
      "En una fase inicial del proyecto, se realizó un esfuerzo de contacto con empresas potencialmente interesadas en la solución desarrollada por el equipo, con el objetivo de validar la necesidad del producto y comprender mejor los requisitos del mercado.",
      "Se identificaron varios sectores relevantes, con especial énfasis en el área agrícola, concretamente en la producción en invernadero y la apicultura. En total, se contactaron más de 50 empresas, incluyendo productores de diferentes cultivos (como fresa, tomate y otros cultivos en invernadero) y productores de miel.",
      "De este conjunto, solo 5 empresas respondieron mostrando disponibilidad para analizar la propuesta. Sin embargo, la mayoría indicó no tener necesidad directa de la solución, ya sea porque operan en invernaderos abiertos, ya disponen de sistemas de control térmico adecuados, o no consideran el problema crítico en su contexto específico.",
      "Aun así, dos empresas se destacaron por demostrar interés en el concepto, especialmente cuando se pensó para aplicaciones a mayor escala. Estas interacciones fueron particularmente relevantes, ya que permitieron recopilar retroalimentación técnica importante. En particular, se sugirió que un enfoque más adecuado podría ser sistemas que garanticen el mantenimiento de una temperatura mínima constante, en lugar de soluciones enfocadas en alcanzar temperaturas elevadas.",
      "Este proceso de contacto resultó fundamental para la redefinición del problema y la alineación de la solución con necesidades reales del mercado, reforzando la importancia de un enfoque orientado a la estabilidad térmica y eficiencia energética en contextos agrícolas.",
    ],
  },
  {
    id: "zoom-meeting",
    step: "4",
    title: "Reunión Zoom",
    subtitle: "The Summer Berry Company Portugal, S.A.",
    phaseLabel: "Completado",
    phaseTone: "done",
    current: false,
    details: [
      "Sesión de validación directa con empresa del sector agro-industrial.",
      "Discusión sobre aplicación práctica y necesidades reales en campo.",
      "Evaluación de la relevancia y adecuación de la solución HeatSpot.",
    ],
    partners: ["Equipo HeatSpot", "The Summer Berry Company Portugal, S.A."],
    zoomCompany: {
      name: "The Summer Berry Company Portugal, S.A.",
      logo: null,
      feedback: "summerBerryFeedback",
      interactionType: "Reunión via Zoom",
    },
  },
  {
    id: "firmware",
    step: "5",
    title: "Firmware",
    subtitle: "Desarrollo embebido",
    phaseLabel: "Planificado",
    phaseTone: "planned",
    current: false,
    details: [
      "Implementación de la lógica de control en ESP32.",
      "Lectura de sensores, estructura de telemetría y reglas de umbral.",
      "Estrategia de gestión energética para operación autónoma.",
    ],
    partners: ["Equipo HeatSpot", "Mentores Embebidos"],
  },
  {
    id: "module-testing",
    step: "6",
    title: "Pruebas Modulares",
    subtitle: "Validación por componente",
    phaseLabel: "Planificado",
    phaseTone: "planned",
    current: false,
    details: [
      "Prueba de cada subsistema de forma independiente antes de integrar.",
      "Verificación de la respuesta térmica en condiciones controladas.",
      "Registro de incidencias y correcciones por componente.",
    ],
    partners: ["Equipo HeatSpot", "Apoyo de Laboratorio"],
  },
  {
    id: "system-validation",
    step: "7",
    title: "Validación del Sistema",
    subtitle: "Prueba integrada",
    phaseLabel: "Planificado",
    phaseTone: "planned",
    current: false,
    details: [
      "Ejecución integrada de hardware y firmware como sistema completo.",
      "Escenarios de estrés para continuidad y autonomía energética.",
      "Validación frente a los criterios finales de aceptación.",
    ],
    partners: ["Equipo HeatSpot", "Jurado Académico"],
  },
  {
    id: "electroday",
    step: "8",
    title: "ElectroDay",
    subtitle: "Demostración final del prototipo",
    phaseLabel: "Planificado",
    phaseTone: "planned",
    current: false,
    details: [
      "Preparación del setup final y guion de demostración.",
      "Empaquetado de resultados técnicos y evidencias.",
      "Presentación pública del prototipo y próximos pasos.",
    ],
    partners: ["Equipo HeatSpot", "Audiencia ElectroDay"],
  },
];
