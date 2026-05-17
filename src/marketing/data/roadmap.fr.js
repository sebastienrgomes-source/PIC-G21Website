// ─── INSTRUCTIONS DE PERSONNALISATION ────────────────────────────────────
//
// IMAGE DU PROTOTYPE (étape 2 — Matériel):
//   1. Placez l'image dans src/marketing/assets/prototype-idea.png
//   2. Décommentez l'import ci-dessous
//   3. Remplacez `prototypeImage: null` par `prototypeImage: prototypeIdea`
//
// import prototypeIdea from "../assets/prototype-idea.png";
//
// LOGOS DES ENTREPRISES (étapes 3 et 4):
//   1. Placez chaque logo dans src/marketing/assets/logos/
//   2. Importez chacun (exemple): import company1Logo from "../assets/logos/company1.png";
//   3. Remplacez le `logo: null` correspondant par l'import
//
// ──────────────────────────────────────────────────────────────────────────

export const roadmapFrMilestones = [
  {
    id: "requirements",
    step: "1",
    title: "Exigences",
    subtitle: "Définition et périmètre",
    phaseLabel: "Terminé",
    phaseTone: "done",
    current: false,
    details: [
      "Finalisation des exigences fonctionnelles et techniques du prototype.",
      "Priorisation des cas d'usage pour le fonctionnement à distance et basse température.",
      "Définition des critères d'acceptation pour les phases suivantes.",
    ],
    partners: ["Équipe HeatSpot", "Encadrants IST", "Parties prenantes"],
  },
  {
    id: "hardware",
    step: "2",
    title: "Matériel",
    subtitle: "Conception et assemblage",
    phaseLabel: "Terminé",
    phaseTone: "done",
    current: false,
    // TODO: remplacer null par l'import de l'image du prototype (voir instructions ci-dessus)
    prototypeImage: null,
    details: [
      "Schéma électrique pour l'intégration panneau, batterie et contrôleur.",
      "Assemblage mécanique du boîtier et du module de chauffage.",
      "Vérifications initiales en laboratoire pour sécurité et comportement thermique.",
    ],
    partners: ["Équipe HeatSpot", "Laboratoire d'Électronique"],
  },
  {
    id: "companies-contacted",
    step: "3",
    title: "Entreprises Contactées",
    subtitle: "Contacts et retours sectoriels",
    phaseLabel: "Terminé",
    phaseTone: "done",
    current: false,
    outreach: {
      stats: [
        { value: "50+", label: "entreprises contactées" },
        { value: "5", label: "ont répondu" },
        { value: "2", label: "intérêt réel" },
      ],
      insights: [
        "Secteurs ciblés : production en serre (fraises, tomates) et apiculture.",
        "Retour clé : maintenir une température minimale constante plutôt qu'atteindre des températures élevées.",
        "Résultat : problème redéfini avec un focus sur la stabilité thermique et l'efficacité énergétique.",
      ],
    },
  },
  {
    id: "zoom-meeting",
    step: "4",
    title: "Réunion Zoom",
    subtitle: "The Summer Berry Company Portugal, S.A.",
    phaseLabel: "Terminé",
    phaseTone: "done",
    current: false,
    details: [
      "Session de validation directe avec une entreprise du secteur agro-industriel.",
      "Discussion sur l'application pratique et les besoins réels sur le terrain.",
      "Évaluation de la pertinence et de l'adéquation de la solution HeatSpot.",
    ],
    partners: ["Équipe HeatSpot", "The Summer Berry Company Portugal, S.A."],
    zoomCompany: {
      name: "The Summer Berry Company Portugal, S.A.",
      logo: null,
      feedback: "summerBerryFeedback",
      interactionType: "Réunion via Zoom",
    },
  },
  {
    id: "prototype-build",
    step: "5",
    title: "Construction du Prototype",
    subtitle: "Assemblage modulaire par blocs",
    phaseLabel: "En cours",
    phaseTone: "current",
    current: true,
    details: [
      "Assemblage du bloc énergie : panneau solaire, contrôleur, batterie et distribution 12V.",
      "Préparation de l'intégration de l'ESP32 avec alimentation régulée et GND commun.",
      "Planification du câblage et de la validation des capteurs de température.",
      "Planification de l'étage de puissance avec MOSFET/SSR et chauffage 12V.",
    ],
    partners: ["Équipe HeatSpot", "Mentors Embarqués", "Équipe Hardware"],
    prototypeBlocks: [
      {
        id: "energy",
        number: "1",
        title: "Bloc 1 — Énergie",
        description: "Panneau solaire, contrôleur, batterie, fusible et distribution 12V.",
        phaseLabel: "Terminé",
        phaseTone: "done",
        summary:
          "Le bloc énergie intègre la source solaire, le contrôleur de charge, la batterie 12V, la protection par fusible et la ligne principale de distribution +12V/GND. Ce bloc garantit que le système peut fonctionner de manière autonome et alimenter les autres modules.",
        components: [
          "Panneau solaire 50W",
          "Contrôleur solaire MPPT/PWM",
          "Batterie 12V",
          "Fusible 10A",
          "Barre +12V",
          "Barre GND",
          "Câbles de puissance",
        ],
        workTitle: "Ce qui a été fait",
        workItems: [
          "Organisation initiale des composants dans le boîtier",
          "Identification des bornes PV, BAT et LOAD",
          "Raccordement de la batterie au contrôleur avec fusible",
          "Vérification de la tension de la batterie au multimètre",
          "Raccordement du panneau solaire au contrôleur",
          "Création de la ligne principale +12V/GND",
          "Test du Bloc 1 terminé",
        ],
        imageKey: "bloco1Energia",
        imageAlt: "Assemblage du Bloc 1 — Énergie",
      },
      {
        id: "control-esp32",
        number: "2",
        title: "Bloc 2 — Contrôle / ESP32",
        description: "Convertisseur DC-DC, alimentation de l'ESP32 et GND commun.",
        phaseLabel: "Planifié",
        phaseTone: "planned",
        summary:
          "Le bloc de contrôle sera chargé d'alimenter correctement l'ESP32 via le convertisseur DC-DC, d'assurer le GND commun et de préparer le microcontrôleur pour la lecture des capteurs, les commandes et la logique de contrôle.",
        components: [
          "ESP32",
          "Convertisseur DC-DC LM2596",
          "Ligne +12V",
          "Ligne GND",
          "Câble USB pour test/programmation",
        ],
        workTitle: "Ce qui sera fait",
        workItems: [
          "Relier le LM2596 à la ligne principale 12V",
          "Régler la sortie du LM2596 à 5V",
          "Alimenter l'ESP32",
          "Créer le GND commun",
          "Tester la connexion de l'ESP32 à l'ordinateur",
        ],
      },
      {
        id: "sensors",
        number: "3",
        title: "Bloc 3 — Capteurs",
        description: "Choix, câblage, positionnement et test des capteurs.",
        phaseLabel: "Planifié",
        phaseTone: "planned",
        summary:
          "Le bloc capteurs mesurera la température et l'humidité de la zone protégée afin de garantir des lectures fiables pour la logique automatique du système.",
        components: [
          "DHT22 ou SHT31",
          "ESP32",
          "Câbles de signal",
          "Résistance de pull-up, si nécessaire",
        ],
        workTitle: "Ce qui sera fait",
        workItems: [
          "Choisir le capteur final",
          "Relier le capteur à l'ESP32",
          "Positionner le capteur loin du chauffage",
          "Tester les mesures dans le moniteur série",
          "Valider la réponse lorsque la température augmente",
        ],
        imageKey: "bloco3Sensores",
        imageAlt: "Assemblage du Bloc 3 — Capteurs",
      },
      {
        id: "heating-power",
        number: "4",
        title: "Bloc 4 — Chauffage / Puissance",
        description: "MOSFET/SSR, chauffage, sécurité et tests.",
        phaseLabel: "Planifié",
        phaseTone: "planned",
        summary:
          "Le bloc de puissance sera chargé d'activer et de désactiver le chauffage 12V via un MOSFET ou un SSR DC, sans faire passer de courant élevé par l'ESP32.",
        components: [
          "Chauffage 12V",
          "MOSFET logic-level ou SSR DC",
          "Résistance 100Ω",
          "Résistance 10kΩ",
          "Câbles de puissance",
          "Batterie 12V",
        ],
        workTitle: "Ce qui sera fait",
        workItems: [
          "Calculer le courant du chauffage",
          "Garantir que le chauffage ne se connecte jamais directement à l'ESP32",
          "Mettre en œuvre le circuit avec MOSFET ou SSR DC",
          "Fixer physiquement le chauffage",
          "Tester le chauffage pendant 5 secondes",
        ],
      },
      {
        id: "integrated-prototype",
        number: "5",
        title: "Prototype Intégré",
        shortTitle: "Intégration",
        description:
          "Ébauche finale des liaisons entre énergie, contrôle, capteurs et chauffage.",
        phaseLabel: "En cours",
        phaseTone: "current",
        isCentral: true,
        summary:
          "Le prototype intégré représente l'ébauche physique finale du système HEATSPOT OFF-GRID, en réunissant les quatre blocs principaux : énergie, contrôle, capteurs et chauffage. Cette disposition permet de visualiser les liaisons prévues avant l'assemblage définitif dans le boîtier.",
        components: [
          "Panneau solaire 50W",
          "Contrôleur solaire",
          "Batterie 12V",
          "Convertisseur DC-DC LM2596",
          "ESP32",
          "Capteurs de température",
          "MOSFET/SSR",
          "Chauffage 12V",
        ],
        workTitle: "Ce que cela représente",
        workItems: [
          "Intégration physique des quatre blocs",
          "Validation visuelle des liaisons avant l'assemblage final",
          "Organisation des composants dans le prototype",
          "Préparation aux tests intégrés",
        ],
        imageKey: "prototypeDraft",
        imageAlt: "Ébauche finale du prototype intégré",
      },
    ],
  },
  {
    id: "module-testing",
    step: "6",
    title: "Tests Modulaires",
    subtitle: "Validation par composant",
    phaseLabel: "Planifié",
    phaseTone: "planned",
    current: false,
    details: [
      "Test de chaque sous-système indépendamment avant intégration.",
      "Vérification de la réponse thermique sous conditions contrôlées.",
      "Enregistrement des problèmes et corrections par composant.",
    ],
    partners: ["Équipe HeatSpot", "Support Laboratoire"],
  },
  {
    id: "system-validation",
    step: "7",
    title: "Validation Système",
    subtitle: "Tests intégrés",
    phaseLabel: "Planifié",
    phaseTone: "planned",
    current: false,
    details: [
      "Exécution intégrée matériel et firmware comme système complet.",
      "Scénarios de stress pour continuité et autonomie énergétique.",
      "Validation par rapport aux critères finaux d'acceptation.",
    ],
    partners: ["Équipe HeatSpot", "Jury Académique"],
  },
  {
    id: "electroday",
    step: "8",
    title: "ElectroDay",
    subtitle: "Démonstration finale du prototype",
    phaseLabel: "Planifié",
    phaseTone: "planned",
    current: false,
    details: [
      "Préparation du setup final et script de démonstration.",
      "Consolidation des résultats techniques et preuves.",
      "Présentation publique du prototype et des prochaines étapes.",
    ],
    partners: ["Équipe HeatSpot", "Audience ElectroDay"],
  },
];
