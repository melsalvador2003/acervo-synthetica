/**
 * Sistema de Gamificação: "Um Dia em 1994 — O Diário de Nina & A Revolução Multimídia"
 * 
 * Desbloqueado quando o usuário completa os 8 fragmentos de 1984 e conquista a "Chave de 1994".
 * Representa a virada cultural dos anos 90: a chegada do CD, do discman com anti-shock,
 * das locadoras de VHS com rebobinador de carrinho, dos consoles 16-bit e da primeira internet discada.
 */

export interface FragmentoMemoria90 {
  id: string;
  order: number;
  timeOfDay: string; // Ex: "08:15", "11:30"
  sceneTitle: string;
  sceneLocation: string;
  storyExcerpt: string; // Relato do diário de Nina
  hiddenObjectName: string;
  hiddenObjectHint: string;
  objectCategoryLabel: string;
  soundEffect: 'cd' | 'dialup' | 'vhs' | '16bit' | 'chime';
  linkedArchiveId: string;
  linkedArchiveTitle: string;
  collectibleBadge: string;
  historicalFunFact: string;
}

export const MEMORIAS_1994: FragmentoMemoria90[] = [
  {
    id: 'mem-90-discman',
    order: 1,
    timeOfDay: '08:15',
    sceneTitle: 'O Ônibus com Fones & O Anti-Shock do Discman',
    sceneLocation: 'Linha de Ônibus Central, Banco de Trás',
    storyExcerpt:
      'O ônibus sacode nas lombadas da avenida, mas o feixe de laser segura a música sem pular. O botão ESP (Electronic Shock Protection) do meu Discman está aceso em amarelo. No meu colo, a caixinha acrílica de CD reflete a luz da manhã em arco-íris. O som é tão cristalino que consigo escutar a respiração dos pratos de bateria. A fita cassete parece de repente um sonho distante.',
    hiddenObjectName: 'Discman Portátil ESP com Fone de Espuma & CD Prateado',
    hiddenObjectHint: 'Na mochila apoiada sobre o assento do ônibus',
    objectCategoryLabel: 'Áudio Digital & CD-ROM',
    soundEffect: 'cd',
    linkedArchiveId: 'syn-mus-03',
    linkedArchiveTitle: 'Homogenic (Björk)',
    collectibleBadge: 'Discman ESP 10-Sec Memory',
    historicalFunFact:
      'Em 1994, o sistema ESP da Sony virou revolução: lia o CD com o dobro da velocidade e guardava 10 segundos de música em chips de RAM para não travar nos passos de quem caminhava.',
  },
  {
    id: 'mem-90-vhs',
    order: 2,
    timeOfDay: '11:45',
    sceneTitle: 'A Sessão de Sexta & O Rebobinador de Carrinho',
    sceneLocation: 'Locadora "Vídeo Laser 2000" & Sala com TV 29 Polegadas',
    storyExcerpt:
      'Entrar na locadora e ver a etiqueta verde "DISPONÍVEL" atrás da caixa de plástico da fita que você queria era a maior vitória da semana. Em casa, coloco a fita dentro do rebobinador em formato de carro esportivo vermelho. O motor dá aquele uivo agudo, as rodinhas do carrinho tremem e ele dá um estalo seco: rebobinada perfeita para não pagar a taxa de devolução na segunda-feira.',
    hiddenObjectName: 'Fita VHS com Etiqueta de Locadora & Rebobinador Esportivo',
    hiddenObjectHint: 'Sobre o móvel de fórmica ao lado do videocassete 4 cabeças',
    objectCategoryLabel: 'Película VHS & Locadoras',
    soundEffect: 'vhs',
    linkedArchiveId: 'syn-cin-03',
    linkedArchiveTitle: 'The Matrix (Wachowski)',
    collectibleBadge: 'Fita VHS Selo Ouro',
    historicalFunFact:
      'Nos anos 90, quase toda família brasileira tinha um rebobinador de fita independente (geralmente em formato de carro esportivo) para poupar o cabeçote do caro aparelho de videocassete.',
  },
  {
    id: 'mem-90-cartucho',
    order: 3,
    timeOfDay: '14:30',
    sceneTitle: 'O Sopro Sagrado & A Batalha dos 16-Bits',
    sceneLocation: 'Tapete da Sala com Console 16-Bit Ligado no Canal 3',
    storyExcerpt:
      'A tela da TV piscou em cinza. Tiro o cartucho cinza do slot com todo o carinho, checo os contatos de metal dourado e dou três sopros rápidos e secos. Encaixo de novo até o "clack", deslizo o botão POWER e o logotipo brilhante surge ao som de um acorde estridente de sintetizador FM. No chão, a revista de videogame aberta na folha do detonado com o mapa desenhado.',
    hiddenObjectName: 'Cartucho 16-Bit Cinza & Revista de Games com Detonado',
    hiddenObjectHint: 'Perto do tapete ao lado do segundo controle com fio enrolado',
    objectCategoryLabel: 'Games & Eletrônicos 16-Bit',
    soundEffect: '16bit',
    linkedArchiveId: 'syn-ele-03',
    linkedArchiveTitle: 'Sony PlayStation 1 (Ken Kutaragi)',
    collectibleBadge: 'Cartucho 16-Bit Gold ROM',
    historicalFunFact:
      'Embora os manuais alertassem contra soprar os cartuchos por conta da umidade, o gesto virou o maior ritual intuitivo da história da tecnologia doméstica mundial.',
  },
  {
    id: 'mem-90-dialup',
    order: 4,
    timeOfDay: '00:05',
    sceneTitle: 'O Handshake Noturno & O Pulso Único Telefônico',
    sceneLocation: 'Quarto com Computador Torre Bege e Monitor CRT 14 Polegadas',
    storyExcerpt:
      'Esperar dar meia-noite para poder pagar apenas um pulso na conta telefônica. Desligo o interfone para ninguém tirar do gancho. Clico em "Conectar". O relé do modem US Robotics dá um estalo e a sinfonia começa: bipe longo, tom de discagem, um chiado metálico de maré e o handshake triunfante: "CONNECTED AT 28.800 BPS". Uma página em HTML puro com fundo cinza começa a descer linha por linha.',
    hiddenObjectName: 'Modem Externo 56kbps com Luzes LED & Fio Telefônico',
    hiddenObjectHint: 'Atrás da torre bege ao lado do mouse com bolinha emborrachada',
    objectCategoryLabel: 'Internet Discada & Redes',
    soundEffect: 'dialup',
    linkedArchiveId: 'syn-ele-01',
    linkedArchiveTitle: 'Apple Macintosh 128K (Steve Jobs)',
    collectibleBadge: 'Modem Dial-up 56k US Robotics',
    historicalFunFact:
      'O som estridente do modem era a audição direta de dados acústicos: os modems testavam várias frequências de onda na fiação de cobre analógica para negociar o canal mais limpo.',
  },
  {
    id: 'mem-90-cybercafe',
    order: 5,
    timeOfDay: '17:15',
    sceneTitle: 'O Cyber Café & A Janela do Navegador Mosaic',
    sceneLocation: 'Cyber Café "Nexus Net", Mesas com Teclados Mecânicos',
    storyExcerpt:
      'O cheiro de café expresso torrado se mistura com o calor dos gabinetes ligados direto. Na tela curva de vidro do monitor de tubo, digito "http://www." com a mão trêmula. Clico em uma palavra azul sublinhada e, quarenta segundos depois, uma imagem em formato GIF carregando em tiras interlaciadas me mostra uma pintura de um museu em Florença. O mundo encolheu.',
    hiddenObjectName: 'Disquete 3.5 Polegadas com Etiqueta & Caneca do Cyber Café',
    hiddenObjectHint: 'Sobre o mousepad de neoprene ao lado do teclado bege',
    objectCategoryLabel: 'Web Pioneira & Hipertexto',
    soundEffect: 'chime',
    linkedArchiveId: 'syn-art-02',
    linkedArchiveTitle: 'Electronic Superhighway (Nam June Paik)',
    collectibleBadge: 'Disquete 3.5\'\' HD 1.44MB',
    historicalFunFact:
      'O disquete rígido de 3.5 polegadas com janela deslizante de alumínio virou o ícone eterno do botão "Salvar" de todos os sistemas operacionais até hoje.',
  },
  {
    id: 'mem-90-rave',
    order: 6,
    timeOfDay: '02:40',
    sceneTitle: 'O Hangar de Concreto & A Batida Quatro-por-Quatro',
    sceneLocation: 'Galpão Industrial Desativado, Néon Violeta & Estroboscópio',
    storyExcerpt:
      'O grave de uma Roland 909 a 135 batidas por minuto reverbera nas vigas de ferro do galpão. Uma máquina de fumaça solta jatos brancos fatiados por lasers verdes e azuis. No meio da multidão, seguro uma pulseira que brilha no escuro e guardo no bolso da jaqueta jeans um flyer dobrado em papel holográfico com a mandala geométrica do evento. O futuro não era mais sobre máquinas frias; era sobre humanos unidos por uma pulsação eletrônica.',
    hiddenObjectName: 'Flyer Holográfico de Festa Eletrônica & Pulseira Neon',
    hiddenObjectHint: 'No bolso da jaqueta jeans encostada na grade de metal',
    objectCategoryLabel: 'Música Eletrônica & Cultura Rave',
    soundEffect: 'chime',
    linkedArchiveId: 'syn-mus-02',
    linkedArchiveTitle: 'Da Lama ao Caos (Chico Science & Nação Zumbi)',
    collectibleBadge: 'Flyer Holográfico Rave 1994',
    historicalFunFact:
      'Em 1994, a cultura de música eletrônica explodiu globalmente misturando sintetizadores analógicos com samplers digitais Akai, inaugurando o trance e o drum and bass modernos.',
  },
];

const STORAGE_KEY_CHAVE_1994 = 'synthetica_chave_1994_desbloqueada_v1';
const STORAGE_KEY_MEMORIAS_90 = 'synthetica_bau_memorias_90s_v1';

/**
 * Retorna se o usuário já destrancou a Chave de 1994
 */
export function obterStatusChave1994(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHAVE_1994);
    if (raw === 'true') return true;
  } catch {
    // ignore
  }
  return false;
}

/**
 * Ativa o destrancamento da Chave de 1994
 */
export function desbloquearChave1994(): void {
  try {
    localStorage.setItem(STORAGE_KEY_CHAVE_1994, 'true');
  } catch {
    // ignore
  }
}

/**
 * Retorna os IDs dos fragmentos dos anos 90 coletados
 */
export function obterMemorias90Coletadas(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMORIAS_90);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

/**
 * Coleta um item dos anos 90
 */
export function coletarMemoria90(id: string): { isNovo: boolean; totalColetado: number; completou90: boolean } {
  const coletados = obterMemorias90Coletadas();
  const isNovo = !coletados.includes(id);

  let atualizados = coletados;
  if (isNovo) {
    atualizados = [...coletados, id];
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIAS_90, JSON.stringify(atualizados));
    } catch {
      // ignore
    }
  }

  const completou90 = atualizados.length >= MEMORIAS_1994.length;

  return {
    isNovo,
    totalColetado: atualizados.length,
    completou90,
  };
}

/**
 * Reinicia progresso dos anos 90
 */
export function reiniciarMemorias90(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_MEMORIAS_90);
    localStorage.removeItem(STORAGE_KEY_CHAVE_1994);
  } catch {
    // ignore
  }
}
