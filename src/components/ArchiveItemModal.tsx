import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Share2,
  Sparkles,
  Users,
  History,
  Award,
  Tag,
  MessageSquare,
  Send,
  Check,
  ThumbsUp,
  Radio,
  Bookmark,
  Compass,
  ArrowRight,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { ArchiveItem, CommentItem, UserSubscription } from '../types';
import { getNextArticleRecommendation, obterAnaliseCriticaObra } from '../utils/curadorApi';
import {
  listarComentarios,
  alternarCurtidaComentario,
} from '../utils/comentariosApi';
import { AudioDescriptionPlayer } from './AudioDescriptionPlayer';
import { ListaComentarios } from './ListaComentarios';
import { AffiliateStreamWidget } from './AffiliateStreamWidget';
import { speechService } from '../utils/speechSynthesis';
import { CenaMemoriaIlustrada } from './CenaMemoriaIlustrada';
import { buscarMemoriaPorObraId, FragmentoMemoria80 } from '../data/memoriaAnos80';
import { handleImageFallback } from '../utils/imageFallback';

interface ArchiveItemModalProps {
  item: ArchiveItem | null;
  allItems?: ArchiveItem[];
  onClose: () => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite?: (id: string) => void;
  onCompleteRead?: (id: string) => void;
  onSelectArticle?: (item: ArchiveItem) => void;
  onShare: (item: ArchiveItem, e: React.MouseEvent) => void;
  onAddComment: (itemId: string, commentText: string) => Promise<void> | void;
  onEditComment?: (idComentario: number, novoTexto: string) => Promise<void> | void;
  onDeleteComment?: (idComentario: number) => Promise<void> | void;
  onLikeComment?: (itemId: string, commentId: string) => void;
  onPlay?: (item: ArchiveItem) => void;
  isPlaying?: boolean;
  currentUserId?: number;
  currentUserName?: string;
  currentUserAvatar?: string;
  userSubscription?: UserSubscription;
  onOpenSubscriptionModal?: () => void;
  onShowToast?: (msg: string) => void;
  collectedMemoryIds?: string[];
  onColetarMemoria?: (memoria: FragmentoMemoria80) => void;
  onOpenBauMemorias?: () => void;
}

export const ArchiveItemModal: React.FC<ArchiveItemModalProps> = ({
  item,
  allItems = [],
  onClose,
  onLike,
  onToggleFavorite,
  onCompleteRead,
  onSelectArticle,
  onShare,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
  onPlay,
  isPlaying,
  currentUserId = 1,
  currentUserName = 'Sofia Valente',
  currentUserAvatar,
  userSubscription,
  onOpenSubscriptionModal,
  onShowToast = () => {},
  collectedMemoryIds = [],
  onColetarMemoria,
  onOpenBauMemorias,
}) => {
  const [copied, setCopied] = useState(false);
  const [nextRec, setNextRec] = useState<{
    proximoArtigoId: string;
    proximoTitulo: string;
    conexaoExplicada: string;
  } | null>(null);
  const [loadingRec, setLoadingRec] = useState(false);
  const [curatorAnalysis, setCuratorAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Estados locais para a gestão reativa de comentários servidos via FastAPI
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Estados para encolher dinamicamente a imagem no scroll e priorizar a leitura do conteúdo
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Redefinir posição de rolagem e tamanho do banner ao abrir ou alternar de obra
  useEffect(() => {
    setIsScrolled(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [item?.id]);

  const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    // Quando o usuário rola além do limiar inicial (24px), a imagem encolhe suavemente
    if (scrollTop > 24 && !isScrolled) {
      setIsScrolled(true);
    } else if (scrollTop <= 24 && isScrolled) {
      setIsScrolled(false);
    }
  };

  // Carregar comentários da API FastAPI ao abrir a obra
  useEffect(() => {
    if (!item?.id) return;
    let isMounted = true;
    setLoadingComments(true);
    setCommentError(null);

    listarComentarios(item.id)
      .then((dados) => {
        if (isMounted) {
          setComments(dados);
          setLoadingComments(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          // Fallback gracioso com os comentários em memória caso a API esteja iniciando
          setComments(item.comments || []);
          setCommentError(err.message || 'Não foi possível carregar os comentários do backend.');
          setLoadingComments(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [item?.id]);

  useEffect(() => {
    setCuratorAnalysis(null);
  }, [item?.id]);

  const handleRequestAnalysis = async () => {
    if (!item || loadingAnalysis) return;
    setLoadingAnalysis(true);
    try {
      const analise = await obterAnaliseCriticaObra(item);
      setCuratorAnalysis(analise);
    } catch {
      // fallback
    } finally {
      setLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    if (!item) return;

    let isMounted = true;
    setLoadingRec(true);

    getNextArticleRecommendation(item, allItems)
      .then((data) => {
        if (isMounted) {
          setNextRec(data);
          setLoadingRec(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingRec(false);
      });

    return () => {
      isMounted = false;
    };
  }, [item?.id, allItems.length]);

  // Handle Escape key to close modal & stop audio description
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speechService.stop();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      speechService.stop();
    };
  }, [onClose]);

  if (!item) return null;

  const handleClose = () => {
    speechService.stop();
    onClose();
  };

  const handleShareClick = (e: React.MouseEvent) => {
    onShare(item, e);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleAddCommentLocal = async (commentText: string) => {
    if (!item) return;
    setCommentError(null);
    try {
      await onAddComment(item.id, commentText);
      const atualizados = await listarComentarios(item.id);
      setComments(atualizados);
    } catch (err: any) {
      setCommentError(err.message || 'Erro ao publicar comentário.');
      throw err;
    }
  };

  const handleEditCommentLocal = async (idComentario: number, novoTexto: string) => {
    if (!item) return;
    setCommentError(null);
    try {
      if (onEditComment) {
        await onEditComment(idComentario, novoTexto);
      }
      const atualizados = await listarComentarios(item.id);
      setComments(atualizados);
    } catch (err: any) {
      setCommentError(err.message || 'Erro ao atualizar comentário.');
      throw err;
    }
  };

  const handleDeleteCommentLocal = async (idComentario: number) => {
    if (!item) return;
    setCommentError(null);
    try {
      if (onDeleteComment) {
        await onDeleteComment(idComentario);
      }
      const atualizados = await listarComentarios(item.id);
      setComments(atualizados);
    } catch (err: any) {
      setCommentError(err.message || 'Erro ao excluir comentário.');
      throw err;
    }
  };

  const handleLikeCommentLocal = async (idComentario: number) => {
    if (!item) return;
    try {
      await alternarCurtidaComentario(idComentario, currentUserId);
      const atualizados = await listarComentarios(item.id);
      setComments(atualizados);
    } catch {
      // Fallback para callback se a API não estiver conectada
      if (onLikeComment) {
        onLikeComment(item.id, String(idComentario));
      }
    }
  };

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case 'danca':
        return {
          label: 'Dança',
          color: 'bg-pink-100 text-pink-800 border-pink-200',
        };
      case 'musica':
        return {
          label: 'Música',
          color: 'bg-pink-100 text-[#E07A9A] border-pink-200',
        };
      case 'cinema':
        return {
          label: 'Cinema',
          color: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'artes-plasticas':
        return {
          label: 'Artes Plásticas',
          color: 'bg-sky-100 text-sky-800 border-sky-200',
        };
      case 'eletronicos':
        return {
          label: 'Eletrônicos',
          color: 'bg-pink-100 text-pink-900 border-pink-200',
        };
      default:
        return {
          label: cat,
          color: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  const catMeta = getCategoryDetails(item.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] max-w-4xl bg-white dark:bg-[#14211e] sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 flex flex-col focus-visible:outline-none">
        {/* Modal Top Banner with Dynamic Shrinking on Scroll */}
        <div
          id="modal-header-banner"
          onClick={() => {
            if (isScrolled && scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className={`relative w-full overflow-hidden bg-slate-950 flex-shrink-0 transition-all duration-300 ease-out z-20 ${
            isScrolled
              ? 'h-16 sm:h-20 shadow-lg border-b border-slate-800 cursor-pointer'
              : 'h-52 sm:h-76 md:h-84'
          }`}
          title={isScrolled ? 'Clique para retornar ao topo e expandir a imagem' : undefined}
        >
          {/* Background image */}
          <img
            src={item.coverUrl}
            alt={`Fotografia de ${item.title}, autoria de ${item.creator}`}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageFallback(e, item.id, item.category)}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isScrolled ? 'opacity-25 blur-xs scale-105' : 'opacity-100 scale-100'
            }`}
          />
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              isScrolled
                ? 'bg-slate-950/80 backdrop-blur-xs'
                : 'bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/10'
            }`}
          />

          {/* Close button */}
          <button
            id="btn-close-modal"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-5 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md transition-all duration-200 cursor-pointer z-40 border border-white/30 shadow-md focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            title="Fechar ficha do registro (Esc)"
            aria-label="Fechar ficha do registro"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Compact View when Scrolled */}
          {isScrolled ? (
            <div className="absolute inset-0 px-3.5 sm:px-6 flex items-center pr-14 sm:pr-20 z-10 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                {/* Miniature Thumbnail Image */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/30 shadow-md flex-shrink-0 bg-slate-900">
                  <img
                    src={item.coverUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageFallback(e, item.id, item.category)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                    <span
                      className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider border ${catMeta.color}`}
                    >
                      {catMeta.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">
                      {item.decade} • {item.year}
                    </span>
                    <span className="hidden md:inline text-[10px] font-mono text-[#EFAEC4] bg-pink-950/40 px-1.5 py-0.2 rounded border border-[#E07A9A]/30">
                      {item.mediaFormat}
                    </span>
                  </div>
                  <h2
                    id="modal-item-title-collapsed"
                    className="text-xs sm:text-sm md:text-base font-black text-white truncate uppercase tracking-tight"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    {item.title}
                  </h2>
                  <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                    {item.creator} — <span className="italic text-slate-400">{item.role}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Expanded Full Hero View */
            <div className="animate-in fade-in duration-200">
              {/* Category & Decade Badges */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 z-10">
                <span
                  className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider border backdrop-blur-md ${catMeta.color}`}
                >
                  {catMeta.label}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-mono font-bold bg-slate-950/90 text-white backdrop-blur-md border border-white/20 shadow-2xs">
                  {item.decade} • {item.year}
                </span>
                {item.b2bPartner && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#153833]/90 text-[#EFAEC4] backdrop-blur-md border border-[#EFAEC4]/40 flex items-center gap-1 shadow-2xs">
                    <Building2 className="w-3 h-3 text-[#EFAEC4]" />
                    <span>{item.b2bPartner.badge || item.b2bPartner.partnerName}</span>
                  </span>
                )}
              </div>

              {/* Title & Creator Header inside banner */}
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6 z-10">
                <h2
                  id="modal-item-title"
                  className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight uppercase"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  {item.title}
                </h2>
                <p className="text-xs sm:text-base text-slate-200 font-medium mt-0.5 sm:mt-1">
                  {item.creator} — <span className="text-white/90 italic">{item.role}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleContentScroll}
          className="p-4 sm:p-8 space-y-5 sm:space-y-7 overflow-y-auto flex-1 bg-white dark:bg-[#14211e] text-slate-900 dark:text-slate-100"
        >
          {/* Action Bar (Likes, Shares, Wrapped Indicator) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-200 dark:border-white/10">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3">
              {/* Like Button */}
              <button
                type="button"
                onClick={(e) => onLike(item.id, e)}
                aria-label={item.isLiked ? 'Remover curtida' : 'Curtir obra'}
                className={`flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                  item.isLiked
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-white' : ''}`} />
                <span>{item.isLiked ? 'Curtido' : 'Curtir'}</span>
                <span className="opacity-80 font-mono text-[11px]">({item.likesCount})</span>
              </button>

              {/* Play Audio Button */}
              {onPlay && (
                <button
                  type="button"
                  onClick={() => onPlay(item)}
                  aria-label={isPlaying ? 'Pausar no toca-discos' : 'Tocar áudio no toca-discos'}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                    isPlaying
                      ? 'bg-[#E07A9A] text-white font-black'
                      : 'bg-pink-50 dark:bg-[#EFAEC4]/15 text-[#E07A9A] dark:text-[#EFAEC4] border border-pink-200 dark:border-[#EFAEC4]/30 hover:bg-pink-100'
                  }`}
                >
                  <Radio className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
                  <span>{isPlaying ? 'Tocando' : 'Vinil'}</span>
                </button>
              )}

              {/* Save / Favorite Button */}
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.id)}
                  aria-label={item.isFavorite ? 'Remover dos favoritos' : 'Salvar no acervo pessoal'}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                    item.isFavorite
                      ? 'bg-amber-500 text-white shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10'
                  }`}
                  title="Salvar no seu acervo pessoal"
                >
                  <Bookmark className={`w-4 h-4 ${item.isFavorite ? 'fill-white' : ''}`} />
                  <span>{item.isFavorite ? 'Salvo' : 'Salvar'}</span>
                </button>
              )}

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShareClick}
                aria-label="Compartilhar registro"
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#E07A9A] dark:text-[#EFAEC4]" />
                    <span className="text-[#E07A9A] dark:text-[#EFAEC4]">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Compartilhar</span>
                  </>
                )}
              </button>
            </div>

            {/* Wrapped Interaction Metric */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-[#EFAEC4]/10 border border-pink-200 dark:border-[#EFAEC4]/20 text-[#E07A9A] dark:text-[#EFAEC4] text-xs font-semibold self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#E07A9A] dark:text-[#EFAEC4] animate-spin" />
              <span>{item.readsCount} leituras no Wrapped</span>
            </div>
          </div>

          {/* Accessibility Feature: Audiodescrição em Voz Alta */}
          <AudioDescriptionPlayer item={item} />

          {/* Curatorial Note Quote & Perspective */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#E07A9A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nota de Curadoria Afetiva &amp; Época</span>
              </h4>

              <button
                type="button"
                onClick={handleRequestAnalysis}
                disabled={loadingAnalysis}
                className="px-3 py-1.5 rounded-full text-[11px] font-mono font-bold bg-[#153833] text-white hover:bg-[#1e4e47] disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className={`w-3 h-3 text-[#EFAEC4] ${loadingAnalysis ? 'animate-spin' : ''}`} />
                <span>{curatorAnalysis ? 'Atualizar Análise' : 'Análise Crítica do Curador'}</span>
              </button>
            </div>

            <blockquote className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border-l-4 border-[#EFAEC4] text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed italic shadow-2xs">
              "{item.curatorialNotes}"
            </blockquote>

            {curatorAnalysis && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-white to-emerald-50/40 dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724] border border-[#EFAEC4]/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-1 shadow-xs animate-in fade-in duration-300">
                <div className="flex items-center gap-1.5 text-[#153833] dark:text-[#EFAEC4] font-mono text-[11px] font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#E07A9A] dark:text-[#EFAEC4]" />
                  <span>Perspectiva Crítica do Curador:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic pt-1">{curatorAnalysis}</p>
              </div>
            )}
          </div>

          {/* 3 Columns Historical Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Historical Use */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 mb-2">
                  <History className="w-4 h-4" />
                  <h5 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Como era Usado na Época
                  </h5>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.historicalUse}
                </p>
              </div>
            </div>

            {/* Target Audience */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
                  <Users className="w-4 h-4" />
                  <h5 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Público-Alvo Original
                  </h5>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.targetAudience}
                </p>
              </div>
            </div>

            {/* Legacy & Impact */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 mb-2">
                  <Award className="w-4 h-4" />
                  <h5 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Impacto &amp; Legado Histórico
                  </h5>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.legacyImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Full History / Article Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Ensaio &amp; Memória Cultural
              </h4>
              <span className="text-[11px] font-mono text-slate-400">Leitura Completa</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm text-slate-700 dark:text-slate-200 leading-relaxed space-y-3 shadow-2xs">
              <p>{item.historyText}</p>
            </div>

            {/* Relevância Hoje (Século XXI & IA) */}
            {item.todayRelevance && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50/80 via-pink-50/40 to-white dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724] border-2 border-[#E07A9A]/60 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-[#153833] dark:text-[#EFAEC4]">
                  <Sparkles className="w-4 h-4 text-[#E07A9A] dark:text-[#EFAEC4]" />
                  <h5 className="text-xs font-mono font-black uppercase tracking-wider text-[#E07A9A] dark:text-[#EFAEC4]">
                    Relevância Hoje (Século XXI &amp; IA)
                  </h5>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {item.todayRelevance}
                </p>
              </div>
            )}

            {/* Gamificação 1984: Cena Ilustrada com Objeto Escondido do Dia de Leo */}
            {(() => {
              const memoriaAssociada = item ? buscarMemoriaPorObraId(item.id) : undefined;
              if (!memoriaAssociada) return null;
              return (
                <CenaMemoriaIlustrada
                  memoria={memoriaAssociada}
                  isColetado={collectedMemoryIds.includes(memoriaAssociada.id)}
                  onColetar={(m) => onColetarMemoria && onColetarMemoria(m)}
                  onAbrirBau={onOpenBauMemorias}
                />
              );
            })()}

            {/* Complete Read Action Button (Demonstração do percurso completo - Seção 7) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 to-rose-50/70 border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-pink-950 block">
                  {item.hasCompletedRead ? '✓ Você leu este artigo até o fim' : 'Concluiu a leitura deste registro?'}
                </span>
                <p className="text-[11px] text-[#E07A9A]">
                  {item.hasCompletedRead
                    ? 'O sinal de "leitura completa" foi enviado para o Curador Synthetica alimentar seu Wrapped.'
                    : 'Marque para registrar atenção máxima neste conteúdo e sincronizar com o Curador Synthetica.'}
                </p>
              </div>
              {onCompleteRead && (
                <button
                  type="button"
                  onClick={() => onCompleteRead(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-2 flex-shrink-0 ${
                    item.hasCompletedRead
                      ? 'bg-[#E07A9A] text-white'
                      : 'bg-white hover:bg-pink-50 text-[#E07A9A] border border-pink-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{item.hasCompletedRead ? 'Leitura Registrada' : 'Marcar Leitura Completa'}</span>
                </button>
              )}
            </div>

            {/* Fim de artigo: Sugere o próximo registro a ler com conexão explicada pelo Curador IA (Seção 1) */}
            {nextRec && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#153833]/5 via-white to-pink-50/40 border-2 border-[#EFAEC4]/60 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#153833]">
                    <Compass className="w-4 h-4 text-[#E07A9A]" />
                    <h5 className="text-xs font-mono font-black uppercase tracking-wider">
                      O Curador Synthetica sugere a seguir
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-100 text-pink-800 border border-pink-200">
                    Conexão Curatorial
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-pink-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <span className="text-[11px] font-mono text-slate-500 block">Próxima Leitura Recomendada</span>
                    <h6 className="text-sm font-black text-slate-900 leading-snug">
                      {nextRec.proximoTitulo}
                    </h6>
                    <p className="text-xs text-slate-600 italic leading-relaxed pt-0.5">
                      "{nextRec.conexaoExplicada}"
                    </p>
                  </div>

                  {onSelectArticle && allItems.find((a) => a.id === nextRec.proximoArtigoId) && (
                    <button
                      type="button"
                      onClick={() => {
                        const target = allItems.find((a) => a.id === nextRec.proximoArtigoId);
                        if (target) {
                          onSelectArticle(target);
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
                    >
                      <span>Ler Próximo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Streaming & Affiliate Commission Widget */}
          <AffiliateStreamWidget
            item={item}
            onShowToast={onShowToast}
          />

          {/* Technical Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Formato Físico
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 block truncate">
                {item.mediaFormat}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Gênero / Estilo
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 block truncate">
                {item.genre}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                País de Origem
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 block truncate">
                {item.country}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">
                Destaque
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 block truncate">
                {item.notableFeature || 'Acervo Histórico'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Comments Section gerenciada pelo componente dedicado ListaComentarios */}
          <ListaComentarios
            itemId={item.id}
            comments={comments}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserAvatar={currentUserAvatar}
            isLoading={loadingComments}
            error={commentError}
            onAddComment={handleAddCommentLocal}
            onEditComment={handleEditCommentLocal}
            onDeleteComment={handleDeleteCommentLocal}
            onLikeComment={handleLikeCommentLocal}
            onClearError={() => setCommentError(null)}
          />
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 px-4 sm:px-6 bg-slate-50 dark:bg-[#0c1815] border-t border-slate-200 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Synthetica • Preservação Cultural
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors cursor-pointer border border-slate-300 dark:border-white/20 shadow-xs"
          >
            Fechar Registro (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
