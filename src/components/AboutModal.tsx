import React from 'react';
import { X, Sparkles, Disc3, Film, HeartHandshake, Archive } from 'lucide-react';
import { IridescentOrb } from './IridescentOrb';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#14211e] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">
        {/* Iridescent Accent header */}
        <div
          className="relative p-6 sm:p-8 text-white overflow-hidden"
          style={{ backgroundColor: '#153833' }}
        >
          {/* Subtle Orb */}
          <div className="absolute -right-8 -top-8 opacity-40">
            <IridescentOrb size={140} variant="mint-pink" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#EFAEC4] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-[#EFAEC4]" />
              <span>Manifesto do Acervo</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black uppercase text-[#EFAEC4]"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Quem Somos
            </h2>
            <p className="text-xs sm:text-sm text-pink-200/90 mt-1">
              Synthetica: O espaço vivo de preservação cultural e memória afetiva
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4 text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-h-[60vh] overflow-y-auto">
          <p>
            O <strong>Synthetica</strong> nasceu da convicção de que <em>a arte do passado não pertence a arquivos empoeirados</em>, mas ao coração de quem a escuta, a assiste e a dança no presente.
          </p>
          <p>
            Em um mundo hiperconectado e efêmero, criamos este acervo pessoal para resgatar o valor do objeto, da cena e do disco com sua textura analógica e potência histórica.
          </p>

          <div className="grid grid-cols-3 gap-3 my-4 text-center">
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-[#EFAEC4]/15 border border-teal-100 dark:border-[#EFAEC4]/30">
              <Disc3 className="w-5 h-5 text-[#153833] dark:text-[#EFAEC4] mx-auto mb-1" />
              <span className="text-xs font-bold text-[#153833] dark:text-[#EFAEC4] block">Música</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300">Sulcos, fitas e harmonia</span>
            </div>

            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40">
              <span className="w-4 h-4 rounded-full bg-[#E07A9A] inline-block mb-1" />
              <span className="text-xs font-bold text-purple-900 dark:text-[#EFAEC4] block">Dança</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300">Corpo, palco e gravidade</span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-800/40">
              <Film className="w-5 h-5 text-rose-700 dark:text-[#EFAEC4] mx-auto mb-1" />
              <span className="text-xs font-bold text-rose-900 dark:text-[#EFAEC4] block">Cinema</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300">Película, luz e tempo</span>
            </div>
          </div>

          <blockquote className="p-4 rounded-2xl bg-[#EFAEC4]/20 border-l-4 border-[#E07A9A] text-slate-800 dark:text-slate-200 text-xs italic">
            "Cada objeto, cada cena, cada disco tem uma história por trás. Aqui, conectamos você ao passado de um jeito pessoal."
          </blockquote>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-black/30 border-t border-slate-100 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs font-bold text-[#0c2521] bg-[#EFAEC4] hover:bg-[#efaec4]/90 transition-all cursor-pointer shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
