import React from 'react';
import { Heart } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (cat: Category | 'todos') => void;
  onOpenAbout: () => void;
  onOpenAddModal: () => void;
  onOpenSubscription?: () => void;
  onOpenB2B?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAbout,
  onOpenSubscription,
  onOpenB2B,
}) => {
  const sections = [
    { num: '01', label: 'Dança', id: 'secao-danca', cat: 'danca' as Category },
    { num: '02', label: 'Música', id: 'secao-musica', cat: 'musica' as Category },
    { num: '03', label: 'Cinema', id: 'secao-cinema', cat: 'cinema' as Category },
    { num: '04', label: 'Artes Plásticas', id: 'secao-artes-plasticas', cat: 'artes-plasticas' as Category },
    { num: '05', label: 'Eletrônicos', id: 'secao-eletronicos', cat: 'eletronicos' as Category },
  ];

  return (
    <footer className="w-full text-slate-900 bg-white border-t-2 border-[#153833] dark:border-[#EFAEC4]/40 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        {/* Top Editorial Notation Bar */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#153833] dark:!text-[#EFAEC4] uppercase pb-4 mb-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E07A9A]" />
            <span className="text-[#153833] dark:!text-[#EFAEC4]">[ ARQUIVO FINAL • SYNTHETICA ]</span>
          </div>
          <span className="hidden sm:inline text-[#153833] dark:!text-[#EFAEC4]">MEMÓRIA • GESTO • TEMPO • OBJETO</span>
          <span className="text-[#153833] dark:!text-[#EFAEC4]">SÃO PAULO / BRASIL</span>
        </div>

        {/* Mid Row: Manifesto + Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start my-6">
          <div className="md:col-span-5">
            <h3
              className="text-3xl sm:text-4xl font-black tracking-tight text-[#E07A9A] dark:text-[#EFAEC4] uppercase leading-none"
              style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
            >
              ACERVO SYNTHETICA
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-sm leading-relaxed">
              Acervo digital vivo dedicado a conservar a história, o uso de época e o impacto de obras fundamentais da cultura nacional e mundial.
            </p>
          </div>

          <div className="md:col-span-4">
            <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#153833] dark:!text-[#EFAEC4] mb-3">
              GALERIAS DO ACERVO
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    onSelectCategory(sec.cat);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left text-slate-600 dark:text-slate-300 hover:text-[#153833] dark:hover:text-[#EFAEC4] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="text-[#E07A9A] text-[10px]">{sec.num}</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col items-start md:items-end text-xs font-mono space-y-1.5">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#153833] dark:!text-[#EFAEC4] mb-1">
              MODELO CULTURAL &amp; APOIO
            </span>
            {onOpenSubscription && (
              <button
                type="button"
                onClick={onOpenSubscription}
                className="text-slate-600 dark:text-slate-300 hover:text-[#153833] dark:hover:text-[#EFAEC4] transition-colors cursor-pointer text-left md:text-right"
              >
                Planos de Assinatura (Indie &amp; Sync)
              </button>
            )}
            {onOpenB2B && (
              <button
                type="button"
                onClick={onOpenB2B}
                className="text-slate-600 dark:text-slate-300 hover:text-[#153833] dark:hover:text-[#EFAEC4] transition-colors cursor-pointer text-left md:text-right"
              >
                Parcerias B2B (Gravadoras &amp; Produtoras)
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                document.getElementById('secao-loja-cultural')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-600 dark:text-slate-300 hover:text-[#153833] dark:hover:text-[#EFAEC4] transition-colors cursor-pointer text-left md:text-right"
            >
              Loja &amp; Artefatos (Parcerias E-commerce)
            </button>
            <button
              onClick={onOpenAbout}
              className="text-slate-600 dark:text-slate-300 hover:text-[#153833] dark:hover:text-[#EFAEC4] transition-colors cursor-pointer text-left md:text-right"
            >
              Manifesto &amp; Curadoria
            </button>
            <span className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
              Feito com <Heart className="w-3 h-3 text-[#E07A9A] fill-[#E07A9A]" /> para amantes da arte
            </span>
          </div>
        </div>

        {/* Academic Deliverables & FastAPI Backend Bar */}
        <div className="w-full my-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
            <span className="px-2 py-0.5 rounded bg-[#153833] text-[#EFAEC4] text-[10px] uppercase font-bold tracking-wider">
              Entregáveis
            </span>
            <span>Documentos Oficiais &amp; Backend FastAPI (MER):</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="/api/download/framework-doc"
              download
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 hover:border-[#E07A9A] text-slate-800 dark:text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
              title="Baixar Relatório Oficial de Framework Application com CRUD e decisões interdisciplinares"
            >
              <span>📄 Doc Framework (.docx)</span>
            </a>

            <a
              href="/api/download/mobile-doc"
              download
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 hover:border-[#E07A9A] text-slate-800 dark:text-slate-200 font-semibold transition-colors flex items-center gap-1.5"
              title="Baixar Relatório Oficial de Mobile Hybrid Development"
            >
              <span>📱 Doc Mobile (.docx)</span>
            </a>

            <a
              href="/api/download/fastapi-main"
              download="main.py"
              className="px-3 py-1.5 rounded-lg bg-[#153833] text-[#EFAEC4] hover:bg-[#1f5049] font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Baixar código-fonte do Backend FastAPI em Python (MER Database Application + Endpoints CRUD)"
            >
              <span>🐍 Backend FastAPI (main.py)</span>
            </a>

            <a
              href="/api/download/fastapi-readme"
              download="README.md"
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-300 dark:border-white/20 hover:border-[#E07A9A] text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1"
              title="Baixar manual de execução e documentação dos endpoints FastAPI"
            >
              <span>📖 Guia FastAPI (README)</span>
            </a>
          </div>
        </div>

        {/* MONUMENTAL KINETIC FOOTER TITLE (Image 1 & Image 5 Style) */}
        <div className="w-full text-center select-none overflow-hidden pt-6 pb-2 border-t border-slate-200 dark:border-white/10">
          <div
            className="text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[12rem] font-black tracking-tight leading-[0.8] uppercase text-slate-200 dark:text-white/10 hover:text-[#153833]/15 dark:hover:text-[#EFAEC4]/20 transition-colors duration-500"
            style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
          >
            SYNTHETICA
          </div>
        </div>

        {/* Bottom Coordinates */}
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-400 uppercase pt-3 border-t border-slate-100 dark:border-white/10">
          <span>© 2026 SYNTHETICA • TODOS OS DIREITOS RESERVADOS</span>
          <span>SÉCULO XX—XXI</span>
        </div>
      </div>
    </footer>
  );
};
