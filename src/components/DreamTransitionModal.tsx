import React, { useEffect, useState } from 'react';
import { X, Sparkles, Check, Bookmark, ArrowRight, Disc3, BookOpen, Volume2 } from 'lucide-react';
import { FragmentoMemoria80 } from '../data/memoriaAnos80';
import { ArchiveItem } from '../types';
import { audioEngine } from '../utils/audioPlayer';

interface DreamTransitionModalProps {
  memoria: FragmentoMemoria80 | null;
  linkedItem?: ArchiveItem;
  isOpen: boolean;
  onClose: () => void;
  onOpenArticle?: (item: ArchiveItem) => void;
  onPlayItem?: (item: ArchiveItem) => void;
  onOpenBau?: () => void;
}

export const DreamTransitionModal: React.FC<DreamTransitionModalProps> = ({
  memoria,
  linkedItem,
  isOpen,
  onClose,
  onOpenArticle,
  onPlayItem,
  onOpenBau,
}) => {
  const [stage, setStage] = useState<'dream' | 'awake'>('dream');

  useEffect(() => {
    if (isOpen) {
      setStage('dream');
      // Transição de abertura dos olhos do sonho para o real após 700ms
      const timer = setTimeout(() => {
        setStage('awake');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !memoria) return null;

  const handleOpenLinkedWork = () => {
    if (linkedItem && onOpenArticle) {
      onClose();
      onOpenArticle(linkedItem);
    }
  };

  const handlePlayLinkedAudio = () => {
    if (linkedItem && onPlayItem) {
      onClose();
      onPlayItem(linkedItem);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dream-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      {/* Efeito de abertura dos olhos (Eyelids / Iris / Dream Awakening) */}
      <div
        className={`relative w-full max-w-2xl overflow-hidden rounded-3xl sm:rounded-4xl bg-[#14211e] border-2 sm:border-3 border-[#EFAEC4] shadow-2xl transition-all duration-700 ${
          stage === 'dream'
            ? 'scale-95 opacity-80 blur-xs'
            : 'scale-100 opacity-100 blur-none'
        }`}
      >
        {/* Pálpebras do Sonho abrindo (Eyelid shutters) */}
        <div
          className={`absolute top-0 left-0 right-0 h-1/2 bg-[#0a1210] z-30 transition-transform duration-700 ease-out pointer-events-none flex items-end justify-center pb-2 border-b border-[#EFAEC4]/30 ${
            stage === 'awake' ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#EFAEC4]/60">
            • Despertando de 1984... •
          </span>
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 h-1/2 bg-[#0a1210] z-30 transition-transform duration-700 ease-out pointer-events-none flex items-start justify-center pt-2 border-t border-[#EFAEC4]/30 ${
            stage === 'awake' ? 'translate-y-full' : 'translate-y-0'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400">
            O objeto do desenho materializou-se no acervo
          </span>
        </div>

        {/* Faixa Superior Retrô */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#153833] border-b border-[#EFAEC4]/40 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E07A9A] animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#EFAEC4] font-bold">
              Despertar de 1984 • Objeto Resgatado
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corpo com a Transição do Sonho para a Foto Real */}
        <div className="p-5 sm:p-8 space-y-6 text-slate-100">
          {/* Comparativo Visual: Do Desenho de Leo para o Artefato Real */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-black">
            {linkedItem?.coverUrl ? (
              <img
                src={linkedItem.coverUrl}
                alt={linkedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                <span>{memoria.hiddenObjectName}</span>
              </div>
            )}

            {/* Gradiente sobreposto com o selo de guardado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold uppercase shadow-sm">
                  ✓ Guardado no Baú
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 text-[#EFAEC4] font-mono text-[10px] font-bold border border-white/20">
                  {memoria.timeOfDay} • {memoria.objectCategoryLabel}
                </span>
              </div>

              <h3
                id="dream-modal-title"
                className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                {memoria.hiddenObjectName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                Fragmento de Memória: "{memoria.collectibleBadge}"
              </p>
            </div>
          </div>

          {/* Relato do Diário & Curiosidade Histórica Desbloqueada */}
          <div className="space-y-3 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EFAEC4] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#E07A9A]" />
              <span>O que Leo anotou em 1984:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-serif">
              "{memoria.storyExcerpt}"
            </p>

            <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-300">
              <strong className="text-white block mb-0.5">💡 Registro Histórico Desbloqueado:</strong>
              {memoria.historicalFunFact}
            </div>
          </div>

          {/* Conexão com a Obra Real do Acervo */}
          {linkedItem && (
            <div className="p-3.5 rounded-xl bg-black/40 border border-[#EFAEC4]/30 flex items-center justify-between flex-wrap gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Obra Correspondente no Acervo Synthetica:
                </span>
                <p className="text-sm font-bold text-white truncate">
                  {linkedItem.title} — <span className="font-normal text-slate-300">{linkedItem.creator} ({linkedItem.year})</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {linkedItem.audioTrackName && onPlayItem && (
                  <button
                    type="button"
                    onClick={handlePlayLinkedAudio}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-[#E07A9A] text-slate-950 hover:bg-[#efaec4] transition-all cursor-pointer flex items-center gap-1.5"
                    title="Tocar trecho sonoro no toca-discos"
                  >
                    <Disc3 className="w-3.5 h-3.5" />
                    <span>Tocar Vinil</span>
                  </button>
                )}

                {onOpenArticle && (
                  <button
                    type="button"
                    onClick={handleOpenLinkedWork}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Ficha da Obra</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Botões de Ação do Baú */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
            >
              Continuar Lendo o Acervo
            </button>

            {onOpenBau && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBau();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E07A9A] text-slate-950 hover:bg-[#efaec4] active:scale-95 transition-all cursor-pointer shadow-lg flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Abrir Meu Baú de Memórias</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
