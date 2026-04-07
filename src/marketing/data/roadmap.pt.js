// ─── INSTRUÇÕES DE PERSONALIZAÇÃO ─────────────────────────────────────────
//
// IMAGEM DO PROTÓTIPO (ponto 2 — Hardware):
//   1. Coloca a imagem em src/marketing/assets/prototype-idea.png
//   2. Descomenta a linha de import abaixo
//   3. Substitui `prototypeImage: null` por `prototypeImage: prototypeIdea`
//
// import prototypeIdea from "../assets/prototype-idea.png";
//
// LOGOS DAS EMPRESAS (pontos 3 e 4):
//   1. Coloca cada logo em src/marketing/assets/logos/
//   2. Importa cada um (exemplo): import company1Logo from "../assets/logos/company1.png";
//   3. Substitui o `logo: null` correspondente pelo import
//
// ──────────────────────────────────────────────────────────────────────────

export const roadmapPtMilestones = [
  {
    id: "requirements",
    step: "1",
    title: "Requisitos",
    subtitle: "Definição e âmbito",
    phaseLabel: "A finalizar",
    phaseTone: "current",
    current: true,
    details: [
      "Fecho dos requisitos funcionais e técnicos do protótipo.",
      "Priorização dos casos de uso para operação remota e em baixas temperaturas.",
      "Definição dos critérios de aceitação para as próximas fases.",
    ],
    partners: ["Equipa HeatSpot", "Orientadores IST", "Stakeholders do projeto"],
  },
  {
    id: "hardware",
    step: "2",
    title: "Hardware",
    subtitle: "Desenho e montagem",
    phaseLabel: "Planeado",
    phaseTone: "planned",
    current: false,
    // TODO: substituir null pelo import da imagem do protótipo (ver instruções no topo)
    prototypeImage: null,
    details: [
      "Layout elétrico para integração de painel, bateria e controlador.",
      "Montagem mecânica da caixa e do módulo de aquecimento.",
      "Testes iniciais de bancada para segurança e comportamento térmico.",
    ],
    partners: ["Equipa HeatSpot", "Laboratório de Eletrónica"],
  },
  {
    id: "companies-contacted",
    step: "3",
    title: "Empresas Contactadas",
    subtitle: "Contactos e feedback do setor",
    phaseLabel: "Concluído",
    phaseTone: "done",
    current: false,
    details: [
      "5 empresas foram contactadas para validação inicial do conceito.",
      "Recolha de feedback técnico e comercial do setor agro-industrial.",
      "Identificação de necessidades reais e interesse comercial na solução.",
    ],
    partners: ["Equipa HeatSpot", "Setor Agro-industrial"],
    // Substitui logo: null pelo import do logo de cada empresa (ver instruções no topo)
    // Substitui o texto de feedback pelo conteúdo real recebido
    companies: [
      {
        name: "company1Name",
        logo: null,           // TODO: import company1Logo from "../assets/logos/company1.png"
        feedback: "company1Feedback",
        interactionType: "Feedback por email",
      },
      {
        name: "company2Name",
        logo: null,           // TODO: import company2Logo from "../assets/logos/company2.png"
        feedback: "company2Feedback",
        interactionType: "Feedback por email",
      },
      {
        name: "company3Name",
        logo: null,           // TODO: import company3Logo from "../assets/logos/company3.png"
        feedback: "company3Feedback",
        interactionType: "Feedback por email",
      },
      {
        name: "company4Name",
        logo: null,           // TODO: import company4Logo from "../assets/logos/company4.png"
        feedback: "company4Feedback",
        interactionType: "Feedback por email",
      },
      {
        name: "company5Name",
        logo: null,           // TODO: import company5Logo from "../assets/logos/company5.png"
        feedback: "company5Feedback",
        interactionType: "Feedback por email",
      },
    ],
  },
  {
    id: "zoom-meeting",
    step: "4",
    title: "Reunião Zoom",
    subtitle: "The Summer Berry Company Portugal, S.A.",
    phaseLabel: "Concluído",
    phaseTone: "done",
    current: false,
    details: [
      "Sessão de validação direta com empresa do setor agro-industrial.",
      "Discussão sobre aplicação prática e necessidades reais em campo.",
      "Avaliação da relevância e adequação da solução HeatSpot.",
    ],
    partners: ["Equipa HeatSpot", "The Summer Berry Company Portugal, S.A."],
    zoomCompany: {
      name: "The Summer Berry Company Portugal, S.A.",
      logo: null,             // TODO: import summerBerryLogo from "../assets/logos/summer-berry.png"
      feedback: "summerBerryFeedback",
      interactionType: "Reunião via Zoom",
    },
  },
  {
    id: "firmware",
    step: "5",
    title: "Firmware",
    subtitle: "Desenvolvimento embebido",
    phaseLabel: "Planeado",
    phaseTone: "planned",
    current: false,
    details: [
      "Implementação da lógica de controlo no ESP32.",
      "Leitura de sensores, estrutura de telemetria e regras de limiar.",
      "Estratégia de gestão de energia para operação autónoma.",
    ],
    partners: ["Equipa HeatSpot", "Mentores de Embebidos"],
  },
  {
    id: "module-testing",
    step: "6",
    title: "Testes Modulares",
    subtitle: "Validação por componente",
    phaseLabel: "Planeado",
    phaseTone: "planned",
    current: false,
    details: [
      "Teste de cada subsistema de forma independente antes da integração.",
      "Verificação da resposta térmica em condições controladas.",
      "Registo de problemas e correções por componente.",
    ],
    partners: ["Equipa HeatSpot", "Apoio de Laboratório"],
  },
  {
    id: "system-validation",
    step: "7",
    title: "Validação do Sistema",
    subtitle: "Teste integrado",
    phaseLabel: "Planeado",
    phaseTone: "planned",
    current: false,
    details: [
      "Execução integrada de hardware e firmware como sistema completo.",
      "Cenários de stress para continuidade e autonomia energética.",
      "Validação face aos critérios finais de aceitação.",
    ],
    partners: ["Equipa HeatSpot", "Júri Académico"],
  },
  {
    id: "electroday",
    step: "8",
    title: "ElectroDay",
    subtitle: "Demonstração final do protótipo",
    phaseLabel: "Planeado",
    phaseTone: "planned",
    current: false,
    details: [
      "Preparação do setup final e guião de demonstração.",
      "Empacotamento dos resultados técnicos e evidências.",
      "Apresentação pública do protótipo e dos próximos passos.",
    ],
    partners: ["Equipa HeatSpot", "Público ElectroDay"],
  },
];
