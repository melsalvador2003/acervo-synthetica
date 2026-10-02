export interface AcademicDocContent {
  id: string;
  title: string;
  discipline: string;
  subtitle: string;
  filename: string;
  plainText: string;
}

export const ACADEMIC_DOC_FRAMEWORK: AcademicDocContent = {
  id: 'doc-framework-application',
  title: 'FRAMEWORK APPLICATION — Relatório de Planejamento e CRUD Dinâmico (Portal Synthetica)',
  discipline: 'Framework Application',
  subtitle: 'CRUD Dinâmico de Conteúdos do Portal Synthetica + Desenvolvimento das Páginas',
  filename: 'FRAMEWORK_APPLICATION_Synthetica_Entrega_2.docx',
  plainText: `FRAMEWORK APPLICATION
Relatório de Planejamento, CRUD Dinâmico e Evolução do Portal Synthetica (Entrega 2)

Desafio: CRUD Dinâmico de Conteúdos do Portal Synthetica + Desenvolvimento das páginas
Disciplina: Framework Application
Alinhamento Institucional: MVP da disciplina de Digital Product & Business
Times de até 5 integrantes
Integrantes: [Preencher nomes e matrículas dos integrantes]
Data de Entrega: Outubro de 2026

================================================================================
1. CONTEXTO DO PROJETO & ALINHAMENTO COM DIGITAL PRODUCT & BUSINESS
================================================================================
O Portal Synthetica é a plataforma web central responsável por catalogar, preservar e gerenciar o acervo de cultura digital, artes cibernéticas e arqueologia tecnológica compreendido entre 1980 e os dias atuais.

Em estreita consonância com o MVP desenvolvido na disciplina de Digital Product & Business, o portal web foi planejado para transcender uma galeria estática, transformando-se em um produto digital dinâmico e auto-sustentável. Os conteúdos gerenciados acompanham o modelo de negócio da plataforma através de:
- Gestão dinâmica de registros (CRUD completo de obras do acervo).
- Camada de monetização e sustentabilidade com planos de assinatura (Freemium, Indie e Archival VIP), seletor de faturamento Mensal/Anual (-20% OFF) e checkout com opções de pagamento via Pix e Cartão.
- Mecanismo multidimensional de busca e navegação por 5 disciplinas culturais (Cinema, Música, Dança, Artes Plásticas e Eletrônicos) e 5 Eras Tecnológicas (1980s Aurora do Silício, 1990s Multimídia & Web, 2000s Digital & Mobile, 2010s Redes & IA, 2020s Metaverso & Hoje).

================================================================================
2. PLANEJAMENTO: COMO ESTAVA O SISTEMA NA PRIMEIRA ENTREGA
================================================================================
Na primeira entrega, o Portal Synthetica encontrava-se em estágio de protótipo conceitual:
1. Dados Estáticos: Os registros das obras estavam hardcoded em constantes locais na memória, impossibilitando qualquer operação de adição, edição ou exclusão de conteúdos em tempo de execução.
2. Páginas e Telas Incompletas: Não havia integração com as regras de negócio de Digital Product & Business (ausência total da página/modal de planos de assinatura e fluxo de checkout).
3. Inconsistência Iconográfica: O acervo utilizava fotos genéricas de bancos de imagens gratuitas, que não guardavam verossimilhança com as obras reais históricas.
4. Filtros Desajustados: As opções de filtragem estavam desalinhadas das 5 décadas canônicas da cibercultura.

================================================================================
3. DECISÕES IMPLEMENTADAS A PARTIR DO PRIMEIRO FEEDBACK
================================================================================
A partir dos feedbacks recebidos na banca da primeira entrega, a equipe adotou as seguintes decisões técnicas e de produto:

• Decisão 1: CRUD Dinâmico Completo com Validação e Persistência
- Implementação de arquitetura de estado com persistência local versionada (chave 'synthetica_acervo_items_v8'). O usuário e os administradores podem adicionar novas obras através de formulário estruturado, editar registros existentes, aplicar reações (curtidas/favoritos) e postar comentários.

• Decisão 2: Substituição por Imagens Documentais Canônicas
- Migração de 14 registros com imagens genéricas para fotografias, pôsteres e capturas originais hospedadas na Wikimedia Commons / Wikipédia (incluindo o pôster de lançamento de The Matrix 1999, capa de Computer World do Kraftwerk 1981, Da Lama ao Caos da Nação Zumbi 1994, Discovery do Daft Punk 2001, Apple Macintosh 128K 1984, Game Boy 1989 e PlayStation 1 1994).
- Criação de camada de fallback inteligente (imageFallback.ts) para evitar imagens quebradas em caso de instabilidade de rede.

• Decisão 3: Desenvolvimento do Módulo de Assinaturas e Checkout (Product & Business)
- Desenvolvimento da seção CulturalStoreSection e do SubscriptionModal com alternância de ciclo de faturamento mensal e anual (-20% de desconto), aplicação de cupom promocional cultural ('MEMORIA10') e simulação de pagamento via Pix (com chave gerada e cópia rápida) ou Cartão de Crédito.

• Decisão 4: Motor de Busca e Filtros Combinados em Tempo Real
- Componente SectionDecadeFilterBar com contadores reativos de obras por disciplina e década, eliminando cenários de tela vazia e melhorando a usabilidade.

================================================================================
4. DECISÕES DE DESENVOLVIMENTO NAS DEMAIS DISCIPLINAS/ÁREAS
================================================================================
• Alinhamento com Mobile Hybrid Development:
- Unificação das tipagens TypeScript dos itens do acervo, tags visuais e metadados históricos.
- Compartilhamento das diretrizes de Acessibilidade (alto contraste, modos claro/escuro e síntese de voz para leitura de tela).

• Alinhamento com Digital Product & Business:
- Implementação da política de cancelamento transparente em 1 clique e destinação de 15% das assinaturas para fundos comunitários de restauração de mídias analógicas.

================================================================================
5. ARQUITETURA TÉCNICA DO PORTAL (FRONT & BACK)
================================================================================
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS + Motion.
- Backend & Proxy: Servidor Node.js / Express integrado (server.ts) com middlewares de desenvolvimento e produção.
- Controle de Estado: React Hooks e Context API com persistência local resiliente.
- Acessibilidade: AccessibilityContext com suporte a leitor de tela (Web Speech API), redução de movimento, controle de contraste e tamanho tipográfico.

================================================================================
6. ENTREGÁVEIS OBRIGATÓRIOS
================================================================================
• Link do portal hospedado:
  https://ais-dev-q5rp24jwojiqraqz2rm6wu-344740626637.us-west2.run.app (ou link de produção Vercel)

• Link para o GitHub com repositório dos arquivos do back e do front:
  [Inserir link do repositório GitHub do time]

• Link de pequeno vídeo-pitch (2 a 3 minutos):
  [Inserir link do vídeo no YouTube ou Google Drive]

================================================================================
7. ROTEIRO DO VÍDEO-PITCH (2 A 3 MINUTOS)
================================================================================
[0:00 - 0:35] Abertura:
"Olá! Somos a equipe do Portal Synthetica. Apresentamos a segunda entrega da disciplina Framework Application, com o CRUD dinâmico completo e a evolução das páginas integradas ao MVP de Digital Product & Business."

[0:35 - 1:20] Demonstração do CRUD e Filtros:
"Evoluímos o sistema da primeira entrega, onde os dados eram estáticos. Agora, o portal conta com gerenciamento completo de obras: criação, edição, comentários e curtidas com persistência. Integramos 21 obras canônicas com imagens oficiais da Wikimedia Commons e desenvolvemos filtros multidimensionais por 5 disciplinas e 5 eras tecnológicas."

[1:20 - 2:00] Demonstração do Módulo de Assinaturas e Sustentabilidade:
"Em alinhamento direto com o modelo de negócios, desenvolvemos a área de planos de apoio cultural. O usuário pode alternar entre assinaturas mensais e anuais com 20% de desconto, conferir os benefícios de cada nível (Freemium, Indie e Archival VIP) e realizar o checkout interativo por Pix ou Cartão."

[2:00 - 2:40] Decisões Técnicas e Fechamento:
"Adotamos React 19 com TypeScript, Vite e Tailwind CSS, além de rotinas avançadas de acessibilidade com síntese de voz e contraste. O código está versionado no GitHub e a aplicação está rodando em produção. Obrigado!"
`,
};

export const ACADEMIC_DOC_MOBILE: AcademicDocContent = {
  id: 'doc-mobile-hybrid',
  title: 'MOBILE HYBRID DEVELOPMENT — Relatório de Planejamento e Mini App de Curadoria (Mundo Synthetica)',
  discipline: 'Mobile Hybrid Development',
  subtitle: 'Mini App de Curadoria de Conteúdos do Mundo Synthetica em React Native',
  filename: 'MOBILE_HYBRID_DEVELOPMENT_Synthetica_Entrega_2.docx',
  plainText: `MOBILE HYBRID DEVELOPMENT
Relatório de Planejamento e Mini App de Curadoria do Mundo Synthetica (Entrega 2)

Desafio: Mini App de Curadoria de Conteúdos do Mundo Synthetica
Disciplina: Mobile Hybrid Development
Tecnologia: React Native / Expo Snack
Times de até 5 integrantes
Integrantes: [Preencher nomes e matrículas dos integrantes]
Data de Entrega: Outubro de 2026

================================================================================
1. CONTEXTO DO PROJETO NO UNIVERSO SYNTHETICA
================================================================================
No universo do Portal Synthetica, os usuários exploram conteúdos personalizados sobre o impacto da tecnologia, da inteligência artificial e das mídias eletrônicas na sociedade contemporânea.

O desafio desta disciplina consiste em desenvolver um aplicativo mobile híbrido em React Native que funcione como um catálogo interativo de conteúdos, garantindo:
- Navegação fluida por categorias culturais e décadas históricas.
- Interação rica com cards (favoritos, citações curatoriais e reprodução de áudio).
- Exibição de detalhes em telas separadas (padrão Stack Navigation).
- Mecânicas de acessibilidade e gamificação com resgate de memórias históricas.

================================================================================
2. PLANEJAMENTO: COMO ESTAVA O APP NA PRIMEIRA ENTREGA
================================================================================
Na primeira etapa, o aplicativo encontrava-se em estado preliminar:
1. Arquitetura Monolítica de Tela Única: Todos os elementos eram apresentados na mesma view com rolagem contínua, sem uso de rotas declarativas ou navegação por pilha.
2. Inconsistência no Catálogo: Existiam filtros pré-definidos com décadas que não possuíam obras correspondentes cadastradas, gerando telas vazias e experiência frustrante.
3. Carência de Acessibilidade Mobile: Não havia controle sobre tamanho de texto nem integração com sintetizadores de voz para pessoas cegas ou com baixa acuidade visual.
4. Falta de Gamificação e Retenção: O app funcionava apenas como um leitor passivo de cards, sem engajar o usuário no universo narrativo do Synthetica.

================================================================================
3. DECISÕES IMPLEMENTADAS A PARTIR DO PRIMEIRO FEEDBACK
================================================================================
Com base no feedback da primeira entrega e nos requisitos do desafio, foram adotadas as seguintes soluções:

• Decisão 1: Navegação em Telas Separadas via React Navigation Stack
- Implementação de fluxo com NavigationContainer e Stack.Navigator, separando a visualização geral (HomeScreen) da página com a ficha técnica aprofundada da obra (DetailScreen), provendo transições nativas, botão de retorno contextual e cabeçalho customizado.

• Decisão 2: Catálogo Canônico com 21 Obras e Filtros Eficientes
- Sincronização completa com o acervo da plataforma web: 5 disciplinas (Dança, Música, Cinema, Artes e Eletrônicos) e 5 eras temporais (1980s até 2020s), assegurando que todo filtro aplicado exiba conteúdos válidos com imagens reais da Wikimedia Commons.

• Decisão 3: Módulo de Acessibilidade com Audiodescrição Nativa (expo-speech)
- Integração da biblioteca de síntese de voz (TTS) em português brasileiro com seletor de velocidade (0.75x a 1.5x) e audiodescrição de cada obra com 1 toque.
- Modal dedicado com 4 níveis de escalonamento tipográfico (90% a 130%), alternância de Alto Contraste, Modo Escuro e redução de animações.

• Decisão 4: Gamificação com o 'Baú de Memórias de 1984'
- Criação de uma mecânica de caça a fragmentos históricos nas obras dos anos 80 (Fita Cassete de Cromo, Disquete 3.5", Cartucho Game Boy, Cabo Link, etc.). O usuário resgata os 6 itens ao inspecionar as obras e forja a lendária Chave de 1994, incentivando a exploração detalhada do catálogo.

================================================================================
4. DECISÕES DE DESENVOLVIMENTO NAS DEMAIS DISCIPLINAS/ÁREAS
================================================================================
• Alinhamento com Framework Application (Portal Web):
- Manutenção da identidade visual através dos tokens oficiais: Verde Floresta Profundo (#153833), Rosa Neon (#EFAEC4), Verde Esmeralda (#2FD19E) e tipografia moderna sem serifa.
- Equivalência de metadados: cada card exibe título, autor, país, formato de mídia e relevância contemporânea.

• Alinhamento com Digital Product & Business:
- Exibição de cards de adesão e status da assinatura do usuário (Plano Indie/VIP) diretamente no perfil mobile e topo da Home.

================================================================================
5. ARQUITETURA TÉCNICA MOBILE (REACT NATIVE)
================================================================================
- Framework: React Native rodando no ecossistema Expo Snack.
- Navegação: @react-navigation/native com @react-navigation/native-stack.
- Gerenciamento de Estado Global: Context API (SyntheticaContext) para favoritos, preferências de acessibilidade e fragmentos do Baú.
- Armazenamento Local Assíncrono: @react-native-async-storage/async-storage para garantir que dados permaneçam salvos entre sessões.
- Síntese de Fala: expo-speech configurado com voz nativa 'pt-BR'.

================================================================================
6. ENTREGÁVEIS OBRIGATÓRIOS
================================================================================
• Link do Snack:
  [Inserir link do seu Expo Snack]

• Link de pequeno vídeo-pitch (2 a 3 minutos):
  [Inserir link do vídeo no YouTube ou Google Drive]

================================================================================
7. ROTEIRO DO VÍDEO-PITCH (2 A 3 MINUTOS)
================================================================================
[0:00 - 0:35] Introdução e Visão Geral:
"Olá! Somos a equipe do Synthetica Mobile. Apresentamos a segunda entrega da disciplina Mobile Hybrid Development, com o mini app de curadoria de conteúdos interativos construído em React Native no Expo Snack."

[0:35 - 1:15] Demonstração do Catálogo e Telas Separadas:
"Em resposta ao primeiro feedback, que exigia telas separadas, implementamos navegação nativa por pilha entre a HomeScreen e a DetailScreen. O usuário pode filtrar o catálogo por disciplinas ou eras, interagir com os cards e acessar a ficha completa da obra com análise histórica e relevância no século XXI."

[1:15 - 1:55] Acessibilidade e Audiodescrição por Voz:
"Integramos o pacote expo-speech para prover audiodescrição nativa das obras em português. Desenvolvemos também um modal completo de acessibilidade que permite ajustar o tamanho da fonte, alternar para alto contraste e controlar a velocidade da narração."

[1:55 - 2:35] Baú de Memórias de 1984 e Conclusão:
"Para engajar o usuário no universo narrativo do Synthetica, criamos a gamificação do Baú de Memórias, onde fragmentos dos anos 80 são coletados nas telas de detalhe. O app possui persistência local com AsyncStorage e o código pode ser testado diretamente no link do Snack. Muito obrigado!"
`,
};
