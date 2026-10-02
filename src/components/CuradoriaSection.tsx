import React from 'react';
import { Play, Sparkles, Disc, Film, Award, Box, Cpu, ArrowUpRight, BookOpen } from 'lucide-react';
import { ArchiveItem } from '../types';
import { IridescentOrb } from './IridescentOrb';

interface CuradoriaSectionProps {
  featuredItem: ArchiveItem;
  totalItems: number;
  musicaCount: number;
  dancaCount: number;
  cinemaCount: number;
  artesCount?: number;
  eletronicosCount?: number;
  onSelectFeatured: (item: ArchiveItem) => void;
  onPlayItem: (item: ArchiveItem) => void;
  isPlayingFeatured: boolean;
  onRandomCuratorship: () => void;
  onOpenWrapped?: () => void;
  onOpenCuradorTour?: () => void;
  onOpenBauMemorias?: () => void;
  collectedMemoryCount?: number;
}

export const CuradoriaSection: React.FC<CuradoriaSectionProps> = ({
  featuredItem,
  totalItems,
  musicaCount,
  dancaCount,
  cinemaCount,
  artesCount = 0,
  eletronicosCount = 0,
  onSelectFeatured,
  onPlayItem,
  isPlayingFeatured,
  onRandomCuratorship,
  onOpenCuradorTour,
  onOpenBauMemorias,
  collectedMemoryCount = 0,
}) => {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'danca':
        return 'Dança';
      case 'musica':
        return 'Música';
      case 'cinema':
        return 'Cinema';
      case 'artes-plasticas':
        return 'Artes Plásticas';
      case 'eletronicos':
        return 'Eletrônicos';
      default:
        return cat;
    }
  };

  return (
    <section className="relative w-full bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200">
      {/* Ambient Iridescent Atmosphere */}
      <div className="absolute top-2 -right-12 sm:top-6 sm:right-6 z-10 pointer-events-none opacity-80">
        <IridescentOrb size={200} variant="mint-pink" />
      </div>
      <div className="absolute -bottom-10 -left-10 z-10 pointer-events-none opacity-60">
        <IridescentOrb size={180} variant="full-spectrum" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Top Perimeter Notation (Image 1 & Image 5 Style) */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#153833] dark:!text-[#EFAEC4] uppercase pb-3 mb-2 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E07A9A]" />
            <span className="text-[#153833] dark:!text-[#EFAEC4]">[ 02 / ARQUIVO &amp; PRESERVAÇÃO ]</span>
          </div>
          <span className="hidden sm:inline text-[#153833] dark:!text-[#EFAEC4]">MATRIZ HISTÓRICA</span>
          <span className="text-[#153833] dark:!text-[#EFAEC4]">CURADORIA PERMANENTE</span>
        </div>

        {/* Monumental Condensed Display Title (Images 1, 3, 5) */}
        <div className="relative my-4">
          <h2
            id="curadoria-title"
            className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#E07A9A] dark:text-[#EFAEC4] tracking-tight leading-[0.85] uppercase select-none break-words"
            style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
          >
            MEMÓRIA CULTURAL
          </h2>

          <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-[#153833] dark:!text-[#EFAEC4] tracking-wider uppercase mt-1 flex-wrap gap-1">
            <span className="text-[#153833] dark:!text-[#EFAEC4]">PATRIMÔNIO MATERIAL E IMATERIAL</span>
            <span className="hidden sm:inline text-[#153833] dark:!text-[#EFAEC4]">1920—2010</span>
            <span className="text-[#153833] dark:!text-[#EFAEC4]">REGISTROS AUTÊNTICOS</span>
          </div>
        </div>

        {/* Curatorial Subtitle */}
        <p
          id="curadoria-subtitle"
          className="mt-4 text-xs sm:text-base md:text-lg text-slate-700 dark:text-slate-200 max-w-3xl leading-relaxed font-normal"
        >
          Cada objeto, cada cena, cada disco e cada dispositivo tem uma história por trás. Aqui, conservamos esse patrimônio cultural conectando épocas, memórias e registros autênticos.
        </p>

        {/* Two High-Contrast Poster Cards Side-by-Side (Images 2, 3, 5 Style) */}
        <div className="mt-8 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch relative">
          {/* Left Card: Deep Pine Green Poster (`#153833`) */}
          <div
            id="curadoria-card-dark"
            className="lg:col-span-8 rounded-3xl p-5 sm:p-9 text-white shadow-xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl border-2 border-[#153833]"
            style={{
              backgroundColor: '#153833',
            }}
          >
            {/* Ambient specular highlight */}
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #5eead4 0%, #efaec4 100%)' }}
            />

            <div>
              {/* Card Perimeter Notations */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-white/15 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#EFAEC4] flex-wrap">
                <div className="inline-flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#EFAEC4]" />
                  <span>DESTAQUE DO ACERVO HISTÓRICO</span>
                </div>
                <span>CATÁLOGO № 001 • {featuredItem.mediaFormat}</span>
              </div>

              {/* Title & Photographic Cutout */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                <div className="max-w-md flex-1">
                  <div
                    id="curadoria-featured-badge"
                    className="inline-block px-3 py-1 rounded-full bg-[#EFAEC4]/20 border border-[#EFAEC4]/40 text-[#EFAEC4] dark:!text-[#EFAEC4] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider mb-2"
                  >
                    <span className="text-[#EFAEC4] dark:!text-[#EFAEC4]">
                      {getCategoryLabel(featuredItem.category)} • DÉCADA DE {featuredItem.decade} ({featuredItem.year})
                    </span>
                  </div>

                  <h3
                    className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#EFAEC4] leading-tight uppercase"
                    style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
                  >
                    {featuredItem.title}
                  </h3>

                  <p className="text-pink-100 font-medium text-xs sm:text-base mt-1">
                    {featuredItem.creator} — <span className="italic text-[#EFAEC4]/80">{featuredItem.role}</span>
                  </p>
                </div>

                {/* Cover Thumbnail Window with Poster Border */}
                <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl flex-shrink-0 group">
                  <img
                    src={featuredItem.coverUrl}
                    alt={featuredItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[9px] font-mono font-bold text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                    {featuredItem.year}
                  </span>
                </div>
              </div>

              {/* Curatorial Story Note with Quotation Styling */}
              <blockquote className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-2xl bg-white/5 border-l-4 border-[#EFAEC4] text-xs sm:text-sm text-pink-100/90 leading-relaxed italic">
                "{featuredItem.curatorialNotes}"
              </blockquote>

              {/* Dossier Grid (Target Audience, Original Use, Historical Context) */}
              <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/20 border border-white/10">
                  <span className="block text-[10px] font-mono font-bold uppercase text-[#EFAEC4] tracking-wider">
                    PÚBLICO-ALVO DE ÉPOCA
                  </span>
                  <span className="text-white font-medium mt-0.5 block text-xs">
                    {featuredItem.targetAudience}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/10">
                  <span className="block text-[10px] font-mono font-bold uppercase text-[#EFAEC4] tracking-wider">
                    USO / EXPERIÊNCIA ORIGINAL
                  </span>
                  <span className="text-white font-medium mt-0.5 block text-xs">
                    {featuredItem.originalUsage}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside Dark Card */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <button
                  id="btn-play-featured"
                  onClick={() => onPlayItem(featuredItem)}
                  className="px-5 sm:px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-[#153833] bg-[#EFAEC4] hover:bg-[#eb9bb4] transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-[#E07A9A]"
                >
                  <Play className={`w-3.5 h-3.5 ${isPlayingFeatured ? 'animate-pulse' : ''}`} />
                  <span>{isPlayingFeatured ? 'Pausar Reprodução' : 'Tocar no Vinil Analógico'}</span>
                </button>

                <button
                  id="btn-details-featured"
                  onClick={() => onSelectFeatured(featuredItem)}
                  className="px-5 py-3 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/15 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Dossiê Histórico</span>
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {featuredItem.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/30 text-[#EFAEC4] border border-white/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Card: Signature Pastel Pink Poster (`#EFAEC4`) */}
          <div
            id="curadoria-card-pink"
            className="lg:col-span-4 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between text-[#0c2521] relative overflow-hidden transition-all duration-300 hover:shadow-2xl border-2 border-[#E07A9A]"
            style={{
              backgroundColor: '#EFAEC4',
            }}
          >
            {/* Ambient specular highlight */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/40 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Card Perimeter Notations */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0c2521]/20 text-[11px] font-mono font-bold uppercase tracking-wider text-[#0c2521]">
                <span>5 SEGMENTOS VIVOS</span>
                <span>CATÁLOGO 2026</span>
              </div>

              {/* Total items badge in Monumental Bebas Neue */}
              <div className="my-2">
                <div
                  className="text-6xl sm:text-7xl font-black text-[#0c2521] leading-none"
                  style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
                >
                  {totalItems}
                </div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#0c2521]/90 mt-1">
                  Obras Catalogadas no Acervo
                </p>
              </div>

              {/* Breakdown List across 5 segments styled like Swiss Poster Table */}
              <div className="mt-5 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-white/90 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-[#0c2521]">
                    <span className="text-[10px] text-pink-900 font-black">01</span>
                    <span>Dança</span>
                  </div>
                  <span className="font-black text-[#0c2521]">{dancaCount} obras</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-white/90 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-[#0c2521]">
                    <Disc className="w-3.5 h-3.5 text-[#0c2521]" />
                    <span className="text-[10px] text-pink-900 font-black">02</span>
                    <span>Música</span>
                  </div>
                  <span className="font-black text-[#0c2521]">{musicaCount} obras</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-white/90 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-[#0c2521]">
                    <Film className="w-3.5 h-3.5 text-[#0c2521]" />
                    <span className="text-[10px] text-pink-900 font-black">03</span>
                    <span>Cinema</span>
                  </div>
                  <span className="font-black text-[#0c2521]">{cinemaCount} obras</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-white/90 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-[#0c2521]">
                    <Box className="w-3.5 h-3.5 text-[#0c2521]" />
                    <span className="text-[10px] text-pink-900 font-black">04</span>
                    <span>Artes Plásticas</span>
                  </div>
                  <span className="font-black text-[#0c2521]">{artesCount} obras</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 border border-white/90 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-[#0c2521]">
                    <Cpu className="w-3.5 h-3.5 text-[#0c2521]" />
                    <span className="text-[10px] text-pink-900 font-black">05</span>
                    <span>Eletrônicos</span>
                  </div>
                  <span className="font-black text-[#0c2521]">{eletronicosCount} obras</span>
                </div>
              </div>
            </div>

            {/* Bottom Quick Actions in Pink Card */}
            <div className="mt-6 pt-4 border-t border-[#0c2521]/20 space-y-2">
              <button
                id="btn-random-curatorship"
                onClick={onRandomCuratorship}
                className="w-full py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider text-white bg-[#0c2521] hover:bg-[#183d37] transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-[#0c2521]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EFAEC4]" />
                <span>Sortear Obra do Passado</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </button>

              {onOpenCuradorTour && (
                <button
                  id="btn-curador-tour"
                  onClick={onOpenCuradorTour}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-wider text-[#0c2521] bg-white hover:bg-slate-50 transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-white/90"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#db2777]" />
                  <span>Trilha Curatorial Personalizada</span>
                </button>
              )}

              {/* Gamificação 1984 Callout */}
              {onOpenBauMemorias && (
                <div className="pt-2">
                  <div className="p-3.5 rounded-2xl bg-[#0c2521] text-white border border-[#EFAEC4]/40 flex items-center justify-between gap-3 shadow-md">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#EFAEC4] uppercase font-bold">
                        <BookOpen className="w-3.5 h-3.5 text-[#E07A9A]" />
                        <span>Diário de Leo • 1984</span>
                      </div>
                      <p className="text-xs font-bold text-slate-100 truncate">
                        Caça aos Objetos: {collectedMemoryCount}/8 Encontrados
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenBauMemorias}
                      className="px-3 py-1.5 rounded-full text-[11px] font-mono font-bold bg-[#E07A9A] text-slate-950 hover:bg-[#efaec4] active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      Abrir Baú
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
