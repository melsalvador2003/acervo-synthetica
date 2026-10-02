/**
 * Sistema de Gamificação: "Um Dia em 1984 — O Diário de Memórias de Leo"
 * 
 * Uma narrativa visual de um jovem vivendo nos anos 80. Conforme o usuário
 * navega pelos artigos do acervo, ele encontra fragmentos ilustrados com objetos
 * escondidos que se transformam no acervo real e são guardados no seu Baú de Memórias.
 */

export interface FragmentoMemoria80 {
  id: string;
  order: number;
  timeOfDay: string; // Ex: "07:30", "10:15"
  sceneTitle: string; // Ex: "O Despertar com a Fita de Cromo"
  sceneLocation: string; // Ex: "Quarto com Rádio-Relógio"
  storyExcerpt: string; // Relato do diário de Leo
  hiddenObjectName: string; // Nome do objeto escondido
  hiddenObjectHint: string; // Pista de camuflagem
  objectCategoryLabel: string; // Ex: "Áudio Analógico", "Película", "Hardware"
  soundEffect: 'chime' | 'vinil' | 'arcade' | 'tape' | 'dream';
  linkedArchiveId: string; // ID da obra correspondente no acervo
  linkedArchiveTitle: string; // Nome da obra correspondente
  collectibleBadge: string; // Título do item no Baú
  historicalFunFact: string; // Curiosidade histórica desbloqueada ao coletar
}

export const MEMORIAS_1984: FragmentoMemoria80[] = [
  {
    id: 'mem-01-walkman',
    order: 1,
    timeOfDay: '07:30',
    sceneTitle: 'O Despertar & A Fita de Cromo',
    sceneLocation: 'Quarto com Rádio-Relógio LED Vermelho',
    storyExcerpt:
      'Acordo com o zumbido mecânico do rádio-relógio. O dia lá fora está frio e cinzento. Antes de colocar os pés no assoalho de madeira, estico o braço na mesinha de cabeceira e aperto o PLAY no meu toca-fitas portátil. A fita de cromo corre com aquele sopro agudo gostoso nos fones de espuma laranja. O sintetizador de Düsseldorf começa a pulsar e o quarto parece ganhar vida elétrica.',
    hiddenObjectName: 'Fita Cassete Cromo & Fone de Espuma Laranja',
    hiddenObjectHint: 'Perto do rádio-relógio sobre a mesa de cabeceira',
    objectCategoryLabel: 'Música & Síntese Sonora',
    soundEffect: 'tape',
    linkedArchiveId: 'syn-mus-01',
    linkedArchiveTitle: 'Computer World (Kraftwerk)',
    collectibleBadge: 'Fita K7 Cromo TDK-90',
    historicalFunFact:
      'Nos anos 80, as fitas Tipo II (Dióxido de Cromo) eram o tesouro de qualquer amante de música eletrônica, oferecendo agudos cristalinos sem os chiados de fitas comuns.',
  },
  {
    id: 'mem-02-vinil',
    order: 2,
    timeOfDay: '10:15',
    sceneTitle: 'A Vitrine de Discos & O Cheiro de Papelão',
    sceneLocation: 'Loja de Discos "Neon Grooves", Galeria Central',
    storyExcerpt:
      'Uma chuva fina bate na marquise de metal. Entro na loja de discos escapando das poças d\'água. O dono da loja, com cigarro na orelha, colocou uma prensagem japonesa nova na vitrola do balcão. O ruído da agulha descendo no sulco do vinil de 12 polegadas faz um estalo grave que reverbera no peito. Folheio uma fileira de capas coloridas até sentir uma cartolina brilhante sob os dedos.',
    hiddenObjectName: 'Disco de Vinil 12\'\' Edição Importada',
    hiddenObjectHint: 'Entre os caixotes de madeira na seção de importados',
    objectCategoryLabel: 'Discoteca Analógica',
    soundEffect: 'vinil',
    linkedArchiveId: 'syn-ele-02',
    linkedArchiveTitle: 'Game Boy Original (Gunpei Yokoi)',
    collectibleBadge: 'Vinil Vermelho Alfa Records',
    historicalFunFact:
      'As edições em vinil japonês dos anos 70 e 80 vinham com o famoso "Obi" (a faixa vertical de papel com kanjis), hoje disputada por colecionadores no mundo inteiro.',
  },
  {
    id: 'mem-03-cinema',
    order: 3,
    timeOfDay: '13:45',
    sceneTitle: 'O Cineclube & O Néon no Asfalto Molhado',
    sceneLocation: 'Fachada do Cine Imperial, Esquina da Avenida',
    storyExcerpt:
      'O reflexo do letreiro de néon vermelho treme nas poças d\'água da calçada. O baleiro do cinema está abrindo a portaria para a sessão da tarde. No saguão, o cheiro de pipoca na manteiga se mistura com o calor do projetor de arco voltaico no andar superior. Na parede de azulejos, um cartaz com uma metrópole chuvosa de 2019 e um carro voador parece conversar diretamente comigo.',
    hiddenObjectName: 'Canhoto de Ingresso 35mm & Cartaz de Cinema',
    hiddenObjectHint: 'Preso ao vidro da bilheteria ao lado do folheto',
    objectCategoryLabel: 'Película 35mm & Sci-Fi',
    soundEffect: 'dream',
    linkedArchiveId: 'syn-cin-01',
    linkedArchiveTitle: 'Blade Runner (Ridley Scott)',
    collectibleBadge: 'Canhoto Cine Imperial 1984',
    historicalFunFact:
      'Em 1982, os cartazes de cinema eram pintados à mão por mestres ilustradores como John Alvin e Drew Struzan, antes da era do Photoshop.',
  },
  {
    id: 'mem-04-arcade',
    order: 4,
    timeOfDay: '16:20',
    sceneTitle: 'O Fliperama & O Brilho de Fósforo Verde',
    sceneLocation: 'Salão de Jogos "Galaxy Zone", Subsolo da Galeria',
    storyExcerpt:
      'Subsolo escuro iluminado apenas pelas telas de tubo CRT e o zumbido de dezenas de fontes de alimentação. Bato a mão no bolso da jaqueta: três fichas de latão com um furo no meio. Enfio uma na ranhura da máquina, o mecanismo engole a moeda e a tela pisca: INSERT COIN. Minha mão se fecha no manche áspero de borracha preta com o botão vermelho sob o dedão.',
    hiddenObjectName: 'Ficha de Fliperama & Joystick com Botão Vermelho',
    hiddenObjectHint: 'Em cima do gabinete de madeira ao lado do cinzeiro',
    objectCategoryLabel: 'Eletrônicos & Fliperamas',
    soundEffect: 'arcade',
    linkedArchiveId: 'syn-ele-03',
    linkedArchiveTitle: 'Sony PlayStation 1 (Ken Kutaragi)',
    collectibleBadge: 'Ficha Metálica Galaxy Zone',
    historicalFunFact:
      'O joystick CX40 da Atari foi o primeiro controle ergonômico com botão único a ser produzido em massa, definindo a pegada dos jogos por duas décadas.',
  },
  {
    id: 'mem-05-lab',
    order: 5,
    timeOfDay: '18:50',
    sceneTitle: 'O Laboratório Noturno & O Cursor Piscante',
    sceneLocation: 'Sala 4B do Instituto de Tecnologia, Laboratório de Computação',
    storyExcerpt:
      'O prédio já esvaziou. O professor me deixou terminar de digitar o programa antes de trancar a porta. O cursor verde pisca na tela monocromática do terminal como uma respiração mecânica. Ao lado do teclado barulhento, vejo uma pilha de disquetes flexíveis pretos de 5.25 polegadas. No meu caderno quadriculado, esboço um aparelho fino como uma prancheta que qualquer criança poderia carregar.',
    hiddenObjectName: 'Disquete Flexível 5.25\'\' & Bloco de Anotações',
    hiddenObjectHint: 'Sob o monitor de tubo encostado na prateleira técnica',
    objectCategoryLabel: 'Computação Pessoal',
    soundEffect: 'chime',
    linkedArchiveId: 'syn-ele-01',
    linkedArchiveTitle: 'Apple Macintosh 128K (Steve Jobs)',
    collectibleBadge: 'Disquete Mac 128K OS Spec',
    historicalFunFact:
      'Em janeiro de 1984, Steve Jobs subiu no palco da reunião anual de acionistas da Apple e tirou o Macintosh de dentro de uma sacola de lona para delírio da plateia.',
  },
  {
    id: 'mem-06-rua',
    order: 6,
    timeOfDay: '21:15',
    sceneTitle: 'O Estacionamento & A Dança dos Autômatos',
    sceneLocation: 'Pátio dos Fundos da Fábrica Desativada',
    storyExcerpt:
      'Dois carros estacionados de frente um para o outro com os faróis altos acesos cortando a neblina. Um rádio boombox com alça cromada está apoiado sobre um caixote de madeira, tocando uma linha de baixo sincopada em fita K7. Um garoto de jaqueta prateada entra no centro do círculo. Ele trava o ombro, estala o punho e gira o tronco como se uma engrenagem invisível operasse suas articulações.',
    hiddenObjectName: 'Rádio Boombox Prata & Óculos Espelhados',
    hiddenObjectHint: 'Apoiado sobre o linóleo esticado perto dos faróis',
    objectCategoryLabel: 'Dança Urbana & Movimento',
    soundEffect: 'tape',
    linkedArchiveId: 'syn-dan-01',
    linkedArchiveTitle: 'O Moonwalk & A Dança Robô (Michael Jackson)',
    collectibleBadge: 'Fita Master Street Funk',
    historicalFunFact:
      'A dança do robô e o moonwalk nos anos 80 mostraram o corpo humano se movendo como se estivesse sob leis gravitacionais artificiais.',
  },
  {
    id: 'mem-07-quarto',
    order: 7,
    timeOfDay: '23:30',
    sceneTitle: 'A Madrugada Cósmica & A Janela para as Estrelas',
    sceneLocation: 'Quarto Silencioso, Luz Apagada',
    storyExcerpt:
      'Casa em silêncio absoluto. Todos já dormem. Ligo a TV portátil de 5 polegadas sintonizada no canal educativo que exibe sessões de cinema de vanguarda da meia-noite. A tela emite uma luz azulada que desenha sombras no teto. Na tela, motos com rastros de laser cortam uma metrópole futurista iluminada por neons. Abro a fresta da cortina e olho para a lua: parece que o cosmos inteiro está suspenso numa fita analógica.',
    hiddenObjectName: 'Pedaço de Película de Filme & Caderno de Astronomia',
    hiddenObjectHint: 'Perto da luneta astronômica apoiada no parapeito',
    objectCategoryLabel: 'Cinema Cósmico & IA',
    soundEffect: 'dream',
    linkedArchiveId: 'syn-cin-02',
    linkedArchiveTitle: 'Akira (Katsuhiro Otomo)',
    collectibleBadge: 'Fotograma Neo-Tóquio 70mm',
    historicalFunFact:
      'Akira foi produzido com 160.000 quadros de animação desenhados à mão, estabelecendo o padrão ouro da estética visual cyberpunk asiática no cinema mundial.',
  },
  {
    id: 'mem-08-sonho',
    order: 8,
    timeOfDay: '01:10',
    sceneTitle: 'A Prancha de Desenho & O Sonho do Amanhã',
    sceneLocation: 'Mesa de Desenho com Luminária Articulada',
    storyExcerpt:
      'Uma da manhã. A luminária de braço metálico ilumina a prancha com papel vegetal espesso. Molho a pena de nanquim e misturo gouache na paleta de cerâmica. Desenho uma mulher androide com pele de metal cromado reluzente sob luzes violetas. O futuro não é algo distante que vai acontecer sozinho: é o que a gente desenha à noite para que o mundo possa acordar diferente.',
    hiddenObjectName: 'Caneta Técnica Nanquim & Pote de Gouache Metálico',
    hiddenObjectHint: 'Ao lado da régua T e dos vidros de nanquim na prancha',
    objectCategoryLabel: 'Artes Visuais & Futurgrafia',
    soundEffect: 'chime',
    linkedArchiveId: 'syn-art-01',
    linkedArchiveTitle: 'Sexy Robot (Hajime Sorayama)',
    collectibleBadge: 'Pena Nanquim N° 2 de Cromo',
    historicalFunFact:
      'Hajime Sorayama criou a estética dos androides com reflexos cromados perfeitos usando apenas aerógrafo manual nos anos 80, sem qualquer computador.',
  },
];

const STORAGE_KEY_MEMORIAS = 'synthetica_bau_memorias_80s_v1';
const STORAGE_KEY_SECRETA_DESBLOQUEADA = 'synthetica_fita_secreta_1984_v1';

/**
 * Retorna os IDs dos fragmentos já coletados pelo usuário
 */
export function obterMemoriasColetadas(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMORIAS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
}

/**
 * Salva a coleta de uma memória e retorna se foi uma nova descoberta
 */
export function coletarMemoria(id: string): { isNovo: boolean; totalColetado: number; completouDecada: boolean } {
  const coletados = obterMemoriasColetadas();
  const isNovo = !coletados.includes(id);

  let atualizados = coletados;
  if (isNovo) {
    atualizados = [...coletados, id];
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIAS, JSON.stringify(atualizados));
    } catch {
      // ignore
    }
  }

  const completouDecada = atualizados.length >= MEMORIAS_1984.length;
  if (completouDecada) {
    try {
      localStorage.setItem(STORAGE_KEY_SECRETA_DESBLOQUEADA, 'true');
    } catch {
      // ignore
    }
  }

  return {
    isNovo,
    totalColetado: atualizados.length,
    completouDecada,
  };
}

/**
 * Verifica se o usuário já completou todos os 8 objetos e liberou a recompensa
 */
export function verificarDecadaCompleta(): boolean {
  try {
    const completou = localStorage.getItem(STORAGE_KEY_SECRETA_DESBLOQUEADA);
    if (completou === 'true') return true;
  } catch {
    // fallback
  }
  return obterMemoriasColetadas().length >= MEMORIAS_1984.length;
}

/**
 * Retorna o fragmento correspondente a uma obra do acervo (se houver)
 */
export function buscarMemoriaPorObraId(obraId: string): FragmentoMemoria80 | undefined {
  return MEMORIAS_1984.find((m) => m.linkedArchiveId === obraId);
}

/**
 * Reseta o progresso para reiniciar a caça ao tesouro (útil para testes ou recomeçar)
 */
export function reiniciarMemorias(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_MEMORIAS);
    localStorage.removeItem(STORAGE_KEY_SECRETA_DESBLOQUEADA);
  } catch {
    // ignore
  }
}
