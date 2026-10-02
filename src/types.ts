export type Category = 'danca' | 'musica' | 'cinema' | 'artes-plasticas' | 'eletronicos';

export type SubscriptionTier = 'freemium' | 'indie' | 'sync';
export type BillingCycle = 'monthly' | 'annual';

export interface UserSubscription {
  tier: SubscriptionTier;
  cycle: BillingCycle;
  status: 'active' | 'trial' | 'free';
  startedAt: string;
  renewsAt?: string;
  syncedServices?: ('spotify' | 'apple_music' | 'tidal' | 'mubi' | 'criterion')[];
  unlimitedRecommendations: boolean;
  nicheSearchUnlocked: boolean;
  aiCuratorUnlimited: boolean;
  customAnalyticsReports: boolean;
}

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualMonthlyEquivalent: number;
  annualTotalPrice: number;
  badge: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
}

export interface StreamAffiliateLink {
  id: string;
  provider: 'spotify' | 'tidal' | 'mubi' | 'criterion' | 'apple_music' | 'bandcamp' | 'youtube_music';
  providerName: string;
  type: 'musica' | 'cinema' | 'audio' | 'geral';
  mediaUrl: string;
  referralCode: string;
  estimatedCommission: string;
  actionText: string;
  highlightOffer?: string;
}

export interface CulturalStoreProduct {
  id: string;
  title: string;
  subtitle: string;
  category: Category | 'artefato' | 'equipamento' | 'publicacao';
  partnerName: string;
  partnerType: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  curatorNote: string;
  commissionRate: string;
  commissionValue: string;
  partnerUrl: string;
  inStock: boolean;
  stockCount?: number;
  badge?: string;
  specs: string[];
}

export interface B2BPartnerCatalog {
  id: string;
  institutionName: string;
  type: 'gravadora' | 'produtora' | 'cinemateca' | 'instituto';
  logoText: string;
  coverUrl: string;
  headline: string;
  description: string;
  featuredWorksCount: number;
  curatorialTheme: string;
  catalogSlug: string;
  sponsoredHighlight: boolean;
  partnershipLevel: 'Patrono Ouro' | 'Catálogo em Destaque' | 'Acervo Institucional';
  monthlyContributionEstimate: string;
  itemIds: string[];
  contactEmail: string;
}

export interface CommentItem {
  id: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;

  // Extensões para integração com o backend FastAPI e tabela COMENTARIO (MER):
  id_comentario?: number;
  id_conteudo?: string;
  id_usuario?: number;
  autor_nome?: string;
  texto?: string;
  data_comentario?: string;
  editado?: boolean;
  curtidas?: number;
}

/** Entidade COMENTARIO espelhada do modelo relacional (MER) / FastAPI */
export interface BackendComment {
  id_comentario: number;
  id_conteudo: string;
  id_usuario: number;
  autor_nome: string;
  texto: string;
  data_comentario: string;
  editado: boolean;
  curtidas: number;
}

export interface ArchiveItem {
  id: string;
  title: string;
  category: Category;
  creator: string; // Artista, Coreógrafo, Diretor, Fabricante, Inventor
  role: string; // e.g. "Coreógrafa & Pioneira", "Fabricante & Engenharia", "Cineasta"
  year: number;
  decade: string;
  genre: string;
  country: string;
  coverUrl: string;
  mediaFormat: string; // e.g. "Película 35mm", "Fita Magnética Cassete", "Mármore & Pigmento", "Microprocessador 8-bit"
  curatorialNotes: string;
  historyText: string;
  historicalUse: string; // Como o dispositivo ou obra era usado na época
  targetAudience: string; // Público-alvo daquele período
  legacyImpact: string; // Impacto histórico deixado
  impact?: string;
  todayRelevance?: string; // Relevância contemporânea e conexão com IA do século XXI
  quote?: string;
  wikiTitle?: string[];
  tags: string[];
  rating: number;
  isFavorite: boolean;
  isLiked?: boolean;
  hasCompletedRead?: boolean;
  likesCount: number;
  sharesCount: number;
  readsCount: number;
  comments: CommentItem[];
  audioTrackName?: string;
  audioBpm?: number;
  videoDuration?: string;
  notableFeature?: string;
  streamLinks?: StreamAffiliateLink[];
  b2bPartner?: {
    partnerId: string;
    partnerName: string;
    sponsorType: string;
    badge: string;
  };
  createdAt: string;
}

export type FilterDecade = 'todos' | '1890s' | '1900s' | '1910s' | '1920s' | '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s';

export interface UserInteractions {
  articlesRead: string[]; // item IDs
  likedItemIds: string[];
  sharedItemIds: string[];
  exploredDecades: Record<string, number>;
  exploredCategories: Record<string, number>;
  totalMinutes: number;
}

export interface CuratorRecommendation {
  id: string;
  titulo: string;
  razao: string;
  categoria?: Category;
  secao?: string;
  ano?: number;
  coverUrl?: string;
  creator?: string;
}

export interface MonthlyWrapped {
  id: string;
  monthName?: string;
  month?: string; // alias for monthName
  monthCode: string;
  year: number;
  themeTitle?: string;
  themeSubtitle?: string;
  personaTitle?: string;
  personaDescription?: string;
  archetypeName?: string; // alias for personaTitle
  archetypeDescription?: string; // alias for personaDescription
  dominantCategory?: Category;
  categoryPercentages?: { category: Category; label: string; percentage: number }[];
  affinityScores?: { category: Category; percentage: number }[];
  dominantDecade?: string;
  topItemIds?: string[];
  curatedPicks?: {
    title: string;
    category: Category;
    creator: string;
    year: number;
    reason: string;
    linkedArchiveId?: string;
  }[];
  nextMonthRecommendations?: {
    title: string;
    category: Category;
    creator: string;
    decade?: string;
    reason: string;
    linkedArchiveId?: string;
  }[];
  stats?: {
    articlesRead: number;
    itemsLiked: number;
    topDecade: string;
    totalMinutesSpent: number;
  };
  affinityBadges?: string[];
  // Campos do Curador Synthetica (IA Gemini)
  narrativaIA?: string;
  recomendacoesIA?: CuratorRecommendation[];
  origemIA?: string;
  geradoEm?: string;
}

export interface FriendCurator {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  dominantCategory: Category;
  favoriteDecade: string;
  affinityPercentage: number;
  recentWrappedTheme: string;
  recentFavorites: string[];
}

export interface UserProfile {
  id: string;
  numericId?: number; // Identificador numérico mapeado para id_usuario no backend
  name: string;
  displayName?: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  favoriteCategories: Category[];
  wrappedHistoryIds: string[];
  subscription?: UserSubscription;
}
