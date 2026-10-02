import React from 'react';
import { RotateCcw, Sparkles, Layers, Calendar, Check } from 'lucide-react';
import { Category } from '../types';
import { IridescentOrb } from './IridescentOrb';

interface SectionDecadeFilterBarProps {
  activeCategory: Category | 'todos';
  onSelectCategory: (category: Category | 'todos') => void;
  selectedDecade: string; // 'todas' | '1920s' | '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s'
  onSelectDecade: (decade: string) => void;
  totalWorksCount: number;
  filteredWorksCount: number;
  onOpenRecommendation?: (category: Category | 'todos', decade: string) => void;
}

export const SECTIONS_CONFIG: { id: Category; label: string }[] = [
  { id: 'danca', label: 'Dança' },
  { id: 'musica', label: 'Música' },
  { id: 'cinema', label: 'Cinema' },
  { id: 'artes-plasticas', label: 'Artes' },
  { id: 'eletronicos', label: 'Eletrônicos' },
];

export const DECADES_CONFIG: { id: string; label: string }[] = [
  { id: '1980s', label: '1980s (Aurora do Silício)' },
  { id: '1990s', label: '1990s (Multimídia & Web)' },
  { id: '2000s', label: '2000s (Digital & Mobile)' },
  { id: '2010s', label: '2010s (Redes & IA)' },
  { id: '2020s', label: '2020s (Metaverso & Hoje)' },
];

export const SectionDecadeFilterBar: React.FC<SectionDecadeFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedDecade,
  onSelectDecade,
  totalWorksCount,
  filteredWorksCount,
  onOpenRecommendation,
}) => {
  const isFiltered = activeCategory !== 'todos' || selectedDecade !== 'todas';

  const handleCategoryClick = (catId: Category) => {
    // If already active, toggle off to 'todos'
    const nextCat = activeCategory === catId ? 'todos' : catId;
    onSelectCategory(nextCat);
    if (onOpenRecommendation) {
      onOpenRecommendation(nextCat, selectedDecade);
    }
  };

  const handleDecadeClick = (decadeId: string) => {
    // If already active, toggle off to 'todas'
    const nextDec = selectedDecade === decadeId ? 'todas' : decadeId;
    onSelectDecade(nextDec);
    if (onOpenRecommendation) {
      onOpenRecommendation(activeCategory, nextDec);
    }
  };

  const handleResetAll = () => {
    onSelectCategory('todos');
    onSelectDecade('todas');
  };

  return (
    <section
      id="filtro-geral-acervo"
      className="relative w-full bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200 text-slate-950"
    >
      {/* Signature Iridescent Ambient Lighting (harmonized with HeroBanner and CuradoriaSection) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft pastel iridescent glows on clean white */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(94, 234, 212, 0.25) 0%, rgba(239, 174, 196, 0.25) 50%, rgba(192, 132, 252, 0.15) 80%, transparent 100%)',
          }}
        />

        {/* Floating Iridescent Orbs */}
        <div className="absolute top-6 -right-10 opacity-70">
          <IridescentOrb size={170} variant="mint-pink" />
        </div>
        <div className="absolute -bottom-8 -left-8 opacity-60">
          <IridescentOrb size={150} variant="cyan-purple" />
        </div>

        {/* Subtle grid mesh on white */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        {/* Micro Badge: "FILTROS" in Signature Pink / Mint Style */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 dark:bg-[#EFAEC4]/20 border border-pink-200/80 dark:border-[#EFAEC4]/40 backdrop-blur-md mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E07A9A] dark:text-[#EFAEC4]" />
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-pink-700 dark:!text-[#EFAEC4]">
            Filtros do Acervo • Matriz de Curadoria
          </span>
        </div>

        {/* Editorial Coordinates Row (Image 1 & Image 5 Style) */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#153833] dark:!text-[#EFAEC4] uppercase px-2 mb-1 max-w-7xl">
          <span className="text-[#153833] dark:!text-[#EFAEC4]">[ 02 / MATRIZ DE COMBINAÇÃO ]</span>
          <span className="hidden sm:inline text-[#153833] dark:!text-[#EFAEC4]">[ CRONOLOGIA &amp; FORMA ]</span>
          <span className="text-[#153833] dark:!text-[#EFAEC4]">[ SELEÇÃO DINÂMICA ]</span>
        </div>

        {/* Display Title: "Monte seu Mix" with Bebas Neue / Anton Monumental Style */}
        <h2
          className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#E07A9A] dark:text-[#EFAEC4] tracking-tight text-center leading-[0.88] uppercase break-words"
          style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
        >
          MONTE SEU MIX
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-normal text-center max-w-2xl leading-relaxed px-2">
          Combine seções e décadas para receber uma recomendação curatorial em pop-up, mantendo o acervo completo acessível na página
        </p>

        {/* White / Frosted Filter Card */}
        <div className="mt-6 sm:mt-12 w-full bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-9 md:p-11 shadow-xl shadow-slate-100 border border-slate-200/90 relative overflow-hidden">
          {/* Subtle Ambient Radial Highlight inside card */}
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #5eead4 0%, #efaec4 100%)',
            }}
          />

          {/* Row 1: SEÇÕES */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span
                id="filter-sections-title"
                className="text-xs font-mono font-bold tracking-widest text-[#D84572] dark:text-[#E07A9A] uppercase flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5 text-[#D84572] dark:text-[#E07A9A]" />
                SEÇÕES
              </span>
              {activeCategory !== 'todos' && (
                <button
                  onClick={() => onSelectCategory('todos')}
                  className="text-xs font-mono text-pink-600 hover:text-pink-800 dark:text-[#EFAEC4] dark:hover:text-white font-semibold underline cursor-pointer"
                >
                  Ver todas as seções
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {SECTIONS_CONFIG.map((sec) => {
                const isSelected = activeCategory === sec.id;
                return (
                  <button
                    key={sec.id}
                    id={`filter-sec-${sec.id}`}
                    onClick={() => handleCategoryClick(sec.id)}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-base font-medium transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#153833] text-white border-[#E07A9A] dark:bg-[#153833] dark:text-white dark:border-[#E07A9A] shadow-md font-semibold scale-102 ring-2 ring-[#E07A9A]/60'
                        : 'bg-[#153833] hover:bg-[#1f4e47] text-white border-[#153833] dark:bg-[#153833] dark:text-white dark:border-[#153833] dark:hover:bg-[#1f4e47] shadow-xs'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E07A9A]" />
                    )}
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: ERA / DÉCADA */}
          <div className="relative z-10 mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span
                id="filter-decades-title"
                className="text-xs font-mono font-bold tracking-widest text-[#D84572] dark:text-[#E07A9A] uppercase flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-[#D84572] dark:text-[#E07A9A]" />
                ERA / DÉCADA
              </span>
              {selectedDecade !== 'todas' && (
                <button
                  onClick={() => onSelectDecade('todas')}
                  className="text-xs font-mono text-pink-600 hover:text-pink-800 dark:text-[#EFAEC4] dark:hover:text-white font-semibold underline cursor-pointer"
                >
                  Ver todas as décadas
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {DECADES_CONFIG.map((dec) => {
                const isSelected = selectedDecade === dec.id;
                return (
                  <button
                    key={dec.id}
                    id={`filter-dec-${dec.id}`}
                    onClick={() => handleDecadeClick(dec.id)}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-base font-medium transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#153833] text-white border-[#E07A9A] dark:bg-[#153833] dark:text-white dark:border-[#E07A9A] shadow-md font-semibold scale-102 ring-2 ring-[#E07A9A]/60'
                        : 'bg-[#153833] hover:bg-[#1f4e47] text-white border-[#153833] dark:bg-[#153833] dark:text-white dark:border-[#153833] dark:hover:bg-[#1f4e47] shadow-xs'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E07A9A]" />
                    )}
                    <span>{dec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Result Summary & Reset Bar */}
          <div className="relative z-10 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
            {isFiltered ? (
              <div className="flex items-center gap-2.5 text-slate-700 w-full sm:w-auto">
                <div className="w-6 h-6 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#E07A9A]" />
                </div>
                <span className="text-xs sm:text-sm">
                  Recomendação pronta:{' '}
                  <strong className="text-slate-950 font-bold">
                    {filteredWorksCount}
                  </strong>{' '}
                  obra{filteredWorksCount === 1 ? '' : 's'} no mix
                  {activeCategory !== 'todos' && (
                    <span>
                      {' '}
                      em{' '}
                      <span className="font-semibold text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                        {SECTIONS_CONFIG.find((s) => s.id === activeCategory)?.label}
                      </span>
                    </span>
                  )}
                  {selectedDecade !== 'todas' && (
                    <span>
                      {' '}
                      dos anos{' '}
                      <span className="font-semibold text-slate-900 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                        {selectedDecade}
                      </span>
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <div
                id="filter-recommendation-hint"
                className="flex items-center gap-2 text-xs font-mono w-full sm:w-auto text-[#153833] dark:text-[#153833]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#153833] dark:text-[#153833] shrink-0" />
                <span className="text-[#153833] dark:text-[#153833] font-semibold">
                  Selecione uma seção ou década acima para abrir o pop-up com a recomendação
                </span>
              </div>
            )}

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full sm:w-auto">
              {onOpenRecommendation && (
                <button
                  id="btn-abrir-popup-recomendacao"
                  onClick={() => onOpenRecommendation(activeCategory, selectedDecade)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold bg-[#153833] text-white hover:bg-[#1f4e47] transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#EFAEC4]" />
                  <span>Ver Recomendação Filtrada</span>
                </button>
              )}

              {isFiltered && (
                <button
                  onClick={handleResetAll}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-mono font-medium text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Limpar Mix</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
