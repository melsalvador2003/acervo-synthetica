import React from 'react';
import { ArchiveItem, Category } from '../types';
import { Card3D } from './Card3D';
import { Dance3DElement } from './section3D/Dance3DElement';
import { Music3DElement } from './section3D/Music3DElement';
import { Cinema3DElement } from './section3D/Cinema3DElement';
import { Art3DElement } from './section3D/Art3DElement';
import { Electronics3DElement } from './section3D/Electronics3DElement';
import { Layers, Calendar } from 'lucide-react';

interface GallerySectionProps {
  category: Category;
  items: ArchiveItem[];
  onOpenArticle: (item: ArchiveItem) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  onShare: (item: ArchiveItem, e: React.MouseEvent) => void;
  onPlayAudio?: (item: ArchiveItem) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  selectedDecade?: string;
  onSelectDecade?: (decade: string) => void;
}

interface SectionConfig {
  num: string;
  watermark: string;
  title: string;
  subtitle: string;
  curatorialStatement: string;
  accentColor: string;
  badgeBg: string;
  glowColor: string;
  render3D: () => React.ReactNode;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  category,
  items,
  onOpenArticle,
  onLike,
  onShare,
  isPlaying = false,
  onTogglePlay,
  selectedDecade = 'todas',
  onSelectDecade,
}) => {
  const getSectionConfig = (): SectionConfig => {
    switch (category) {
      case 'danca':
        return {
          num: '01',
          watermark: 'DANÇA',
          title: 'Dança & Expressão Corporal',
          subtitle: 'A ruptura do balé clássico, o teatro da vulnerabilidade e a gravidade cênica',
          curatorialStatement:
            'Do escândalo de Nijinsky à dança-teatro de Pina Bausch: como o corpo humano desafiou regras sociais, a gravidade e o tablado cênico.',
          accentColor: '#f472b6',
          badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
          glowColor: 'rgba(244, 114, 182, 0.12)',
          render3D: () => <Dance3DElement />,
        };
      case 'musica':
        return {
          num: '02',
          watermark: 'MÚSICA',
          title: 'Música & Sulcos Analógicos',
          subtitle: 'Vinil 33⅓ RPM, microfones a válvula, sintetizadores modulares e polifonia',
          curatorialStatement:
            'A textura do ruído analógico: como Clube da Esquina e Kraftwerk moldaram as frequências que definiram a cultura do século XX.',
          accentColor: '#EFAEC4',
          badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
          glowColor: 'rgba(20, 184, 166, 0.12)',
          render3D: () => <Music3DElement isPlaying={isPlaying} onTogglePlay={onTogglePlay} />,
        };
      case 'cinema':
        return {
          num: '03',
          watermark: 'CINEMA',
          title: 'Cinema & Película 35mm',
          subtitle: 'Luz projetada em prata, cortes de montagem dialética e épicos do terceiro mundo',
          curatorialStatement:
            'Da distopia muda de Metropolis à fúria sob o sol de Glauber Rocha: o rolo de celuloide como arma poética, política e de memória.',
          accentColor: '#fbbf24',
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
          glowColor: 'rgba(245, 158, 11, 0.12)',
          render3D: () => <Cinema3DElement />,
        };
      case 'artes-plasticas':
        return {
          num: '04',
          watermark: 'ARTES',
          title: 'Artes Plásticas & Matéria Viva',
          subtitle: 'Fotografia instantânea SX-70, serigrafias da Factory e neoconcretismo tátil',
          curatorialStatement:
            'A destruição da distância entre obra e público: da química de 60 segundos de Polaroid às esculturas desdobráveis de Lygia Clark.',
          accentColor: '#38bdf8',
          badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
          glowColor: 'rgba(56, 189, 248, 0.12)',
          render3D: () => <Art3DElement />,
        };
      case 'eletronicos':
        return {
          num: '05',
          watermark: 'ELETRÔNICOS',
          title: 'Eletrônicos & Revolução Portátil',
          subtitle: 'Telas CRT de fósforo, o primeiro Walkman nas ruas e chiptunes de 8-bits',
          curatorialStatement:
            'A tecnologia saindo das salas com ar-condicionado para o bolso: como o hardware analógico e digital inaugurou a vida conectada.',
          accentColor: '#2dd4bf',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          glowColor: 'rgba(45, 212, 191, 0.12)',
          render3D: () => <Electronics3DElement />,
        };
    }
  };

  const config = getSectionConfig();
  const categoryItems = items.filter((i) => i.category === category);
  const displayedItems = categoryItems.filter(
    (i) => selectedDecade === 'todas' || i.decade === selectedDecade
  );

  return (
    <section
      id={`secao-${category}`}
      className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 text-slate-900 bg-white border-b border-slate-200 overflow-hidden scroll-mt-24"
    >
      {/* Decorative Glow Orb */}
      <div
        className="pointer-events-none absolute -top-24 right-10 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: config.glowColor }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Perimeter Notation for this specific Gallery */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#153833] dark:!text-[#EFAEC4] uppercase pb-3 mb-4 border-b border-slate-200 dark:border-white/10 flex-wrap gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E07A9A]" />
            <span className="text-[#153833] dark:!text-[#EFAEC4]">[ GALERIA {config.num} / {config.watermark} ]</span>
          </div>
          <span className="hidden sm:inline text-[#153833] dark:!text-[#EFAEC4]">COLEÇÃO PERMANENTE</span>
          <span className="text-[#153833] dark:!text-[#EFAEC4]">{categoryItems.length} OBRAS CATALOGADAS</span>
        </div>

        {/* Monumental Gallery Poster Title Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="max-w-2xl text-center lg:text-left w-full">
            <h2
              className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-black text-[#E07A9A] dark:text-[#EFAEC4] tracking-tight leading-[0.88] uppercase break-words"
              style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
            >
              {config.title}
            </h2>

            <p className="text-sm sm:text-lg text-slate-700 dark:text-slate-200 font-medium mt-3 leading-relaxed">
              {config.subtitle}
            </p>

            <blockquote className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border-l-4 border-[#E07A9A] mt-4 sm:mt-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic shadow-2xs text-left">
              "{config.curatorialStatement}"
            </blockquote>
          </div>

          {/* Dedicated 3D Interactive Feature Element */}
          <div className="flex-shrink-0 flex items-center justify-center p-2 sm:p-4 max-w-full overflow-hidden">
            <div className="p-3 sm:p-4 rounded-3xl bg-slate-50 dark:bg-black/30 border-2 border-slate-200 dark:border-white/10 shadow-md max-w-full overflow-hidden flex items-center justify-center">
              {config.render3D()}
            </div>
          </div>
        </div>

        {/* 3D Cards Grid for this Section */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-2 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <Layers className="w-4 h-4 text-[#153833] dark:!text-[#EFAEC4]" />
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#153833] dark:!text-[#EFAEC4]">
                OBRAS &amp; REGISTROS DISPONÍVEIS ({displayedItems.length})
              </span>
              {selectedDecade !== 'todas' && (
                <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#EFAEC4]/30 text-[#153833] dark:!text-[#EFAEC4] border border-[#E07A9A] font-bold">
                  DÉCADA: {selectedDecade}
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-500 dark:!text-[#EFAEC4]/80 uppercase hidden sm:inline">
              INSPEÇÃO 3D • CLIQUE PARA O DOSSIÊ HISTÓRICO
            </span>
          </div>

          {displayedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedItems.map((item) => (
                <Card3D
                  key={item.id}
                  item={item}
                  onOpenArticle={onOpenArticle}
                  onLike={onLike}
                  onShare={onShare}
                  accentColor={config.accentColor}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 px-6 rounded-3xl bg-slate-50 border border-dashed border-slate-300 text-center max-w-xl mx-auto">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700 mb-1">
                Nenhuma obra dos anos {selectedDecade} catalogada nesta seção.
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Redefina o filtro geral para visualizar todas as obras disponíveis desta categoria.
              </p>
              <button
                onClick={() => onSelectDecade?.('todas')}
                className="px-6 py-2.5 rounded-full text-xs font-mono font-bold bg-[#153833] text-white hover:bg-[#1f4e48] dark:bg-[#E07A9A] dark:text-[#0c2521] dark:hover:bg-[#efaec4] transition-colors cursor-pointer uppercase tracking-wider"
              >
                Limpar Filtro Geral ({categoryItems.length} obras nesta seção)
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
