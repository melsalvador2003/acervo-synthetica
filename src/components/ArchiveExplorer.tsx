import React, { useState, useMemo } from 'react';
import {
  Search,
  Heart,
  Play,
  Disc3,
  Film,
  Sparkles,
  Filter,
  Star,
  Box,
  Cpu,
  SlidersHorizontal,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { ArchiveItem, Category, FilterDecade } from '../types';

interface ArchiveExplorerProps {
  items: ArchiveItem[];
  activeCategory: Category | 'todos';
  onSelectCategory: (cat: Category | 'todos') => void;
  onSelectItem: (item: ArchiveItem) => void;
  onPlayItem: (item: ArchiveItem) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAddModal?: () => void;
  onOpenBauMemorias?: () => void;
  collectedMemoryCount?: number;
  activePlayingId?: string;
}

export const ArchiveExplorer: React.FC<ArchiveExplorerProps> = ({
  items,
  activeCategory,
  onSelectCategory,
  onSelectItem,
  onPlayItem,
  onToggleFavorite,
  onOpenAddModal,
  onOpenBauMemorias,
  collectedMemoryCount = 0,
  activePlayingId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState<FilterDecade>('todos');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'year-asc' | 'year-desc' | 'rating' | 'title'>('year-asc');

  const decades: { label: string; value: FilterDecade }[] = [
    { label: 'Todas as Décadas', value: 'todos' },
    { label: 'Anos 1890s', value: '1890s' },
    { label: 'Anos 1900s', value: '1900s' },
    { label: 'Anos 1920s', value: '1920s' },
    { label: 'Anos 60', value: '1960s' },
    { label: 'Anos 70', value: '1970s' },
    { label: 'Anos 80', value: '1980s' },
    { label: 'Anos 90', value: '1990s' },
  ];

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (activeCategory !== 'todos' && item.category !== activeCategory) {
          return false;
        }
        // Decade filter
        if (selectedDecade !== 'todos' && item.decade !== selectedDecade) {
          return false;
        }
        // Favorites filter
        if (onlyFavorites && !item.isFavorite) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCreator = item.creator.toLowerCase().includes(q);
          const matchGenre = item.genre.toLowerCase().includes(q);
          const matchNotes = item.curatorialNotes.toLowerCase().includes(q);
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchCreator || matchGenre || matchNotes || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'year-asc') return a.year - b.year;
        if (sortBy === 'year-desc') return b.year - a.year;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [items, activeCategory, selectedDecade, onlyFavorites, searchQuery, sortBy]);

  const getCategoryBadge = (category: Category) => {
    switch (category) {
      case 'musica':
        return {
          label: 'Música',
          bg: 'bg-pink-100 text-[#E07A9A] border-pink-200',
          icon: <Disc3 className="w-3 h-3 text-[#E07A9A]" />,
        };
      case 'danca':
        return {
          label: 'Dança',
          bg: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <span className="w-2 h-2 rounded-full bg-purple-600" />,
        };
      case 'cinema':
        return {
          label: 'Cinema',
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: <Film className="w-3 h-3 text-amber-700" />,
        };
      case 'artes-plasticas':
        return {
          label: 'Artes Plásticas',
          bg: 'bg-sky-100 text-sky-800 border-sky-200',
          icon: <Box className="w-3 h-3 text-sky-700" />,
        };
      case 'eletronicos':
        return {
          label: 'Eletrônicos',
          bg: 'bg-pink-100 text-pink-900 border-pink-200',
          icon: <Cpu className="w-3 h-3 text-[#E07A9A]" />,
        };
    }
  };

  return (
    <section id="acervo-section" className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* Header with Title */}
        <div className="pb-8 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFAEC4]/25 text-[#E07A9A] dark:text-[#EFAEC4] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorador do Acervo Digital</span>
            </div>
            <h2
              className="text-2xl sm:text-4xl font-black text-[#E07A9A] dark:text-[#EFAEC4] tracking-tight uppercase"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Catálogo Geral das 5 Áreas
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Navegue pelos discos, espetáculos de dança, películas de cinema, esculturas e dispositivos eletrônicos históricos.
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mt-8 space-y-4">
          {/* Main Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'todos', label: 'Todo o Acervo' },
              { id: 'danca', label: 'Dança & Movimento' },
              { id: 'musica', label: 'Música & Vinil' },
              { id: 'cinema', label: 'Cinema 35mm' },
              { id: 'artes-plasticas', label: 'Artes Plásticas' },
              { id: 'eletronicos', label: 'Eletrônicos Vintage' },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectCategory(tab.id as Category | 'todos')}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#153833] text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Mini-Banner Narrativo: O Diário de 1984 */}
          {onOpenBauMemorias && (
            <div className="p-4 rounded-2xl bg-[#153833] text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#EFAEC4]/40 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E07A9A] text-slate-950 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#EFAEC4]">
                    Caça ao Tesouro das Décadas • Um Dia em 1984
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5">
                    Leo está vivendo um dia comum nos anos 80. Encontre os 8 objetos escondidos dentro dos artigos enquanto lê o acervo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenBauMemorias}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white/15 hover:bg-white/25 text-white active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-2"
              >
                <span>Meu Baú ({collectedMemoryCount}/8)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sub Filters Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por obra, artista, notas ou tags..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#153833] border border-transparent focus:border-slate-300"
              />
            </div>

            {/* Decade Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">Década:</span>
              <select
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value as FilterDecade)}
                className="px-3 py-2 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 focus:outline-none focus:bg-white"
              >
                {decades.map((dec) => (
                  <option key={dec.value} value={dec.value}>
                    {dec.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">Ordem:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 focus:outline-none focus:bg-white"
              >
                <option value="year-asc">Ano (Mais Antigos)</option>
                <option value="year-desc">Ano (Mais Recentes)</option>
                <option value="rating">Avaliação (Mais Alta)</option>
                <option value="title">Título (A-Z)</option>
              </select>
            </div>

            {/* Only Favorites Button */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border ${
                onlyFavorites
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>Favoritos</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredItems.length}</strong> de <strong>{items.length}</strong> obras catalogadas
          </span>
          {activeCategory !== 'todos' && (
            <button
              onClick={() => onSelectCategory('todos')}
              className="text-[#153833] hover:underline font-semibold"
            >
              Ver todas as categorias
            </button>
          )}
        </div>

        {/* Items Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const badge = getCategoryBadge(item.category);
            const isItemPlaying = activePlayingId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isItemPlaying ? 'ring-2 ring-[#153833]' : ''
                }`}
              >
                <div>
                  {/* Cover Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category and Decade Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${badge.bg}`}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-sm border border-white/20">
                        {item.decade}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors cursor-pointer"
                      title={item.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          item.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {/* Media format & Year pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[11px] font-medium border border-white/20 truncate max-w-[170px]">
                        {item.mediaFormat}
                      </span>
                      <span className="font-mono font-bold">{item.year}</span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5">
                    <h3
                      className="text-base sm:text-lg font-bold text-[#153833] group-hover:text-[#E07A9A] transition-colors leading-snug line-clamp-1"
                      style={{ fontFamily: "'Unbounded', sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                      {item.creator} — <span className="italic text-slate-400">{item.role}</span>
                    </p>

                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed italic">
                      "{item.curatorialNotes}"
                    </p>
                  </div>
                </div>

                {/* Footer of Card */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-700">{item.rating}</span>
                  </div>

                  {/* Quick Play Audio Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayItem(item);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isItemPlaying
                        ? 'bg-[#E07A9A] text-white'
                        : 'bg-pink-50 text-[#E07A9A] hover:bg-pink-100 border border-pink-200'
                    }`}
                  >
                    <Play className={`w-3 h-3 ${isItemPlaying ? 'fill-white' : 'fill-[#E07A9A]'}`} />
                    <span>{isItemPlaying ? 'Tocando' : 'Tocar Vinil'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
