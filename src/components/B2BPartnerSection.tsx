import React from 'react';
import {
  Building2,
  Disc3,
  Film,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { B2BPartnerCatalog, ArchiveItem } from '../types';
import { B2B_PARTNER_CATALOGS } from '../data/monetizationData';

interface B2BPartnerSectionProps {
  onOpenB2BModal: () => void;
  onFilterByCatalog: (itemIds: string[], catalogName: string) => void;
  onShowToast: (msg: string) => void;
}

export const B2BPartnerSection: React.FC<B2BPartnerSectionProps> = ({
  onOpenB2BModal,
  onFilterByCatalog,
  onShowToast,
}) => {
  return (
    <section
      id="secao-parceiros-b2b"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0c1413] border-t border-slate-200 dark:border-[#223632] transition-colors"
      aria-label="Catálogos e Acervos Patrocinados por Gravadoras e Produtoras Audiovisuais"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#273a36]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E07A9A]" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#E07A9A] dark:text-[#EFAEC4] uppercase">
                Monetização B2B • Showcase Institucional
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Catálogos em Destaque
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Gravadoras históricas, produtoras audiovisuais e cinematecas apoiam financeiramente a conservação deste acervo digital mediante custódia qualificada, disponibilizando matrizes raras em destaque e contextualização crítica.
            </p>
          </div>

          {/* CTA: Seja uma Instituição Parceira */}
          <div className="self-start md:self-auto">
            <button
              type="button"
              onClick={onOpenB2BModal}
              className="px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Building2 className="w-4 h-4 text-[#EFAEC4]" />
              <span>Seja uma Gravadora ou Produtora Parceira</span>
            </button>
          </div>
        </div>

        {/* Catalogs Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {B2B_PARTNER_CATALOGS.map((catalog) => (
            <div
              key={catalog.id}
              className="rounded-3xl bg-white dark:bg-[#14211e] border-2 border-slate-200 dark:border-[#273a36] hover:border-[#153833] dark:hover:border-[#EFAEC4] overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              {/* Cover Banner */}
              <div className="relative aspect-16/9 overflow-hidden bg-slate-950">
                <img
                  src={catalog.coverUrl}
                  alt={catalog.institutionName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-950/85 backdrop-blur-md text-[#EFAEC4] border border-[#EFAEC4]/30">
                    {catalog.partnershipLevel}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200">
                    {catalog.featuredWorksCount} Obras em Destaque
                  </span>
                </div>

                {/* Logo and Institution Headline inside banner */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#EFAEC4] block">
                    {catalog.logoText}
                  </span>
                  <h3
                    className="text-base font-black uppercase tracking-tight mt-0.5"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    {catalog.institutionName}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-3.5 h-3.5 text-[#E07A9A]" />
                    <span>Tema Curatorial: {catalog.curatorialTheme}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {catalog.headline}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {catalog.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#273a36] space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onFilterByCatalog(catalog.itemIds, catalog.institutionName);
                      onShowToast(
                        `🏛️ Exibindo ${catalog.itemIds.length} obras selecionadas do catálogo de ${catalog.institutionName}.`
                      );
                    }}
                    className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span>Explorar Obras deste Catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Taxa Institucional de Destaque</span>
                    <span className="text-slate-700 dark:text-slate-300 font-bold">
                      {catalog.monthlyContributionEstimate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
