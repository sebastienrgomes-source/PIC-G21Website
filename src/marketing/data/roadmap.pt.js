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
    phaseLabel: "Concluído",
    phaseTone: "done",
    current: false,
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
    phaseLabel: "Concluído",
    phaseTone: "done",
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
    outreach: {
      stats: [
        { value: "50+", label: "empresas contactadas" },
        { value: "5", label: "responderam à proposta" },
        { value: "2", label: "com interesse real" },
      ],
      insights: [
        "Setores abordados: produção em estufa (morango, tomate) e apicultura.",
        "Feedback técnico: manter temperatura mínima constante, não atingir temperaturas elevadas.",
        "Resultado: redefinição do problema com foco em estabilidade térmica e eficiência energética.",
      ],
    },
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
    id: "prototype-build",
    step: "5",
    title: "Construção do Protótipo",
    subtitle: "Montagem modular por blocos",
    phaseLabel: "Em andamento",
    phaseTone: "current",
    current: true,
    details: [
      "Montagem do bloco de energia: painel solar, controlador, bateria e distribuição 12V.",
      "Preparação da integração do ESP32 com alimentação regulada e GND comum.",
      "Planeamento da ligação e validação dos sensores de temperatura.",
      "Planeamento da etapa de potência com MOSFET/SSR e aquecedor 12V.",
    ],
    partners: ["Equipa HeatSpot", "Mentores de Embebidos", "Equipa de Hardware"],
    prototypeBlocks: [
      {
        id: "energy",
        number: "1",
        title: "Bloco 1 — Energia",
        description: "Painel solar, controlador, bateria, fusível e distribuição 12V.",
        phaseLabel: "Concluído",
        phaseTone: "done",
        summary:
          "O bloco de energia integra a fonte solar, o controlador de carga, a bateria de 12V, a proteção por fusível e a linha principal de distribuição +12V/GND. Este bloco garante que o sistema pode operar de forma autónoma e alimentar os restantes módulos.",
        components: [
          "Painel solar 50W",
          "Controlador solar MPPT/PWM",
          "Bateria 12V",
          "Fusível 10A",
          "Barramento +12V",
          "Barramento GND",
          "Cabos de potência",
        ],
        workTitle: "O que foi feito",
        workItems: [
          "Organização inicial dos componentes na caixa",
          "Identificação dos terminais PV, BAT e LOAD",
          "Ligação da bateria ao controlador com fusível",
          "Confirmação da tensão da bateria com multímetro",
          "Ligação do painel solar ao controlador",
          "Criação da linha principal +12V/GND",
          "Teste do Bloco 1 concluído",
        ],
        imageKey: "bloco1Energia",
        imageAlt: "Montagem do Bloco 1 — Energia",
      },
      {
        id: "control-esp32",
        number: "2",
        title: "Bloco 2 — Controlo / ESP32",
        description: "Conversor DC-DC, alimentação do ESP32 e GND comum.",
        phaseLabel: "Planeado",
        phaseTone: "planned",
        summary:
          "O bloco de controlo será responsável por alimentar corretamente o ESP32 através do conversor DC-DC, garantir o GND comum e preparar o microcontrolador para leitura de sensores, comandos e lógica de controlo.",
        components: [
          "ESP32",
          "Conversor DC-DC LM2596",
          "Linha +12V",
          "Linha GND",
          "Cabo USB para teste/programação",
        ],
        workTitle: "O que será feito",
        workItems: [
          "Ligar LM2596 à linha principal 12V",
          "Ajustar saída do LM2596 para 5V",
          "Alimentar ESP32",
          "Criar GND comum",
          "Testar ligação do ESP32 ao computador",
        ],
      },
      {
        id: "sensors",
        number: "3",
        title: "Bloco 3 — Sensores",
        description: "Escolha, ligação, posicionamento e teste dos sensores.",
        phaseLabel: "Planeado",
        phaseTone: "planned",
        summary:
          "O bloco de sensores será responsável por medir a temperatura e humidade da zona protegida, garantindo leituras fiáveis para a lógica automática do sistema.",
        components: [
          "DHT22 ou SHT31",
          "ESP32",
          "Cabos de sinal",
          "Resistência de pull-up, se necessária",
        ],
        workTitle: "O que será feito",
        workItems: [
          "Escolher o sensor final",
          "Ligar sensor ao ESP32",
          "Posicionar sensor afastado do aquecedor",
          "Testar leituras no monitor série",
          "Validar resposta quando a temperatura aumenta",
        ],
        imageKey: "bloco3Sensores",
        imageAlt: "Montagem do Bloco 3 — Sensores",
      },
      {
        id: "heating-power",
        number: "4",
        title: "Bloco 4 — Aquecimento / Potência",
        description: "MOSFET/SSR, aquecedor, segurança e testes.",
        phaseLabel: "Planeado",
        phaseTone: "planned",
        summary:
          "O bloco de potência será responsável por ligar e desligar o aquecedor de 12V através de MOSFET ou SSR DC, sem colocar corrente elevada no ESP32.",
        components: [
          "Aquecedor 12V",
          "MOSFET logic-level ou SSR DC",
          "Resistência 100Ω",
          "Resistência 10kΩ",
          "Cabos de potência",
          "Bateria 12V",
        ],
        workTitle: "O que será feito",
        workItems: [
          "Calcular corrente do aquecedor",
          "Garantir que o aquecedor nunca liga diretamente ao ESP32",
          "Implementar ligação com MOSFET ou SSR DC",
          "Fixar fisicamente o aquecedor",
          "Testar aquecedor durante 5 segundos",
        ],
      },
      {
        id: "integrated-prototype",
        number: "5",
        title: "Protótipo Integrado",
        shortTitle: "Integração",
        description:
          "Rascunho final das ligações entre energia, controlo, sensores e aquecimento.",
        phaseLabel: "Em andamento",
        phaseTone: "current",
        isCentral: true,
        summary:
          "O protótipo integrado representa o rascunho físico final do sistema HEATSPOT OFF-GRID, reunindo os quatro blocos principais: energia, controlo, sensores e aquecimento. Esta disposição permite visualizar as ligações previstas antes da montagem definitiva dentro da caixa.",
        components: [
          "Painel solar 50W",
          "Controlador solar",
          "Bateria 12V",
          "Conversor DC-DC LM2596",
          "ESP32",
          "Sensores de temperatura",
          "MOSFET/SSR",
          "Aquecedor 12V",
        ],
        workTitle: "O que representa",
        workItems: [
          "Integração física dos quatro blocos",
          "Validação visual das ligações antes da montagem final",
          "Organização dos componentes no protótipo",
          "Preparação para testes integrados",
        ],
        imageKey: "prototypeDraft",
        imageAlt: "Rascunho final do protótipo integrado",
      },
    ],
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
