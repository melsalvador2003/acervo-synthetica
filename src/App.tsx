/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_ARCHIVE,
  HISTORICAL_WRAPPEDS,
  MOCK_FRIENDS,
} from './data/initialArchive';
import {
  ArchiveItem,
  Category,
  UserProfile,
  MonthlyWrapped,
  CommentItem,
  SubscriptionTier,
  BillingCycle,
} from './types';
import {
  criarComentario,
  editarComentario,
  excluirComentario,
} from './utils/comentariosApi';
import { audioEngine } from './utils/audioPlayer';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CuradoriaSection } from './components/CuradoriaSection';
import { VinylPlayerSection } from './components/VinylPlayerSection';
import { GallerySection } from './components/GallerySection';
import { SectionDivider } from './components/SectionDivider';
import { SectionDecadeFilterBar } from './components/SectionDecadeFilterBar';
import { ArchiveItemModal } from './components/ArchiveItemModal';
import { WrappedView } from './components/WrappedView';
import { AddItemModal } from './components/AddItemModal';
import { AboutModal } from './components/AboutModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { CuradorAssistant } from './components/CuradorAssistant';
import { FilterRecommendationModal } from './components/FilterRecommendationModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SubscriptionSection } from './components/SubscriptionSection';
import { CulturalStoreSection } from './components/CulturalStoreSection';
import { B2BPartnerSection } from './components/B2BPartnerSection';
import { B2BPartnerModal } from './components/B2BPartnerModal';
import { UserAnalyticsModal } from './components/UserAnalyticsModal';
import { BauMemoriasModal } from './components/BauMemoriasModal';
import { DreamTransitionModal } from './components/DreamTransitionModal';
import { FragmentoMemoria80, obterMemoriasColetadas, coletarMemoria } from './data/memoriaAnos80';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { AccessibilityModal } from './components/AccessibilityModal';
import { AccessibilityFloatingButton } from './components/AccessibilityFloatingButton';
import { MotionConfig } from 'motion/react';

const STORAGE_KEY = 'synthetica_acervo_items_v8';
const PROFILE_KEY = 'synthetica_user_profile_v2';

function MainAppContent() {
  const { openPanel, announce, reducedMotion } = useAccessibility();

  // Load archive items from localStorage or initial dataset (garante carregamento com imagens 100% testadas e ativas)
  const [items, setItems] = useState<ArchiveItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.some((p: any) => p.title === 'Computer World' && p.coverUrl?.includes('upload.wikimedia.org'))
        ) {
          return parsed.map((item: any) => ({
            ...item,
            comments: item.comments || [],
          }));
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_ARCHIVE;
  });

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          numericId: parsed.numericId || 1,
        };
      }
    } catch {
      // fallback
    }
    return {
      id: 'usr-default',
      numericId: 1, // Usuária logada padrão no acervo (autora para validação MER COMENTARIO)
      name: 'Sofia Valente',
      email: 'sofia.valente@acervodigital.art',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      bio: 'Pesquisadora de mídias analógicas, cinema em película e vanguardas cênicas do século XX.',
      joinedDate: 'Setembro 2026',
      favoriteCategories: ['musica', 'cinema', 'eletronicos'],
      wrappedHistoryIds: ['wrapped-2026-08', 'wrapped-2026-07'],
      subscription: {
        tier: 'indie',
        cycle: 'annual',
        status: 'active',
        startedAt: '2026-08-01',
        renewsAt: '2027-08-01',
        syncedServices: ['spotify', 'mubi'],
        unlimitedRecommendations: true,
        nicheSearchUnlocked: true,
        aiCuratorUnlimited: true,
        customAnalyticsReports: true,
      },
    };
  });

  // Navigation and Filter state
  const [activeCategory, setActiveCategory] = useState<Category | 'todos'>('todos');

  // Turntable & Audio Player State
  const [playingItem, setPlayingItem] = useState<ArchiveItem>(() => items[0] || INITIAL_ARCHIVE[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Modals
  const [selectedModalItem, setSelectedModalItem] = useState<ArchiveItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isWrappedOpen, setIsWrappedOpen] = useState<boolean>(false);
  const [isCuradorOpen, setIsCuradorOpen] = useState<boolean>(false);
  const [curadorTab, setCuradorTab] = useState<'consultar' | 'roteiro'>('consultar');
  const [isFilterRecModalOpen, setIsFilterRecModalOpen] = useState<boolean>(false);

  // Subscription, B2B & Monetization Modals
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isB2BModalOpen, setIsB2BModalOpen] = useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);
  const [filteredCatalog, setFilteredCatalog] = useState<{
    name: string;
    itemIds: string[];
  } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gamificação 1984: Diário e Baú de Memórias de Leo
  const [collectedMemoryIds, setCollectedMemoryIds] = useState<string[]>(() => obterMemoriasColetadas());
  const [isBauOpen, setIsBauOpen] = useState<boolean>(false);
  const [dreamModalMemoria, setDreamModalMemoria] = useState<FragmentoMemoria80 | null>(null);
  const [isDreamModalOpen, setIsDreamModalOpen] = useState<boolean>(false);

  const handleColetarMemoria = (memoria: FragmentoMemoria80) => {
    const result = coletarMemoria(memoria.id);
    const updated = obterMemoriasColetadas();
    setCollectedMemoryIds(updated);

    // Salva automaticamente o objeto correspondente no acervo pessoal (favoritos)
    if (memoria.linkedArchiveId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === memoria.linkedArchiveId
            ? { ...it, isFavorite: true }
            : it
        )
      );
    }

    setDreamModalMemoria(memoria);
    setIsDreamModalOpen(true);

    if (result.isNovo) {
      showToast(`✨ Objeto resgatado: "${memoria.hiddenObjectName}" guardado no seu Baú e Salvos!`);
      if (result.completouDecada) {
        audioEngine.playKey90sUnlock();
        setTimeout(() => {
          showToast('🗝️ 1984 CONCLUÍDO! A Chave Dourada do Baú de 1994 foi forjada para você!');
        }, 1200);
      }
    }
  };

  const handleResetMemoriaProgress = () => {
    setCollectedMemoryIds([]);
    showToast('Caça aos objetos reiniciada. Bons achados pelas leituras!');
  };

  // Plan Selection handler
  const handleSelectPlan = (tier: SubscriptionTier, cycle: BillingCycle) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        subscription: {
          tier,
          cycle,
          status: tier === 'freemium' ? 'free' : 'active',
          startedAt: new Date().toISOString().split('T')[0],
          renewsAt: cycle === 'annual' ? '2027-09-29' : '2026-10-29',
          syncedServices: tier === 'sync' ? ['spotify', 'mubi', 'criterion'] : [],
          unlimitedRecommendations: tier !== 'freemium',
          nicheSearchUnlocked: tier !== 'freemium',
          aiCuratorUnlimited: tier === 'sync',
          customAnalyticsReports: tier === 'sync',
        },
      };
    });
  };

  const handleFilterByCatalog = (itemIds: string[], catalogName: string) => {
    setFilteredCatalog({ name: catalogName, itemIds });
    document.getElementById('filtro-geral-acervo')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  // Section Decade Filter State (e.g. 'todas', '1920s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s')
  const [selectedDecade, setSelectedDecade] = useState<string>('todas');
  const filteredWorksCount = items.filter((i) => {
    const matchCat = activeCategory === 'todos' || i.category === activeCategory;
    const matchDec = selectedDecade === 'todas' || i.decade === selectedDecade;
    return matchCat && matchDec;
  }).length;

  const handleOpenFilterRecommendation = (cat: Category | 'todos', dec: string) => {
    setActiveCategory(cat);
    setSelectedDecade(dec);
    setIsFilterRecModalOpen(true);
  };

  // Accessibility: Screen Reader Announcer for Dynamic Filter updates
  useEffect(() => {
    const categoryNames: Record<string, string> = {
      todos: 'Todas as categorias',
      danca: 'Dança',
      musica: 'Música',
      cinema: 'Cinema',
      'artes-plasticas': 'Artes Plásticas',
      eletronicos: 'Eletrônicos',
    };
    const decText = selectedDecade === 'todas' ? 'todas as épocas' : `década de ${selectedDecade}`;
    announce(`Filtros: ${categoryNames[activeCategory] || activeCategory}, ${decText}. ${filteredWorksCount} registros disponíveis.`);
  }, [activeCategory, selectedDecade, filteredWorksCount, announce]);

  // Featured Item (highlighted in Curadoria Section)
  const featuredItem = items[0] || INITIAL_ARCHIVE[0];

  // Save items to localStorage on change (omitindo comments, que agora vivem exclusivamente na API FastAPI)
  useEffect(() => {
    try {
      const itemsWithoutComments = items.map(({ comments, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsWithoutComments));
    } catch {
      // ignore
    }
  }, [items]);

  // Save profile to localStorage on change
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(currentUser));
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Dynamic Monthly Wrapped calculation based on items state
  const currentMonthWrapped: MonthlyWrapped = useMemo(() => {
    // Calculate category distribution of liked/read items
    const likedItems = items.filter((i) => i.isLiked);
    const totalEngagements = items.reduce((acc, curr) => acc + (curr.readsCount || 0) + (curr.likesCount || 0), 0) || 1;

    const catCounts: Record<Category, number> = {
      danca: items.filter((i) => i.category === 'danca').reduce((acc, c) => acc + c.likesCount + c.readsCount, 0),
      musica: items.filter((i) => i.category === 'musica').reduce((acc, c) => acc + c.likesCount + c.readsCount, 0),
      cinema: items.filter((i) => i.category === 'cinema').reduce((acc, c) => acc + c.likesCount + c.readsCount, 0),
      'artes-plasticas': items.filter((i) => i.category === 'artes-plasticas').reduce((acc, c) => acc + c.likesCount + c.readsCount, 0),
      eletronicos: items.filter((i) => i.category === 'eletronicos').reduce((acc, c) => acc + c.likesCount + c.readsCount, 0),
    };

    // Dominant category
    const entries = Object.entries(catCounts) as [Category, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const dominantCategory = entries[0]?.[0] || 'musica';

    const categoryPercentages = [
      { category: 'musica' as Category, label: 'Música', percentage: Math.max(12, Math.round((catCounts.musica / totalEngagements) * 100)) },
      { category: 'cinema' as Category, label: 'Cinema', percentage: Math.max(10, Math.round((catCounts.cinema / totalEngagements) * 100)) },
      { category: 'danca' as Category, label: 'Dança', percentage: Math.max(8, Math.round((catCounts.danca / totalEngagements) * 100)) },
      { category: 'eletronicos' as Category, label: 'Eletrônicos', percentage: Math.max(15, Math.round((catCounts.eletronicos / totalEngagements) * 100)) },
      { category: 'artes-plasticas' as Category, label: 'Artes Plásticas', percentage: Math.max(10, Math.round((catCounts['artes-plasticas'] / totalEngagements) * 100)) },
    ];

    return {
      id: 'wrapped-2026-09',
      monthName: 'Setembro',
      monthCode: '2026-09',
      year: 2026,
      themeTitle: 'Frequências Magnéticas, Películas 35mm & Gravidade Suspensa',
      themeSubtitle: 'Sua curadoria pessoal deste mês revelou fascínio por equipamentos de som e expressão corporal.',
      personaTitle: 'Arqueólogo Sonoro & Esteta do Movimento',
      personaDescription:
        'Você passou mais tempo explorando o ruído das fitas cassete, discos de vinil e os gestos viscerais da dança contemporânea do que 89% dos visitantes da plataforma.',
      dominantCategory,
      categoryPercentages,
      dominantDecade: '1970s',
      topItemIds: likedItems.slice(0, 3).map((i) => i.id).concat(['syn-mus-01', 'syn-ele-01']),
      curatedPicks: [
        {
          title: 'Sony Walkman TPS-L2 & As Fitas Cassete',
          category: 'eletronicos',
          creator: 'Nobutoshi Kihara & Sony',
          year: 1979,
          reason: 'Baseado no seu gosto por Clube da Esquina, a audição privada em fita K7 expande sua jornada sensorial.',
          linkedArchiveId: 'syn-ele-01',
        },
        {
          title: 'Café Müller & O Teatro da Vulnerabilidade',
          category: 'danca',
          creator: 'Pina Bausch',
          year: 1978,
          reason: 'A tensão cênica e os olhos vendados dialogam com os temas cinematográficos que você explorou.',
          linkedArchiveId: 'syn-dan-01',
        },
        {
          title: 'Deus e o Diabo na Terra do Sol (35mm)',
          category: 'cinema',
          creator: 'Glauber Rocha',
          year: 1964,
          reason: 'A montagem rítmica e a urgência estética do Cinema Novo para coroar suas descobertas.',
          linkedArchiveId: 'syn-cin-01',
        },
      ],
      affinityBadges: [
        'Explorador do Século XX',
        'Fidelidade Analógica',
        'Vanguarda Cênica',
        'Curador Mensal Ativo',
      ],
    };
  }, [items]);

  // Audio Play / Pause handler
  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      audioEngine.play((sec) => {
        setElapsedSeconds(sec);
      });
      setIsPlaying(true);
      showToast(`Tocando agora: ${playingItem.title} no Toca-Discos`);
    }
  };

  // Play a specific item from cards or modal
  const handlePlayItem = (item: ArchiveItem) => {
    if (playingItem.id === item.id && isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }

    setPlayingItem(item);
    setElapsedSeconds(0);
    audioEngine.play((sec) => {
      setElapsedSeconds(sec);
    });
    setIsPlaying(true);
    showToast(`Carregado no vinil: ${item.title}`);

    // Smooth scroll to vinyl player section
    document.getElementById('sala-audicao')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Open full article and record read interaction for Wrapped
  const handleOpenArticle = (item: ArchiveItem) => {
    // Increment read count
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, readsCount: (it.readsCount || 0) + 1 } : it))
    );
    setSelectedModalItem(item);
  };

  // Toggle like (persists and computes in Wrapped)
  const handleLikeItem = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextState = !it.isLiked;
          const updatedLikes = nextState ? it.likesCount + 1 : Math.max(0, it.likesCount - 1);
          showToast(
            nextState
              ? `"${it.title}" curtida! Adicionada às métricas do seu Wrapped.`
              : `"${it.title}" removida das curtidas.`
          );
          return {
            ...it,
            isLiked: nextState,
            likesCount: updatedLikes,
          };
        }
        return it;
      })
    );
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextState = !it.isFavorite;
          showToast(
            nextState ? `"${it.title}" salva no seu acervo.` : `"${it.title}" removida do acervo.`
          );
          return { ...it, isFavorite: nextState };
        }
        return it;
      })
    );
  };

  // Mark complete read (Curador Synthetica signal - Seção 7)
  const handleCompleteRead = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextState = !it.hasCompletedRead;
          showToast(
            nextState
              ? `"${it.title}" marcada como leitura completa! O Curador Synthetica integrará este percurso ao seu Wrapped.`
              : `Status de leitura completa desmarcado.`
          );
          return {
            ...it,
            hasCompletedRead: nextState,
            readsCount: nextState ? (it.readsCount || 0) + 1 : it.readsCount,
          };
        }
        return it;
      })
    );
  };

  // Share item with copy-link
  const handleShareItem = (item: ArchiveItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, sharesCount: (it.sharesCount || 0) + 1 } : it))
    );
    showToast(`Link de "${item.title}" copiado para a área de transferência!`);
  };

  // Add comment to archive item via FastAPI backend
  const handleAddComment = async (itemId: string, commentText: string): Promise<void> => {
    const idUsuario = currentUser?.numericId || 1;
    const autorNome = currentUser?.name || 'Sofia Valente';

    try {
      const novoComentario = await criarComentario(itemId, {
        id_usuario: idUsuario,
        autor_nome: autorNome,
        texto: commentText,
      });

      setItems((prev) =>
        prev.map((it) => {
          if (it.id === itemId) {
            return {
              ...it,
              comments: [novoComentario, ...(it.comments || [])],
            };
          }
          return it;
        })
      );

      if (selectedModalItem && selectedModalItem.id === itemId) {
        setSelectedModalItem((prev) =>
          prev
            ? {
                ...prev,
                comments: [novoComentario, ...(prev.comments || [])],
              }
            : null
        );
      }

      showToast('Comentário publicado no acervo!');
    } catch (error: any) {
      console.error('Erro ao adicionar comentário:', error);
      showToast(error.message || 'Erro ao publicar comentário na API.');
      throw error;
    }
  };

  // Edit comment via FastAPI backend
  const handleEditComment = async (idComentario: number, novoTexto: string): Promise<void> => {
    const idUsuario = currentUser?.numericId || 1;

    try {
      const comentarioAtualizado = await editarComentario(idComentario, {
        id_usuario: idUsuario,
        texto: novoTexto,
      });

      setItems((prev) =>
        prev.map((it) => ({
          ...it,
          comments: (it.comments || []).map((c) =>
            c.id_comentario === idComentario || c.id === String(idComentario)
              ? comentarioAtualizado
              : c
          ),
        }))
      );

      if (selectedModalItem) {
        setSelectedModalItem((prev) =>
          prev
            ? {
                ...prev,
                comments: (prev.comments || []).map((c) =>
                  c.id_comentario === idComentario || c.id === String(idComentario)
                    ? comentarioAtualizado
                    : c
                ),
              }
            : null
        );
      }

      showToast('Comentário editado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao editar comentário:', error);
      showToast(error.message || 'Erro ao editar comentário na API.');
      throw error;
    }
  };

  // Delete comment via FastAPI backend
  const handleDeleteComment = async (idComentario: number): Promise<void> => {
    const idUsuario = currentUser?.numericId || 1;

    try {
      await excluirComentario(idComentario, idUsuario);

      setItems((prev) =>
        prev.map((it) => ({
          ...it,
          comments: (it.comments || []).filter(
            (c) => c.id_comentario !== idComentario && c.id !== String(idComentario)
          ),
        }))
      );

      if (selectedModalItem) {
        setSelectedModalItem((prev) =>
          prev
            ? {
                ...prev,
                comments: (prev.comments || []).filter(
                  (c) => c.id_comentario !== idComentario && c.id !== String(idComentario)
                ),
              }
            : null
        );
      }

      showToast('Comentário excluído do acervo.');
    } catch (error: any) {
      console.error('Erro ao excluir comentário:', error);
      showToast(error.message || 'Erro ao excluir comentário na API.');
      throw error;
    }
  };

  // Like a comment
  const handleLikeComment = (itemId: string, commentId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const updatedComments = (it.comments || []).map((c) =>
            c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
          );
          return { ...it, comments: updatedComments };
        }
        return it;
      })
    );

    if (selectedModalItem && selectedModalItem.id === itemId) {
      setSelectedModalItem((prev) =>
        prev
          ? {
              ...prev,
              comments: (prev.comments || []).map((c) =>
                c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
              ),
            }
          : null
      );
    }
  };

  // Add new item to archive
  const handleAddItem = (newItemData: Omit<ArchiveItem, 'id' | 'createdAt'>) => {
    const newItem: ArchiveItem = {
      ...newItemData,
      id: `syn-custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isLiked: false,
      likesCount: 1,
      sharesCount: 0,
      readsCount: 0,
      comments: [],
    };

    setItems((prev) => [newItem, ...prev]);
    showToast(`Obra "${newItem.title}" catalogada com sucesso!`);
    setPlayingItem(newItem);
  };

  // Delete item from archive
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedModalItem?.id === id) {
      setSelectedModalItem(null);
    }
    showToast('Obra removida do acervo.');
  };

  // Random curatorship picker
  const handleRandomCuratorship = () => {
    if (items.length === 0) return;
    const randomIndex = Math.floor(Math.random() * items.length);
    const chosen = items[randomIndex];
    handleOpenArticle(chosen);
    showToast(`Obra sorteada: "${chosen.title}" (${chosen.year})`);
  };

  // Open item from Wrapped picks
  const handleOpenFromWrapped = (id: string) => {
    const target = items.find((i) => i.id === id);
    if (target) {
      setIsWrappedOpen(false);
      handleOpenArticle(target);
    } else {
      showToast('Obra em destaque selecionada.');
    }
  };

  // Counts across the 5 categories
  const dancaCount = items.filter((i) => i.category === 'danca').length;
  const musicaCount = items.filter((i) => i.category === 'musica').length;
  const cinemaCount = items.filter((i) => i.category === 'cinema').length;
  const artesCount = items.filter((i) => i.category === 'artes-plasticas').length;
  const eletronicosCount = items.filter((i) => i.category === 'eletronicos').length;

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <div className="min-h-screen bg-white dark:bg-[#0d1514] text-slate-900 dark:text-[#f1f5f4] transition-colors duration-200 flex flex-col selection:bg-[#EFAEC4] selection:text-[#153833] overflow-x-clip">
      {/* Skip Links for Accessibility Navigation (WCAG 2.4.1) */}
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <a href="#filtro-geral-acervo" className="skip-link" style={{ left: '260px' }}>
        Pular para os filtros de época
      </a>
      <a href="#secao-vinil" className="skip-link" style={{ left: '490px' }}>
        Pular para o toca-discos
      </a>

      {/* 1. Navbar / Header */}
      <Navbar
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAuth={(mode = 'login') => {
          setAuthModalMode(mode);
          setIsAuthModalOpen(true);
        }}
        onOpenWrapped={() => setIsWrappedOpen(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenB2B={() => setIsB2BModalOpen(true)}
        onOpenA11y={openPanel}
        onOpenBauMemorias={() => setIsBauOpen(true)}
        collectedMemoryCount={collectedMemoryIds.length}
        currentUser={currentUser}
      />

      {/* Institutional B2B Catalog Filter Notification Banner */}
      {filteredCatalog && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 sm:pt-24 pb-2 animate-in slide-in-from-top duration-300">
          <div className="p-4 rounded-2xl bg-[#153833] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl border border-white/20">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EFAEC4] animate-ping" />
              <span className="text-xs sm:text-sm font-bold">
                Exibindo catálogo institucional parceiro: <strong>{filteredCatalog.name}</strong> ({filteredCatalog.itemIds.length} obras em destaque patrocinado)
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilteredCatalog(null);
                showToast('Filtro de catálogo parceiro desativado. Exibindo todo o acervo.');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer whitespace-nowrap"
            >
              Ver Todo o Acervo
            </button>
          </div>
        </div>
      )}

      {/* Main Landmark Area */}
      <main id="conteudo-principal" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 2. Hero Banner with Monthly Renewal & Wrapped CTA */}
      <HeroBanner
        onExplore={() => {
          (document.getElementById('filtro-geral-acervo') || document.getElementById('secao-danca'))?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
        }}
        onOpenWrapped={() => setIsWrappedOpen(true)}
        onSelectCategory={setActiveCategory}
      />

      {/* 3. Section: "SUA CURADORIA PESSOAL DO PASSADO" */}
      <CuradoriaSection
        featuredItem={featuredItem}
        totalItems={items.length}
        musicaCount={musicaCount}
        dancaCount={dancaCount}
        cinemaCount={cinemaCount}
        artesCount={artesCount}
        eletronicosCount={eletronicosCount}
        onSelectFeatured={handleOpenArticle}
        onPlayItem={handlePlayItem}
        isPlayingFeatured={isPlaying && playingItem.id === featuredItem.id}
        onRandomCuratorship={handleRandomCuratorship}
        onOpenWrapped={() => setIsWrappedOpen(true)}
        onOpenCuradorTour={() => {
          setCuradorTab('roteiro');
          setIsCuradorOpen(true);
        }}
        onOpenBauMemorias={() => setIsBauOpen(true)}
        collectedMemoryCount={collectedMemoryIds.length}
      />

      {/* 4. Section: Holographic Vinyl Record Turntable & Listening Room */}
      <VinylPlayerSection
        currentItem={playingItem}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextTrack={() => {
          const currentIndex = items.findIndex((it) => it.id === playingItem.id);
          const nextItem = items[(currentIndex + 1) % items.length];
          handlePlayItem(nextItem);
        }}
        onPrevTrack={() => {
          const currentIndex = items.findIndex((it) => it.id === playingItem.id);
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          handlePlayItem(items[prevIndex]);
        }}
        elapsedSeconds={elapsedSeconds}
      />

      {/* 5. Filtro de Década / Época para as Seções (Monte seu Mix) */}
      <SectionDecadeFilterBar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedDecade={selectedDecade}
        onSelectDecade={setSelectedDecade}
        totalWorksCount={items.length}
        filteredWorksCount={filteredWorksCount}
        onOpenRecommendation={handleOpenFilterRecommendation}
      />

      {/* 5. Thematic Gallery Sections with 3D Centerpieces and Seamless Color Transitions */}

      {/* 5.1 SEÇÃO DE DANÇA */}
      <GallerySection
        category="danca"
        items={items}
        onOpenArticle={handleOpenArticle}
        onLike={handleLikeItem}
        onShare={handleShareItem}
        onPlayAudio={handlePlayItem}
        selectedDecade="todas"
      />
      <SectionDivider
        fromColor="#12081f"
        toColor="#0d2621"
        variant="wave"
      />

      {/* 5.2 SEÇÃO DE MÚSICA */}
      <GallerySection
        category="musica"
        items={items}
        onOpenArticle={handleOpenArticle}
        onLike={handleLikeItem}
        onShare={handleShareItem}
        onPlayAudio={handlePlayItem}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        selectedDecade="todas"
      />
      <SectionDivider
        fromColor="#091a17"
        toColor="#1c1917"
        variant="curve"
      />

      {/* 5.3 SEÇÃO DE CINEMA */}
      <GallerySection
        category="cinema"
        items={items}
        onOpenArticle={handleOpenArticle}
        onLike={handleLikeItem}
        onShare={handleShareItem}
        onPlayAudio={handlePlayItem}
        selectedDecade="todas"
      />
      <SectionDivider
        fromColor="#141211"
        toColor="#131b2e"
        variant="tilt"
      />

      {/* 5.4 SEÇÃO DE ARTES PLÁSTICAS */}
      <GallerySection
        category="artes-plasticas"
        items={items}
        onOpenArticle={handleOpenArticle}
        onLike={handleLikeItem}
        onShare={handleShareItem}
        onPlayAudio={handlePlayItem}
        selectedDecade="todas"
      />
      <SectionDivider
        fromColor="#0d1322"
        toColor="#0a192f"
        variant="slant"
      />

      {/* 5.5 SEÇÃO DE ELETRÔNICOS */}
      <GallerySection
        category="eletronicos"
        items={items}
        onOpenArticle={handleOpenArticle}
        onLike={handleLikeItem}
        onShare={handleShareItem}
        onPlayAudio={handlePlayItem}
        selectedDecade="todas"
      />

      {/* 5.6 SEÇÃO B2B: Catálogos e Acervos Patrocinados por Gravadoras & Produtoras Audiovisuais */}
      <B2BPartnerSection
        onOpenB2BModal={() => setIsB2BModalOpen(true)}
        onFilterByCatalog={handleFilterByCatalog}
        onShowToast={showToast}
      />

      {/* 5.7 SEÇÃO E-COMMERCE: Boutique de Artefatos & Loja do Acervo (Comissão por Venda) */}
      <CulturalStoreSection
        onShowToast={showToast}
      />

      {/* 5.8 SEÇÃO ASSINATURAS: Modelos Recorrentes (Freemium, Indie, Sync) */}
      <SubscriptionSection
        currentSubscription={currentUser?.subscription}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
      />
      </main>

      {/* 6. Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenB2B={() => setIsB2BModalOpen(true)}
      />

      {/* Modals */}

      {/* Full Curatorial Article & Historical Context Modal */}
      <ArchiveItemModal
        item={selectedModalItem}
        allItems={items}
        onClose={() => setSelectedModalItem(null)}
        onLike={handleLikeItem}
        onToggleFavorite={handleToggleFavorite}
        onCompleteRead={handleCompleteRead}
        onSelectArticle={(item) => setSelectedModalItem(item)}
        onShare={handleShareItem}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLikeComment}
        onPlay={handlePlayItem}
        isPlaying={isPlaying && selectedModalItem?.id === playingItem.id}
        currentUserId={currentUser?.numericId || 1}
        currentUserName={currentUser?.name || 'Sofia Valente'}
        currentUserAvatar={currentUser?.avatar}
        userSubscription={currentUser?.subscription}
        onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
        onShowToast={showToast}
        collectedMemoryIds={collectedMemoryIds}
        onColetarMemoria={handleColetarMemoria}
        onOpenBauMemorias={() => setIsBauOpen(true)}
      />

      {/* Monthly Wrapped Retrospective & Social Affinity Modal */}
      <WrappedView
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        currentUser={currentUser}
        wrappedData={currentMonthWrapped}
        historicalWrappeds={HISTORICAL_WRAPPEDS}
        friends={MOCK_FRIENDS}
        items={items}
        onOpenArticleById={handleOpenFromWrapped}
        onRequireLogin={() => {
          setIsWrappedOpen(false);
          setAuthModalMode('register');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Reflected Auth Modal (Login / Register with Wrapped incentive) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={(user) => {
          setCurrentUser(user);
          showToast(`Bem-vindo de volta ao acervo, ${user.name}!`);
        }}
      />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Interactive Curador Synthetica Assistant & Tour Guide */}
      <CuradorAssistant
        items={items}
        onOpenArticle={(item) => setSelectedModalItem(item)}
        isOpen={isCuradorOpen}
        onOpenChange={setIsCuradorOpen}
        initialTab={curadorTab}
      />

      {/* Pop-up de Recomendação Filtrada (Monte seu Mix) */}
      <FilterRecommendationModal
        isOpen={isFilterRecModalOpen}
        onClose={() => setIsFilterRecModalOpen(false)}
        items={items}
        initialCategory={activeCategory}
        initialDecade={selectedDecade}
        onOpenArticle={(item) => {
          setIsFilterRecModalOpen(false);
          handleOpenArticle(item);
        }}
        onPlayItem={(item) => {
          handlePlayItem(item);
        }}
        onLikeItem={handleLikeItem}
        isPlaying={isPlaying}
        playingItemId={playingItem.id}
      />

      {/* Subscription Modal (Freemium, Indie, Sync) */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentSubscription={currentUser?.subscription}
        onSelectPlan={handleSelectPlan}
        onShowToast={showToast}
      />

      {/* B2B Partner Portal & Catalog Submission Modal */}
      <B2BPartnerModal
        isOpen={isB2BModalOpen}
        onClose={() => setIsB2BModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Sync Member Cultural Analytics & Streaming Integrations Modal */}
      <UserAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        currentUser={currentUser}
        items={items}
        onUpgradeToSync={() => {
          setIsAnalyticsModalOpen(false);
          setIsSubscriptionModalOpen(true);
        }}
        onShowToast={showToast}
      />

      {/* 1984 Memory Chest Modal (Meu Baú de Memórias) */}
      <BauMemoriasModal
        isOpen={isBauOpen}
        onClose={() => setIsBauOpen(false)}
        collectedIds={collectedMemoryIds}
        allItems={items}
        onOpenArticle={(item) => {
          setIsBauOpen(false);
          handleOpenArticle(item);
        }}
        onPlayItem={(item) => {
          handlePlayItem(item);
        }}
        onResetProgress={handleResetMemoriaProgress}
        onFilterDecade={(dec) => {
          setSelectedDecade(dec);
          showToast(`⏳ Acervo filtrado para a década de 1990! Encontre os objetos de 1994.`);
        }}
      />

      {/* Dream Transition Modal (Animação: Abrir os olhos de um sonho) */}
      <DreamTransitionModal
        isOpen={isDreamModalOpen}
        onClose={() => setIsDreamModalOpen(false)}
        memoria={dreamModalMemoria}
        linkedItem={dreamModalMemoria ? items.find((i) => i.id === dreamModalMemoria.linkedArchiveId) : undefined}
        onOpenArticle={(item) => {
          setIsDreamModalOpen(false);
          handleOpenArticle(item);
        }}
        onPlayItem={(item) => {
          handlePlayItem(item);
        }}
        onOpenBau={() => {
          setIsDreamModalOpen(false);
          setIsBauOpen(true);
        }}
      />

      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed bottom-22 right-6 z-50 px-5 py-3 rounded-2xl bg-[#153833] text-white shadow-2xl border border-white/20 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="w-2 h-2 rounded-full bg-[#EFAEC4] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Accessibility Modal & Quick Floating Widget */}
      <AccessibilityModal />
      <AccessibilityFloatingButton />
    </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <MainAppContent />
    </AccessibilityProvider>
  );
}
