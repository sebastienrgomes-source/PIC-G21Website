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
    phaseLabel: "Completed",
    phaseTone: "done",
    current: false,
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
    phaseLabel: "Completed",
    phaseTone: "done",
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
    outreach: {
      stats: [
        { value: "50+", label: "companies contacted" },
        { value: "5", label: "responded" },
        { value: "2", label: "showed real interest" },
      ],
      insights: [
        "Sectors approached: greenhouse production (strawberry, tomato) and beekeeping.",
        "Key insight: maintain a constant minimum temperature rather than reaching high temperatures.",
        "Outcome: problem redefined with a focus on thermal stability and energy efficiency.",
      ],
    },
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
    id: "prototype-build",
    step: "5",
    title: "Prototype Construction",
    subtitle: "Modular block assembly",
    phaseLabel: "In progress",
    phaseTone: "current",
    current: true,
    details: [
      "Assembly of the energy block: solar panel, controller, battery, and 12V distribution.",
      "Preparation of ESP32 integration with regulated power and common GND.",
      "Planning of the temperature sensor wiring and validation.",
      "Planning of the power stage with MOSFET/SSR and 12V heater.",
    ],
    partners: ["HeatSpot Team", "Embedded Mentors", "Hardware Team"],
    prototypeBlocks: [
      {
        id: "energy",
        number: "1",
        title: "Block 1 — Energy",
        description: "Solar panel, controller, battery, fuse, and 12V distribution.",
        phaseLabel: "Completed",
        phaseTone: "done",
        summary:
          "The energy block integrates the solar source, charge controller, 12V battery, fuse protection, and the main +12V/GND distribution line. This block ensures the system can operate autonomously and power the remaining modules.",
        components: [
          "50W solar panel",
          "MPPT/PWM solar controller",
          "12V battery",
          "10A fuse",
          "+12V busbar",
          "GND busbar",
          "Power cables",
        ],
        workTitle: "What has been completed",
        workItems: [
          "Initial organization of the components inside the enclosure",
          "Identification of the PV, BAT, and LOAD terminals",
          "Battery connection to the controller with fuse protection",
          "Battery voltage confirmation with a multimeter",
          "Solar panel connection to the controller",
          "Creation of the main +12V/GND line",
          "Block 1 test completed",
        ],
        imageKey: "bloco1Energia",
        imageAlt: "Block 1 energy assembly",
      },
      {
        id: "control-esp32",
        number: "2",
        title: "Block 2 — Control / ESP32",
        description: "DC-DC converter, ESP32 power supply, and common GND.",
        phaseLabel: "Planned",
        phaseTone: "planned",
        summary:
          "The control block will be responsible for correctly powering the ESP32 through the DC-DC converter, ensuring a common GND, and preparing the microcontroller for sensor reading, commands, and control logic.",
        components: [
          "ESP32",
          "LM2596 DC-DC converter",
          "+12V line",
          "GND line",
          "USB cable for testing/programming",
        ],
        workTitle: "What will be done",
        workItems: [
          "Connect the LM2596 to the main 12V line",
          "Adjust LM2596 output to 5V",
          "Power the ESP32",
          "Create common GND",
          "Test the ESP32 connection to the computer",
        ],
      },
      {
        id: "sensors",
        number: "3",
        title: "Block 3 — Sensors",
        description: "Selection, wiring, positioning, and sensor testing.",
        phaseLabel: "Planned",
        phaseTone: "planned",
        summary:
          "The sensor block will measure temperature and humidity in the protected area, ensuring reliable readings for the system's automatic logic.",
        components: [
          "DHT22 or SHT31",
          "ESP32",
          "Signal wires",
          "Pull-up resistor, if required",
        ],
        workTitle: "What will be done",
        workItems: [
          "Choose the final sensor",
          "Connect the sensor to the ESP32",
          "Position the sensor away from the heater",
          "Test readings in the serial monitor",
          "Validate the response when temperature rises",
        ],
        imageKey: "bloco3Sensores",
        imageAlt: "Block 3 sensor assembly",
      },
      {
        id: "heating-power",
        number: "4",
        title: "Block 4 — Heating / Power",
        description: "MOSFET/SSR, heater, safety, and testing.",
        phaseLabel: "Planned",
        phaseTone: "planned",
        summary:
          "The power block will switch the 12V heater on and off through a MOSFET or DC SSR without placing high current on the ESP32.",
        components: [
          "12V heater",
          "Logic-level MOSFET or DC SSR",
          "100Ω resistor",
          "10kΩ resistor",
          "Power cables",
          "12V battery",
        ],
        workTitle: "What will be done",
        workItems: [
          "Calculate heater current",
          "Ensure the heater never connects directly to the ESP32",
          "Implement the circuit with MOSFET or DC SSR",
          "Physically secure the heater",
          "Test the heater for 5 seconds",
        ],
      },
      {
        id: "integrated-prototype",
        number: "5",
        title: "Integrated Prototype",
        shortTitle: "Integration",
        description:
          "Final draft of the connections between energy, control, sensors, and heating.",
        phaseLabel: "In progress",
        phaseTone: "current",
        isCentral: true,
        summary:
          "The integrated prototype represents the final physical draft of the HEATSPOT OFF-GRID system, bringing together the four main blocks: energy, control, sensors, and heating. This arrangement makes it possible to visualize the planned connections before the final assembly inside the enclosure.",
        components: [
          "50W solar panel",
          "Solar controller",
          "12V battery",
          "LM2596 DC-DC converter",
          "ESP32",
          "Temperature sensors",
          "MOSFET/SSR",
          "12V heater",
        ],
        workTitle: "What it represents",
        workItems: [
          "Physical integration of the four blocks",
          "Visual validation of the connections before final assembly",
          "Organization of the prototype components",
          "Preparation for integrated testing",
        ],
        imageKey: "prototypeDraft",
        imageAlt: "Final draft of the integrated prototype",
      },
    ],
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
