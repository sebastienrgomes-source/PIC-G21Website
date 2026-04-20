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
    phaseLabel: "En finalisation",
    phaseTone: "current",
    current: true,
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
    phaseLabel: "Planifié",
    phaseTone: "planned",
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
    summary: [
      "Au cours d'une phase initiale du projet, un effort de contact a été réalisé auprès d'entreprises potentiellement intéressées par la solution développée par l'équipe, dans le but de valider la pertinence du produit et de mieux comprendre les exigences du marché.",
      "Plusieurs secteurs pertinents ont été identifiés, avec un accent particulier sur l'agriculture, notamment la production en serre et l'apiculture. Au total, plus de 50 entreprises ont été contactées, dont des producteurs de différentes cultures (comme les fraises, tomates et autres cultures en serre) et des apiculteurs.",
      "De cet ensemble, seules 5 entreprises ont répondu en manifestant leur disponibilité à analyser la proposition. Cependant, la majorité a indiqué ne pas avoir de besoin direct pour la solution, soit parce qu'elles opèrent dans des serres ouvertes, disposent déjà de systèmes de contrôle thermique adéquats, ou ne considèrent pas le problème comme critique dans leur contexte spécifique.",
      "Malgré cela, deux entreprises se sont distinguées par leur intérêt pour le concept, notamment pour des applications à plus grande échelle. Ces interactions ont été particulièrement précieuses car elles ont permis de recueillir des retours techniques importants. Il a notamment été suggéré qu'une approche plus adaptée pourrait passer par des systèmes garantissant le maintien d'une température minimale constante, plutôt que des solutions axées sur l'atteinte de températures élevées.",
      "Ce processus de contact s'est révélé fondamental pour redéfinir le problème et aligner la solution avec les besoins réels du marché, renforçant l'importance d'une approche orientée vers la stabilité thermique et l'efficacité énergétique dans les contextes agricoles.",
    ],
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
    id: "firmware",
    step: "5",
    title: "Firmware",
    subtitle: "Développement embarqué",
    phaseLabel: "Planifié",
    phaseTone: "planned",
    current: false,
    details: [
      "Implémentation de la logique de contrôle sur ESP32.",
      "Lecture des capteurs, structure de télémétrie et règles de seuil.",
      "Stratégie de gestion d'énergie pour fonctionnement autonome.",
    ],
    partners: ["Équipe HeatSpot", "Mentors Embarqué"],
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
