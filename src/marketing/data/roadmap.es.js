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
    phaseLabel: "Completado",
    phaseTone: "done",
    current: false,
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
    phaseLabel: "Completado",
    phaseTone: "done",
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
    outreach: {
      stats: [
        { value: "50+", label: "empresas contactadas" },
        { value: "5", label: "respondieron" },
        { value: "2", label: "con interés real" },
      ],
      insights: [
        "Sectores abordados: producción en invernadero (fresa, tomate) y apicultura.",
        "Insight técnico: mantener temperatura mínima constante, no alcanzar temperaturas elevadas.",
        "Resultado: redefinición del problema con foco en estabilidad térmica y eficiencia energética.",
      ],
    },
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
    id: "prototype-build",
    step: "5",
    title: "Construcción del Prototipo",
    subtitle: "Montaje modular por bloques",
    phaseLabel: "En curso",
    phaseTone: "current",
    current: true,
    details: [
      "Montaje del bloque de energía: panel solar, controlador, batería y distribución 12V.",
      "Preparación de la integración del ESP32 con alimentación regulada y GND común.",
      "Planificación de la conexión y validación de los sensores de temperatura.",
      "Planificación de la etapa de potencia con MOSFET/SSR y calentador 12V.",
    ],
    partners: ["Equipo HeatSpot", "Mentores Embebidos", "Equipo de Hardware"],
    prototypeBlocks: [
      {
        id: "energy",
        number: "1",
        title: "Bloque 1 — Energía",
        description: "Panel solar, controlador, batería, fusible y distribución 12V.",
        phaseLabel: "Completado",
        phaseTone: "done",
        summary:
          "El bloque de energía integra la fuente solar, el controlador de carga, la batería de 12V, la protección por fusible y la línea principal de distribución +12V/GND. Este bloque garantiza que el sistema pueda operar de forma autónoma y alimentar los demás módulos.",
        components: [
          "Panel solar 50W",
          "Controlador solar MPPT/PWM",
          "Batería 12V",
          "Fusible 10A",
          "Barra +12V",
          "Barra GND",
          "Cables de potencia",
        ],
        workTitle: "Lo que ya se hizo",
        workItems: [
          "Organización inicial de los componentes en la caja",
          "Identificación de los terminales PV, BAT y LOAD",
          "Conexión de la batería al controlador con fusible",
          "Confirmación de la tensión de la batería con multímetro",
          "Conexión del panel solar al controlador",
          "Creación de la línea principal +12V/GND",
          "Prueba del Bloque 1 completada",
        ],
        imageKey: "bloco1Energia",
        imageAlt: "Montaje del Bloque 1 — Energía",
      },
      {
        id: "control-esp32",
        number: "2",
        title: "Bloque 2 — Control / ESP32",
        description: "Convertidor DC-DC, alimentación del ESP32 y GND común.",
        phaseLabel: "Planificado",
        phaseTone: "planned",
        summary:
          "El bloque de control será responsable de alimentar correctamente el ESP32 mediante el convertidor DC-DC, garantizar el GND común y preparar el microcontrolador para lectura de sensores, comandos y lógica de control.",
        components: [
          "ESP32",
          "Convertidor DC-DC LM2596",
          "Línea +12V",
          "Línea GND",
          "Cable USB para prueba/programación",
        ],
        workTitle: "Lo que se hará",
        workItems: [
          "Conectar el LM2596 a la línea principal 12V",
          "Ajustar la salida del LM2596 a 5V",
          "Alimentar el ESP32",
          "Crear GND común",
          "Probar la conexión del ESP32 al ordenador",
        ],
      },
      {
        id: "sensors",
        number: "3",
        title: "Bloque 3 — Sensores",
        description: "Elección, conexión, posicionamiento y prueba de sensores.",
        phaseLabel: "Planificado",
        phaseTone: "planned",
        summary:
          "El bloque de sensores se encargará de medir la temperatura y humedad de la zona protegida, garantizando lecturas fiables para la lógica automática del sistema.",
        components: [
          "DHT22 o SHT31",
          "ESP32",
          "Cables de señal",
          "Resistencia pull-up, si fuera necesaria",
        ],
        workTitle: "Lo que se hará",
        workItems: [
          "Elegir el sensor final",
          "Conectar el sensor al ESP32",
          "Posicionar el sensor lejos del calentador",
          "Probar lecturas en el monitor serie",
          "Validar la respuesta cuando aumente la temperatura",
        ],
        imageKey: "bloco3Sensores",
        imageAlt: "Montaje del Bloque 3 — Sensores",
      },
      {
        id: "heating-power",
        number: "4",
        title: "Bloque 4 — Calefacción / Potencia",
        description: "MOSFET/SSR, calentador, seguridad y pruebas.",
        phaseLabel: "Planificado",
        phaseTone: "planned",
        summary:
          "El bloque de potencia será responsable de encender y apagar el calentador de 12V mediante MOSFET o SSR DC, sin hacer pasar corriente elevada por el ESP32.",
        components: [
          "Calentador 12V",
          "MOSFET logic-level o SSR DC",
          "Resistencia 100Ω",
          "Resistencia 10kΩ",
          "Cables de potencia",
          "Batería 12V",
        ],
        workTitle: "Lo que se hará",
        workItems: [
          "Calcular la corriente del calentador",
          "Garantizar que el calentador nunca se conecte directamente al ESP32",
          "Implementar la conexión con MOSFET o SSR DC",
          "Fijar físicamente el calentador",
          "Probar el calentador durante 5 segundos",
        ],
      },
      {
        id: "integrated-prototype",
        number: "5",
        title: "Prototipo Integrado",
        shortTitle: "Integración",
        description:
          "Borrador final de las conexiones entre energía, control, sensores y calefacción.",
        phaseLabel: "En curso",
        phaseTone: "current",
        isCentral: true,
        summary:
          "El prototipo integrado representa el borrador físico final del sistema HEATSPOT OFF-GRID, reuniendo los cuatro bloques principales: energía, control, sensores y calefacción. Esta disposición permite visualizar las conexiones previstas antes del montaje definitivo dentro de la caja.",
        components: [
          "Panel solar 50W",
          "Controlador solar",
          "Batería 12V",
          "Convertidor DC-DC LM2596",
          "ESP32",
          "Sensores de temperatura",
          "MOSFET/SSR",
          "Calentador 12V",
        ],
        workTitle: "Lo que representa",
        workItems: [
          "Integración física de los cuatro bloques",
          "Validación visual de las conexiones antes del montaje final",
          "Organización de los componentes en el prototipo",
          "Preparación para pruebas integradas",
        ],
        imageKey: "prototypeDraft",
        imageAlt: "Borrador final del prototipo integrado",
      },
    ],
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
