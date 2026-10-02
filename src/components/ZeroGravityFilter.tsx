import React, { useState, useMemo } from 'react';
import { ArchiveItem, Category } from '../types';
import {
  Sparkles,
  Share2,
  Check,
  RotateCcw,
  Layers,
  Heart,
  Compass,
  X,
} from 'lucide-react';

interface ZeroGravityFilterProps {
  items: ArchiveItem[];
  onOpenArticle: (item: ArchiveItem) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
}

const CATEGORIES: { id: Category; label: string; color: string }[] = [
  { id: 'danca', label: 'Dança', color: '#f472b6' },
  { id: 'musica', label: 'Música', color: '#EFAEC4' },
  { id: 'cinema', label: 'Cinema', color: '#fbbf24' },
  { id: 'artes-plasticas', label: 'Artes Plásticas', color: '#38bdf8' },
  { id: 'eletronicos', label: 'Eletrônicos', color: '#2dd4bf' },
];

const DECADES = ['1910s', '1920s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s'];

export const ZeroGravityFilter: React.FC<ZeroGravityFilterProps> = ({
  items,
  onOpenArticle,
  onLike,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareMixOpen, setIsShareMixOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Toggle category
  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Toggle decade
  const toggleDecade = (dec: string) => {
    setSelectedDecades((prev) =>
      prev.includes(dec) ? prev.filter((d) => d !== dec) : [...prev, dec]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDecades([]);
    setSearchQuery('');
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchDec =
        selectedDecades.length === 0 || selectedDecades.includes(item.decade);
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchDec && matchQuery;
    });
  }, [items, selectedCategories, selectedDecades, searchQuery]);

  return (
    <section id="filtro-gravidade" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white text-slate-900 overflow-hidden border-t border-slate-200">
      {/* Background Soft Aura on White */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-indigo-200 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-pink-200 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 mb-3">
            <Compass className="w-3.5 h-3.5 animate-spin" />
            <span>Exploração • Gravidade Zero</span>
          </div>

          <h2
            className="text-3xl sm:text-5xl font-black tracking-tight text-[#E07A9A] dark:text-[#EFAEC4] uppercase"
            style={{ fontFamily: "'Unbounded', sans-serif" }}
          >
            Filtro &amp; Mix Cultural
          </h2>

          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Selecione múltiplos segmentos e décadas para fazer as obras flutuarem no vácuo. Monte o seu próprio Mix Cultural personalizado e compartilhe nas redes!
          </p>
        </div>

        {/* Filter Control Dashboard (Clean Light) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-md mb-12">
          {/* Categories Row */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                1. Segmentos Culturais (Multi-seleção)
              </span>
              {selectedCategories.length > 0 && (
                <span className="text-[11px] font-mono text-pink-700 font-bold">
                  {selectedCategories.length} selecionado(s)
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'text-slate-950 shadow-md scale-105'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    style={{
                      backgroundColor: isSelected ? cat.color : undefined,
                      borderColor: isSelected ? cat.color : undefined,
                    }}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Decades Row */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                2. Linhas do Tempo / Décadas
              </span>
              {selectedDecades.length > 0 && (
                <span className="text-[11px] font-mono text-[#E07A9A] font-bold">
                  {selectedDecades.length} década(s)
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {DECADES.map((dec) => {
                const isSelected = selectedDecades.includes(dec);
                return (
                  <button
                    key={dec}
                    type="button"
                    onClick={() => toggleDecade(dec)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#153833] text-white border-[#153833] shadow-md font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {dec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Bar: Search & Mix Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex-1 min-w-[240px] max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por obra, criador ou palavra-chave..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#153833] shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-3">
              {(selectedCategories.length > 0 || selectedDecades.length > 0 || searchQuery) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Filtros</span>
                </button>
              )}

              {/* Botão para Gerar Cartão / Compartilhar Mix Cultural */}
              <button
                type="button"
                onClick={() => setIsShareMixOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#EFAEC4] hover:bg-[#e89bb4] text-[#153833] shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Compartilhar Meu Mix ({filteredItems.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Items Area (Zero Gravity Space) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Objetos em Órbita &amp; Gravidade Zero ({filteredItems.length})
              </span>
            </div>
            <span className="text-xs text-slate-500 italic hidden sm:inline">
              Clique em qualquer objeto flutuante para ler sua história
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20 rounded-3xl bg-slate-50 border border-slate-200">
              <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-pulse" />
              <h4 className="text-base font-bold text-slate-900">Nenhum tesouro encontrado</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tente selecionar outros segmentos ou limpar os filtros ativos.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-800 transition-colors"
              >
                Restaurar Todos os Segmentos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredItems.map((item, idx) => {
                const floatDelays = ['0s', '0.7s', '1.4s', '2.1s', '0.3s', '1.8s', '1.1s', '2.5s'];
                const delay = floatDelays[idx % floatDelays.length];

                return (
                  <div
                    key={item.id}
                    onClick={() => onOpenArticle(item)}
                    className="group relative cursor-pointer select-none rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-pink-300 hover:shadow-lg shadow-sm"
                    style={{
                      animation: `zeroGravityFloat 6s ease-in-out infinite`,
                      animationDelay: delay,
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/90 text-slate-900 backdrop-blur-md border border-slate-200">
                          {item.decade}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLike(item.id, e);
                          }}
                          className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                            item.isLiked ? 'bg-rose-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${item.isLiked ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Floating Format indicator */}
                      <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-0.5 rounded-md text-[8px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                          {item.mediaFormat}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#E07A9A] transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {item.creator}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Compartilhar Meu Mix Cultural */}
      {isShareMixOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900">
            <button
              onClick={() => setIsShareMixOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-200">
                Cartão Cultural Personalizado
              </span>
              <h3
                className="text-xl sm:text-2xl font-black text-slate-950 mt-2 uppercase tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                Meu Mix Cultural
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Uma seleção personalizada das suas descobertas no Acervo Digital.
              </p>
            </div>

            {/* Social Preview Card Frame */}
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-pink-200 shadow-inner mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-mono">
                <span className="text-[#E07A9A] font-bold">SYNTHETICA • ACERVO DIGITAL</span>
                <span className="text-slate-500">SETEMBRO 2026</span>
              </div>

              <div className="my-4 space-y-2">
                <div className="text-sm font-bold text-slate-900">
                  Curadoria Selecionada: {filteredItems.length} Obras em Órbita
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-semibold">
                        {c.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200 font-semibold">
                      TODOS OS SEGMENTOS
                    </span>
                  )}
                  {selectedDecades.length > 0 &&
                    selectedDecades.map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">
                        {d}
                      </span>
                    ))}
                </div>
              </div>

              {/* Sample 3 Items Snippet */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200">
                {filteredItems.slice(0, 3).map((it) => (
                  <div key={it.id} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img src={it.coverUrl} alt={it.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold text-white bg-black/70 px-1 truncate rounded">
                      {it.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="w-full py-3 rounded-xl bg-[#EFAEC4] hover:bg-[#e89bb4] text-[#153833] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-[#153833] stroke-[3]" />
                    <span>Link do Mix Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copiar Link para Stories / WhatsApp</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsShareMixOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-semibold transition-colors cursor-pointer"
              >
                Voltar à Exploração
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
