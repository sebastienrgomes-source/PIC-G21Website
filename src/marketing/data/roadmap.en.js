// ─── CUSTOMIZATION INSTRUCTIONS ───────────────────────────────────────────
//
// PROTOTYPE IMAGE (step 2 — Hardware):
//   1. Place the image at src/marketing/assets/prototype-idea.png
//   2. Uncomment the import below
//   3. Replace `prototypeImage: null` with `prototypeImage: prototypeIdea`
//
// import prototypeIdea from "../assets/prototype-idea.png";
//
// COMPANY LOGOS (steps 3 and 4):
//   1. Place each logo in src/marketing/assets/logos/
//   2. Import each one (example): import company1Logo from "../assets/logos/company1.png";
//   3. Replace the corresponding `logo: null` with the import
//
// ──────────────────────────────────────────────────────────────────────────

export const roadmapEnMilestones = [
  {
    id: "requirements",
    step: "1",
    title: "Requirements",
    subtitle: "Definition and scoping",
    phaseLabel: "Finalizing now",
    phaseTone: "current",
    current: true,
    details: [
      "Closing functional and technical requirements for the prototype.",
      "Prioritizing use cases for remote and low-temperature operation.",
      "Locking acceptance criteria for the next development phases.",
    ],
    partners: ["HeatSpot Team", "IST Advisors", "Project Stakeholders"],
  },
  {
    id: "hardware",
    step: "2",
    title: "Hardware",
    subtitle: "Design and assembly",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    // TODO: replace null with prototype image import (see instructions above)
    prototypeImage: null,
    details: [
      "Electrical layout for panel, battery, and controller integration.",
      "Mechanical assembly of enclosure and heating module.",
      "Initial bench checks for safety and thermal behavior.",
    ],
    partners: ["HeatSpot Team", "Electronics Lab"],
  },
  {
    id: "companies-contacted",
    step: "3",
    title: "Companies Contacted",
    subtitle: "Industry contacts and feedback",
    phaseLabel: "Completed",
    phaseTone: "done",
    current: false,
    summary: [
      "In an early stage of the project, an outreach effort was made to companies potentially interested in the solution developed by the team, with the goal of validating product-market fit and better understanding real market requirements.",
      "Several relevant sectors were identified, with a particular focus on agriculture, namely greenhouse production and beekeeping. In total, more than 50 companies were contacted, including producers of different crops (such as strawberry, tomato, and other greenhouse crops) and honey producers.",
      "Of this group, only 5 companies responded showing willingness to analyse the proposal. However, the majority indicated they had no direct need for the solution, either because they operate in open greenhouses, already have adequate thermal control systems, or do not consider the problem critical in their specific context.",
      "Even so, two companies stood out for showing interest in the concept, especially when considered for larger-scale applications. These interactions were particularly valuable, as they allowed the collection of important technical feedback. In particular, it was suggested that a more appropriate approach could be systems that ensure the maintenance of a constant minimum temperature, rather than solutions focused on reaching high temperatures.",
      "This outreach process proved fundamental for redefining the problem and aligning the solution with real market needs, reinforcing the importance of an approach focused on thermal stability and energy efficiency in agricultural contexts.",
    ],
  },
  {
    id: "zoom-meeting",
    step: "4",
    title: "Zoom Meeting",
    subtitle: "The Summer Berry Company Portugal, S.A.",
    phaseLabel: "Completed",
    phaseTone: "done",
    current: false,
    details: [
      "Direct validation session with an agro-industrial sector company.",
      "Discussion of practical application and real field needs.",
      "Assessment of HeatSpot solution relevance and fit.",
    ],
    partners: ["HeatSpot Team", "The Summer Berry Company Portugal, S.A."],
    zoomCompany: {
      name: "The Summer Berry Company Portugal, S.A.",
      logo: null,             // TODO: import summerBerryLogo from "../assets/logos/summer-berry.png"
      feedback: "summerBerryFeedback",
      interactionType: "Zoom Meeting",
    },
  },
  {
    id: "firmware",
    step: "5",
    title: "Firmware",
    subtitle: "Embedded development",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Implementing control logic on ESP32.",
      "Sensor reading, telemetry structure, and threshold rules.",
      "Power management strategy for autonomous operation.",
    ],
    partners: ["HeatSpot Team", "Embedded Mentors"],
  },
  {
    id: "module-testing",
    step: "6",
    title: "Module Testing",
    subtitle: "Component-level validation",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Testing each subsystem independently before integration.",
      "Verifying heating response under controlled conditions.",
      "Registering issues and fixes per component.",
    ],
    partners: ["HeatSpot Team", "Lab Support"],
  },
  {
    id: "system-validation",
    step: "7",
    title: "System Validation",
    subtitle: "Integrated testing",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Integrated run of hardware and firmware as a full system.",
      "Stress scenarios for continuity and energy autonomy.",
      "Validation against final acceptance criteria.",
    ],
    partners: ["HeatSpot Team", "Academic Jury"],
  },
  {
    id: "electroday",
    step: "8",
    title: "ElectroDay",
    subtitle: "Final prototype demo",
    phaseLabel: "Planned",
    phaseTone: "planned",
    current: false,
    details: [
      "Final demo setup and execution script.",
      "Packaging of technical results and evidence.",
      "Public presentation of prototype and roadmap next steps.",
    ],
    partners: ["HeatSpot Team", "ElectroDay Audience"],
  },
];
