import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export async function generateFrameworkDocxBuffer(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'FRAMEWORK APPLICATION',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Relatório de Planejamento, CRUD Dinâmico e Evolução do Portal Synthetica (Entrega 2)',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Desafio: ', bold: true }),
              new TextRun('CRUD Dinâmico de Conteúdos do Portal Synthetica + Desenvolvimento das páginas\n'),
              new TextRun({ text: 'Disciplina: ', bold: true }),
              new TextRun('Framework Application\n'),
              new TextRun({ text: 'Alinhamento Interdisciplinar: ', bold: true }),
              new TextRun('MVP de Digital Product & Business e Gamificação com Game Dev & Gamification\n'),
              new TextRun({ text: 'Integrantes: ', bold: true }),
              new TextRun('[Preencher nomes e matrículas dos integrantes do grupo]\n'),
              new TextRun({ text: 'Data: ', bold: true }),
              new TextRun('Outubro de 2026'),
            ],
            spacing: { after: 400 },
          }),

          // Seção 1
          new Paragraph({
            text: '1. CONTEXTO DO PROJETO & ALINHAMENTO COM DIGITAL PRODUCT & BUSINESS E GAME DEV & GAMIFICATION',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            text: 'O Portal Synthetica é a plataforma web central responsável por catalogar, preservar e gerenciar o acervo de cultura digital, artes cibernéticas e arqueologia tecnológica compreendido entre 1980 e os dias atuais.',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Em estreita consonância com o MVP desenvolvido na disciplina de Digital Product & Business e as metodologias de design lúdico de Game Dev & Gamification, o portal web foi planejado para transcender uma galeria estática, transformando-se em um produto digital dinâmico, auto-sustentável e altamente engajador. Os conteúdos gerenciados acompanham o modelo de negócio e a experiência do usuário através de:',
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Gestão dinâmica de registros: ', bold: true }),
              new TextRun('CRUD completo de obras do acervo com formulário estruturado e persistência local versionada (chave synthetica_acervo_items_v8).'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Camada de monetização e sustentabilidade: ', bold: true }),
              new TextRun('Planos de assinatura (Freemium, Indie e Archival VIP), seletor de ciclo Mensal/Anual (-20% OFF) e checkout interativo com simulação de Pix e Cartão de Crédito.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Motor de busca e filtros combinados: ', bold: true }),
              new TextRun('5 disciplinas culturais (Cinema, Música, Dança, Artes Plásticas e Eletrônicos) cruzadas com 5 Eras Tecnológicas (1980s Aurora, 1990s Multimídia, 2000s Digital, 2010s Redes e 2020s Hoje).\n'),
              new TextRun({ text: '• Gamificação Cultural (Game Dev & Gamification — Baú de Memórias dos Anos 80): ', bold: true }),
              new TextRun('Concebida a partir dos conceitos de Core Game Loop, gatilhos de engajamento e retenção da disciplina de Game Dev & Gamification. Consiste em uma mecânica imersiva de exploração investigativa do acervo com busca e resgate de 6 fragmentos históricos analógicos e digitais (Fita Cassete de Cromo, Disquete 3.5", Cartucho Game Boy, Cabo Link, etc.) dispersos nas obras da década de 1980, desbloqueando a lendária Chave de 1994 e estimulando o engajamento e a permanência do usuário na plataforma.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 2
          new Paragraph({
            text: '2. PLANEJAMENTO: COMO ESTAVA O SISTEMA NA PRIMEIRA ENTREGA',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            text: 'Na primeira entrega, o Portal Synthetica encontrava-se em estágio de protótipo preliminar:',
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Dados Estáticos: ', bold: true }),
              new TextRun('Os registros estavam hardcoded em constantes locais na memória, impossibilitando qualquer operação de adição, edição ou exclusão de conteúdos em tempo de execução.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Telas Incompletas: ', bold: true }),
              new TextRun('Não havia integração com as regras de negócio de Digital Product & Business (ausência total de planos de assinatura e fluxo de checkout).'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Inconsistência Iconográfica: ', bold: true }),
              new TextRun('O acervo utilizava fotos genéricas de bancos de imagens gratuitas, que não guardavam verossimilhança com as obras históricas reais.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Filtros Desajustados: ', bold: true }),
              new TextRun('Filtros temporais que resultavam em telas vazias por ausência de itens cadastrados.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '5. Ausência de Gamificação e Mecânicas de Retenção: ', bold: true }),
              new TextRun('O portal funcionava apenas como uma vitrine estática e passiva, sem nenhum estímulo à exploração investigativa do acervo histórico ou interação lúdica com as obras.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 3
          new Paragraph({
            text: '3. DECISÕES IMPLEMENTADAS A PARTIR DO PRIMEIRO FEEDBACK',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 1 — CRUD Dinâmico Completo com Validação e Persistência: ', bold: true }),
              new TextRun('Implementação de estado centralizado com persistência local versionada. Usuários e curadores podem adicionar novas obras através de modal estruturado, curtir, favoritar e comentar com moderação em tempo real.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 2 — Substituição por Imagens Documentais Canônicas: ', bold: true }),
              new TextRun('Migração de 14 registros com imagens genéricas para fotografias, pôsteres e capturas originais da Wikipédia / Wikimedia Commons com CDN de alta disponibilidade, incluindo Blade Runner, Akira, The Matrix, Her, Kraftwerk Computer World, Chico Science, Björk, Daft Punk, Macintosh 128K, Game Boy e PlayStation 1, amparados por camada de fallback resiliente.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 3 — Módulo de Assinaturas e Checkout (Digital Product & Business): ', bold: true }),
              new TextRun('Criação da seção CulturalStoreSection e do SubscriptionModal com alternância de ciclo de faturamento mensal e anual (-20% de desconto), aplicação de cupom promocional cultural (MEMORIA10) e simulação de pagamento via Pix ou Cartão.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 4 — Motor de Busca e Filtros Combinados: ', bold: true }),
              new TextRun('Componente SectionDecadeFilterBar com contadores reativos de obras por disciplina e década, eliminando cenários de tela vazia e melhorando a usabilidade.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 5 — Implementação da Gamificação com o Baú de Memórias de 1984: ', bold: true }),
              new TextRun('Para transformar a navegação em uma experiência ativa e engajante, desenvolvemos a mecânica do Baú de Memórias. Ao inspecionar obras dos anos 80 (Michael Jackson Motown 25, Kraftwerk Computer World, Macintosh 128K, Game Boy, etc.), o usuário localiza e resgata 6 fragmentos nostálgicos da cultura analógica/digital. Ao completar os 6 artefatos, o usuário forja a mítica Chave de 1994, com feedback visual háptico, contador de progresso em tempo real, animações retro e persistência dos colecionáveis.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 4
          new Paragraph({
            text: '4. DECISÕES DE DESENVOLVIMENTO NAS DEMAIS DISCIPLINAS/ÁREAS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Alinhamento com Mobile Hybrid Development: ', bold: true }),
              new TextRun('Unificação das tipagens TypeScript dos itens do acervo, tags visuais e metadados históricos. Compartilhamento da mesma narrativa de gamificação do Baú de Memórias dos Anos 80 entre a web e o app mobile, além das diretrizes de Acessibilidade (alto contraste, modos claro/escuro e síntese de voz para leitura de tela).'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Alinhamento com Game Dev & Gamification: ', bold: true }),
              new TextRun('A gamificação do Baú de Memórias dos Anos 80 está diretamente vinculada aos fundamentos da disciplina de Game Dev & Gamification. Foram aplicados os conceitos de Core Game Loop (exploração -> descoberta -> coleta -> recompensa), gatilhos de engajamento lúdico, balanceamento de raridade dos 6 fragmentos históricos e sensação de conquista ao forjar a lendária Chave de 1994, promovendo State of Flow e elevando significativamente a retenção e o tempo de sessão dos usuários no portal.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Alinhamento com Digital Product & Business: ', bold: true }),
              new TextRun('Implementação da política de cancelamento transparente em 1 clique e destinação de 15% das assinaturas para fundos comunitários de restauração de mídias analógicas.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 5
          new Paragraph({
            text: '5. ARQUITETURA TÉCNICA DO PORTAL (FRONT & BACK)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Frontend: ', bold: true }),
              new TextRun('React 19 + TypeScript + Vite + Tailwind CSS + Motion.\n'),
              new TextRun({ text: '• Backend & Servidor: ', bold: true }),
              new TextRun('Node.js / Express integrado (server.ts) com rotas de API e proxy.\n'),
              new TextRun({ text: '• Sistema de Gamificação: ', bold: true }),
              new TextRun('Módulo modular memoriaAnos80.ts para verificação de fragmentos, controle de estado reativo e modal interativo MemoryChestModal com animações e efeitos sonoros retro.\n'),
              new TextRun({ text: '• Controle de Estado & Persistência: ', bold: true }),
              new TextRun('React Hooks e Context API com persistência local resiliente no localStorage.\n'),
              new TextRun({ text: '• Acessibilidade: ', bold: true }),
              new TextRun('AccessibilityContext com suporte a síntese de voz nativa (Web Speech API), redução de movimento, alto contraste e tamanho tipográfico ajustável.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 6
          new Paragraph({
            text: '6. ENTREGÁVEIS OBRIGATÓRIOS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Link do portal hospedado: ', bold: true }),
              new TextRun('https://ais-dev-q5rp24jwojiqraqz2rm6wu-344740626637.us-west2.run.app\n'),
              new TextRun({ text: '• Link para o GitHub: ', bold: true }),
              new TextRun('[Inserir link do repositório GitHub do time]\n'),
              new TextRun({ text: '• Link do vídeo-pitch (2 a 3 minutos): ', bold: true }),
              new TextRun('[Inserir link do vídeo no YouTube ou Google Drive]'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 7
          new Paragraph({
            text: '7. ROTEIRO DO VÍDEO-PITCH (2 A 3 MINUTOS)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '[0:00 - 0:30] Abertura:\n', bold: true }),
              new TextRun('"Olá! Somos a equipe do Portal Synthetica. Apresentamos a segunda entrega da disciplina Framework Application, com o CRUD dinâmico completo, gamificação interativa e a evolução das páginas integradas ao MVP de Digital Product & Business."\n\n'),
              new TextRun({ text: '[0:30 - 1:10] Demonstração do CRUD e Filtros:\n', bold: true }),
              new TextRun('"Evoluímos o sistema da primeira entrega, onde os dados eram estáticos. Agora, o portal conta com gerenciamento completo de obras: criação, edição, comentários e curtidas com persistência. Integramos 21 obras canônicas com imagens oficiais da Wikipédia e desenvolvemos filtros multidimensionais por 5 disciplinas e 5 eras tecnológicas."\n\n'),
              new TextRun({ text: '[1:10 - 1:45] Gamificação — Ligada a Game Dev & Gamification:\n', bold: true }),
              new TextRun('"Em conexão direta com a disciplina de Game Dev & Gamification, implementamos o Baú de Memórias dos Anos 80. Aplicamos técnicas de Game Loop e engajamento: ao explorar o acervo, o usuário investiga e resgata fragmentos históricos como fitas cassete e disquetes 3.5, culminando no forjamento da Chave de 1994 com efeitos comemorativos, som e progresso persistido."\n\n'),
              new TextRun({ text: '[1:45 - 2:20] Assinaturas, Sustentabilidade e Acessibilidade:\n', bold: true }),
              new TextRun('"Em alinhamento direto com o modelo de negócios, desenvolvemos a área de planos de apoio cultural com planos mensais e anuais (-20% OFF), checkout com Pix e Cartão, além de acessibilidade completa com síntese de voz nativa."\n\n'),
              new TextRun({ text: '[2:20 - 2:45] Fechamento Técnico:\n', bold: true }),
              new TextRun('"Adotamos React 19 com TypeScript, Vite e Tailwind CSS. O projeto está versionado no GitHub e em produção na web. Muito obrigado!"'),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

export async function generateMobileDocxBuffer(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'MOBILE HYBRID DEVELOPMENT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Relatório de Planejamento e Mini App de Curadoria do Mundo Synthetica (Entrega 2)',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Desafio: ', bold: true }),
              new TextRun('Mini App de Curadoria de Conteúdos do Mundo Synthetica\n'),
              new TextRun({ text: 'Disciplina: ', bold: true }),
              new TextRun('Mobile Hybrid Development\n'),
              new TextRun({ text: 'Tecnologia: ', bold: true }),
              new TextRun('React Native / Expo Snack\n'),
              new TextRun({ text: 'Integrantes: ', bold: true }),
              new TextRun('[Preencher nomes e matrículas dos integrantes do grupo]\n'),
              new TextRun({ text: 'Data: ', bold: true }),
              new TextRun('Outubro de 2026'),
            ],
            spacing: { after: 400 },
          }),

          // Seção 1
          new Paragraph({
            text: '1. CONTEXTO DO PROJETO NO UNIVERSO SYNTHETICA',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            text: 'No universo do Portal Synthetica, os usuários exploram conteúdos personalizados sobre o impacto da tecnologia, da inteligência artificial e das mídias eletrônicas na sociedade contemporânea.',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'O desafio desta disciplina consiste em desenvolver um aplicativo mobile híbrido em React Native que funcione como um catálogo interativo de conteúdos, garantindo:',
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Navegação fluida: ', bold: true }),
              new TextRun('Por categorias culturais e décadas históricas.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Interação rica com cards: ', bold: true }),
              new TextRun('Favoritos, citações curatoriais e reprodução de áudio.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Exibição de detalhes em telas separadas: ', bold: true }),
              new TextRun('Padrão Stack Navigation oficial.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Acessibilidade e gamificação: ', bold: true }),
              new TextRun('Audiodescrição com expo-speech e Baú de Memórias dos anos 80.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 2
          new Paragraph({
            text: '2. PLANEJAMENTO: COMO ESTAVA O APP NA PRIMEIRA ENTREGA',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            text: 'Na primeira etapa, o aplicativo encontrava-se em estado preliminar:',
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '1. Arquitetura Monolítica de Tela Única: ', bold: true }),
              new TextRun('Todos os elementos eram apresentados na mesma view com rolagem contínua, sem uso de rotas declarativas ou navegação por pilha.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '2. Inconsistência no Catálogo: ', bold: true }),
              new TextRun('Existiam filtros com décadas que não possuíam obras correspondentes cadastradas, gerando telas vazias.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '3. Carência de Acessibilidade Mobile: ', bold: true }),
              new TextRun('Não havia controle sobre tamanho de texto nem integração com sintetizadores de voz para pessoas cegas ou com baixa acuidade visual.'),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '4. Falta de Gamificação e Retenção: ', bold: true }),
              new TextRun('O app funcionava apenas como um leitor passivo de cards, sem engajar o usuário no universo narrativo do Synthetica.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 3
          new Paragraph({
            text: '3. DECISÕES IMPLEMENTADAS A PARTIR DO PRIMEIRO FEEDBACK',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 1 — Navegação em Telas Separadas via React Navigation Stack: ', bold: true }),
              new TextRun('Implementação de fluxo com NavigationContainer e Stack.Navigator, separando a visualização geral (HomeScreen) da página com a ficha técnica aprofundada da obra (DetailScreen), provendo transições nativas, botão de retorno contextual e cabeçalho customizado.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 2 — Catálogo Canônico com 21 Obras e Filtros Eficientes: ', bold: true }),
              new TextRun('Sincronização completa com o acervo da plataforma web: 5 disciplinas (Dança, Música, Cinema, Artes e Eletrônicos) e 5 eras temporais (1980s até 2020s), assegurando que todo filtro aplicado exiba conteúdos válidos com imagens reais em CDN estável.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 3 — Módulo de Acessibilidade com Audiodescrição Nativa (expo-speech): ', bold: true }),
              new TextRun('Integração da biblioteca de síntese de voz (TTS) em português brasileiro com seletor de velocidade (0.75x a 1.5x) e audiodescrição de cada obra com 1 toque, além de modal de dimensionamento de fontes e alto contraste.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Decisão 4 — Gamificação com o Baú de Memórias de 1984: ', bold: true }),
              new TextRun('Criação de uma mecânica de caça a fragmentos históricos nas obras dos anos 80 (Fita Cassete de Cromo, Disquete 3.5", Cartucho Game Boy, Cabo Link, etc.). O usuário resgata os 6 itens ao inspecionar as obras e forja a lendária Chave de 1994, incentivando a exploração detalhada do catálogo.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 4
          new Paragraph({
            text: '4. DECISÕES DE DESENVOLVIMENTO NAS DEMAIS DISCIPLINAS/ÁREAS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Alinhamento com Framework Application (Portal Web): ', bold: true }),
              new TextRun('Manutenção da identidade visual através dos tokens oficiais: Verde Floresta Profundo (#153833), Rosa Neon (#EFAEC4), Verde Esmeralda (#2FD19E) e equivalência de metadados históricos.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Alinhamento com Game Dev & Gamification: ', bold: true }),
              new TextRun('A mecânica do Baú de Memórias dos Anos 80 foi estruturada com base nos conceitos da disciplina de Game Dev & Gamification, trazendo a busca investigativa de colecionáveis retrô, feedback sensorial no aplicativo e sensação de recompensa ao desbloquear a Chave de 1994.'),
            ],
            spacing: { after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Alinhamento com Digital Product & Business: ', bold: true }),
              new TextRun('Exibição de cards de adesão e status da assinatura do usuário (Plano Indie/VIP) diretamente no perfil mobile e topo da Home.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 5
          new Paragraph({
            text: '5. ARQUITETURA TÉCNICA MOBILE (REACT NATIVE)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Framework: ', bold: true }),
              new TextRun('React Native rodando no ecossistema Expo Snack.\n'),
              new TextRun({ text: '• Navegação: ', bold: true }),
              new TextRun('@react-navigation/native com @react-navigation/native-stack.\n'),
              new TextRun({ text: '• Estado Global: ', bold: true }),
              new TextRun('Context API (SyntheticaContext) para favoritos, preferências de acessibilidade e fragmentos do Baú.\n'),
              new TextRun({ text: '• Armazenamento Local: ', bold: true }),
              new TextRun('@react-native-async-storage/async-storage para persistência local.\n'),
              new TextRun({ text: '• Síntese de Fala: ', bold: true }),
              new TextRun('expo-speech configurado com voz nativa pt-BR.'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 6
          new Paragraph({
            text: '6. ENTREGÁVEIS OBRIGATÓRIOS',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '• Link do Snack: ', bold: true }),
              new TextRun('[Inserir link do seu Expo Snack]\n'),
              new TextRun({ text: '• Link do vídeo-pitch (2 a 3 minutos): ', bold: true }),
              new TextRun('[Inserir link do vídeo no YouTube ou Google Drive]'),
            ],
            spacing: { after: 240 },
          }),

          // Seção 7
          new Paragraph({
            text: '7. ROTEIRO DO VÍDEO-PITCH (2 A 3 MINUTOS)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: '[0:00 - 0:35] Introdução e Visão Geral:\n', bold: true }),
              new TextRun('"Olá! Somos a equipe do Synthetica Mobile. Apresentamos a segunda entrega da disciplina Mobile Hybrid Development, com o mini app de curadoria de conteúdos interativos construído em React Native no Expo Snack."\n\n'),
              new TextRun({ text: '[0:35 - 1:15] Demonstração do Catálogo e Telas Separadas:\n', bold: true }),
              new TextRun('"Em resposta ao primeiro feedback, que exigia telas separadas, implementamos navegação nativa por pilha entre a HomeScreen e a DetailScreen. O usuário pode filtrar o catálogo por disciplinas ou eras, interagir com os cards e acessar a ficha completa da obra com análise histórica e relevância no século XXI."\n\n'),
              new TextRun({ text: '[1:15 - 1:55] Acessibilidade e Audiodescrição por Voz:\n', bold: true }),
              new TextRun('"Integramos o pacote expo-speech para prover audiodescrição nativa das obras em português. Desenvolvemos também um modal completo de acessibilidade que permite ajustar o tamanho da fonte, alternar para alto contraste e controlar a velocidade da narração."\n\n'),
              new TextRun({ text: '[1:55 - 2:35] Baú de Memórias de 1984 e Conclusão:\n', bold: true }),
              new TextRun('"Para engajar o usuário no universo narrativo do Synthetica, criamos a gamificação do Baú de Memórias, onde fragmentos dos anos 80 são coletados nas telas de detalhe. O app possui persistência local com AsyncStorage e o código pode ser testado diretamente no link do Snack. Muito obrigado!"'),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
