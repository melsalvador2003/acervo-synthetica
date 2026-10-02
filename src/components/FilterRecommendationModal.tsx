import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Sparkles,
  Disc,
  Heart,
  ArrowRight,
  Layers,
  Calendar,
  Compass,
  Check,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { ArchiveItem, Category } from '../types';
import { SECTIONS_CONFIG, DECADES_CONFIG } from './SectionDecadeFilterBar';

interface FilterRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ArchiveItem[];
  initialCategory: Category | 'todos';
  initialDecade: string; // 'todas' | '1920s' | ...
  onOpenArticle: (item: ArchiveItem) => void;
  onPlayItem: (item: ArchiveItem) => void;
  onLikeItem: (id: string, e?: React.MouseEvent) => void;
  isPlaying?: boolean;
  playingItemId?: string;
}

export const FilterRecommendationModal: React.FC<FilterRecommendationModalProps> = ({
  isOpen,
  onClose,
  items,
  initialCategory,
  initialDecade,
  onOpenArticle,
  onPlayItem,
  onLikeItem,
  isPlaying,
  playingItemId,
}) => {
  const [filterCategory, setFilterCategory] = useState<Category | 'todos'>(initialCategory);
  const [filterDecade, setFilterDecade] = useState<string>(initialDecade);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Sync with initial props when opened
  useEffect(() => {
    if (isOpen) {
      setFilterCategory(initialCategory);
      setFilterDecade(initialDecade);
      setSelectedItemId(null);
    }
  }, [isOpen, initialCategory, initialDecade]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Matching items based on filter
  const matchingItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = filterCategory === 'todos' || item.category === filterCategory;
      const matchDec = filterDecade === 'todas' || item.decade === filterDecade;
      return matchCat && matchDec;
    });
  }, [items, filterCategory, filterDecade]);

  // If no exact match, fallback to closest items in the same category or decade
  const fallbackItems = useMemo(() => {
    if (matchingItems.length > 0) return [];
    if (filterCategory !== 'todos') {
      return items.filter((i) => i.category === filterCategory);
    }
    if (filterDecade !== 'todas') {
      return items.filter((i) => i.decade === filterDecade);
    }
    return items.slice(0, 3);
  }, [items, matchingItems, filterCategory, filterDecade]);

  // The active featured recommendation
  const featuredItem = useMemo(() => {
    if (matchingItems.length > 0) {
      if (selectedItemId) {
        const found = matchingItems.find((i) => i.id === selectedItemId);
        if (found) return found;
      }
      return matchingItems[0];
    }
    if (fallbackItems.length > 0) {
      if (selectedItemId) {
        const found = fallbackItems.find((i) => i.id === selectedItemId);
        if (found) return found;
      }
      return fallbackItems[0];
    }
    return items[0] || null;
  }, [matchingItems, fallbackItems, selectedItemId, items]);

  if (!isOpen || !featuredItem) return null;

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case 'danca':
        return 'Dança & Expressão';
      case 'musica':
        return 'Música & Alta Fidelidade';
      case 'cinema':
        return 'Cinema & Projeção';
      case 'artes-plasticas':
        return 'Artes Plásticas & Ruptura';
      case 'eletronicos':
        return 'Eletrônicos & Equipamentos';
      default:
        return 'Todas as Seções';
    }
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'danca':
        return {
          badge: 'bg-pink-100 text-pink-800 border-pink-200',
          accent: '#f472b6',
        };
      case 'musica':
        return {
          badge: 'bg-pink-100 text-[#E07A9A] border-pink-200',
          accent: '#E07A9A',
        };
      case 'cinema':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          accent: '#d97706',
        };
      case 'artes-plasticas':
        return {
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
          accent: '#0284c7',
        };
      case 'eletronicos':
        return {
          badge: 'bg-pink-100 text-pink-900 border-pink-200',
          accent: '#db2777',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          accent: '#153833',
        };
    }
  };

  const currentTheme = getCategoryTheme(featuredItem.category);
  const isCurrentlyPlaying = isPlaying && playingItemId === featuredItem.id;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 md:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-2 sm:my-6 text-slate-900 max-h-[96vh] sm:max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="relative px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-pink-50/80 via-white to-teal-50/50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#153833] text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#EFAEC4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E07A9A]">
                  Pop-up de Recomendação
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-[#153833] text-white">
                  Mix Ativo
                </span>
              </div>
              <h3
                className="text-lg sm:text-2xl font-black text-[#153833] tracking-tight uppercase leading-none mt-0.5"
                style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
              >
                Sua Recomendação Curatorial
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Quick-Adjust Pills inside Pop-up */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50/90 border-b border-slate-200 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
            <span className="font-mono font-semibold text-[10px] sm:text-[11px] uppercase text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#E07A9A]" />
              Ajustar Filtro no Pop-up:
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-500">
                {matchingItems.length > 0
                  ? `${matchingItems.length} obra${matchingItems.length === 1 ? '' : 's'} no mix`
                  : 'Nenhuma obra exata (exibindo mais próxima)'}
              </span>
              {(filterCategory !== 'todos' || filterDecade !== 'todas') && (
                <button
                  onClick={() => {
                    setFilterCategory('todos');
                    setFilterDecade('todas');
                  }}
                  className="text-[10px] sm:text-[11px] font-mono font-semibold text-pink-600 hover:text-pink-800 underline cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Resetar</span>
                </button>
              )}
            </div>
          </div>

          {/* Categories Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterCategory('todos')}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer border ${
                filterCategory === 'todos'
                  ? 'bg-[#153833] text-white border-[#153833] font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todas Seções
            </button>
            {SECTIONS_CONFIG.map((sec) => {
              const isSelected = filterCategory === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setFilterCategory(sec.id)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-[#153833] text-white border-[#153833] font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sec.label}
                </button>
              );
            })}
          </div>

          {/* Decades Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setFilterDecade('todas')}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer border ${
                filterDecade === 'todas'
                  ? 'bg-[#E07A9A] text-white border-[#E07A9A] font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Todas Décadas
            </button>
            {DECADES_CONFIG.map((dec) => {
              const isSelected = filterDecade === dec.id;
              return (
                <button
                  key={dec.id}
                  onClick={() => setFilterDecade(dec.id)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-[#E07A9A] text-white border-[#E07A9A] font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dec.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          {/* Active Filter Criteria Summary Pill */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-500 font-bold uppercase text-[10px]">
                Filtro Aplicado:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 font-bold text-slate-800 font-mono">
                {categoryLabel(filterCategory)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 border border-pink-200 font-bold text-pink-800 font-mono">
                {filterDecade === 'todas' ? 'Todas as Décadas' : `Anos ${filterDecade}`}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 italic">
              O site completo permanece aberto abaixo deste pop-up
            </span>
          </div>

          {/* Main Recommended Work Card */}
          <div className="rounded-3xl border-2 border-slate-200 bg-white overflow-hidden shadow-lg shadow-slate-100 flex flex-col md:flex-row">
            {/* Image Column */}
            <div className="relative md:w-5/12 h-52 sm:h-64 md:h-auto bg-slate-950 overflow-hidden flex-shrink-0 group">
              <img
                src={featuredItem.coverUrl}
                alt={featuredItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border backdrop-blur-md ${currentTheme.badge}`}
                >
                  {categoryLabel(featuredItem.category)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-black/60 text-white border border-white/20 backdrop-blur-md">
                  {featuredItem.year} • {featuredItem.decade}
                </span>
              </div>

              {/* Format tag */}
              <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] font-mono truncate bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                {featuredItem.mediaFormat}
              </div>
            </div>

            {/* Info Column */}
            <div className="p-4 sm:p-6 md:w-7/12 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  {featuredItem.creator} • {featuredItem.country}
                </div>

                <h4
                  className="text-2xl sm:text-3xl font-black text-[#153833] tracking-tight uppercase leading-tight"
                  style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
                >
                  {featuredItem.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal line-clamp-3 leading-relaxed">
                  {featuredItem.historyText}
                </p>

                {/* Curatorial Note Quote */}
                <div className="mt-4 p-3.5 rounded-2xl bg-pink-50/70 border-l-4 border-[#EFAEC4] text-xs text-slate-700 italic leading-relaxed">
                  <div className="font-mono text-[10px] font-bold uppercase text-[#E07A9A] mb-1 flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    <span>Por que o Curador recomenda para este filtro:</span>
                  </div>
                  "{featuredItem.curatorialNotes}"
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {featuredItem.tags.slice(0, 3).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    onOpenArticle(featuredItem);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full text-xs font-mono font-bold bg-[#153833] text-white hover:bg-[#1f4e47] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Abrir Obra Completa</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#EFAEC4]" />
                </button>

                <button
                  onClick={() => onPlayItem(featuredItem)}
                  className={`py-2.5 px-4 rounded-full text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                    isCurrentlyPlaying
                      ? 'bg-pink-100 text-pink-900 border-pink-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                  title="Tocar no Vinil"
                >
                  <Disc className={`w-3.5 h-3.5 ${isCurrentlyPlaying ? 'animate-spin text-pink-600' : ''}`} />
                  <span>{isCurrentlyPlaying ? 'Tocando' : 'Ouvir no Vinil'}</span>
                </button>

                <button
                  onClick={(e) => onLikeItem(featuredItem.id, e)}
                  className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                    featuredItem.isLiked
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                  }`}
                  title="Curtir"
                >
                  <Heart className={`w-4 h-4 ${featuredItem.isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Other Matched Recommendations Carousel / List if multiple */}
          {matchingItems.length > 1 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#E07A9A]" />
                  <span>Outras Obras Recomendadas no Mix ({matchingItems.length})</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Clique para visualizar no destaque
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingItems.map((item) => {
                  const isSelected = item.id === featuredItem.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-pink-50/50 border-[#E07A9A] ring-2 ring-[#E07A9A]/30 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase truncate">
                            {item.decade} • {item.creator}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#153833] text-white font-bold">
                              Exibindo
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.genre || item.mediaFormat}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0 flex-wrap gap-3">
          <div className="text-xs text-slate-500">
            Dica: Role a página para ver todas as 5 galerias e o acervo na íntegra.
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-mono font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Continuar Explorando o Acervo
          </button>
        </div>
      </div>
    </div>
  );
};
