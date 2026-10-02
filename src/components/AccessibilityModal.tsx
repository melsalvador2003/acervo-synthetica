import React, { useEffect, useRef } from 'react';
import {
  Accessibility,
  X,
  Type,
  Eye,
  ZapOff,
  RotateCcw,
  Volume2,
  Keyboard,
  Check,
  Moon,
  Sun,
} from 'lucide-react';
import { useAccessibility, FontSizeLevel, SpeechRate } from '../context/AccessibilityContext';
import { speechService } from '../utils/speechSynthesis';

export const AccessibilityModal: React.FC = () => {
  const {
    isOpenPanel,
    closePanel,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    readableFont,
    setReadableFont,
    speechRate,
    setSpeechRate,
    darkMode,
    setDarkMode,
    resetSettings,
    announce,
  } = useAccessibility();

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Set focus to close button when opened
  useEffect(() => {
    if (isOpenPanel) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpenPanel]);

  if (!isOpenPanel) return null;

  const handleTestSpeech = () => {
    speechService.speak(
      'Teste de audiodescrição do Acervo Synthetica. Síntese de voz configurada com sucesso.',
      { rate: speechRate }
    );
    announce('Testando síntese de voz.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePanel();
        }
      }}
    >
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col focus-visible:outline-none">
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#153833] text-[#EFAEC4] flex items-center justify-center shadow-inner">
              <Accessibility className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="a11y-modal-title"
                className="text-lg sm:text-xl font-black text-slate-900 tracking-tight"
              >
                Acessibilidade do Acervo
              </h2>
              <p className="text-xs text-slate-500">
                Personalize tamanho de texto, contraste e audiodescrição
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={closePanel}
            aria-label="Fechar painel de acessibilidade"
            className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content with smooth scrolling */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* 1. Tamanho do Texto */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Type className="w-4 h-4 text-[#153833]" aria-hidden="true" />
                Tamanho da Fonte (Tipografia)
              </label>
              <span className="text-xs font-semibold text-slate-500">
                {fontSize === 'normal' && 'Padrão (100%)'}
                {fontSize === 'large' && 'Grande (115%)'}
                {fontSize === 'xlarge' && 'Extra Grande (130%)'}
              </span>
            </div>
            <div
              className="grid grid-cols-3 gap-2 sm:gap-3"
              role="radiogroup"
              aria-label="Escolha o tamanho do texto"
            >
              {(
                [
                  { level: 'normal', label: 'A', desc: '100%' },
                  { level: 'large', label: 'A+', desc: '115%' },
                  { level: 'xlarge', label: 'A++', desc: '130%' },
                ] as { level: FontSizeLevel; label: string; desc: string }[]
              ).map((option) => {
                const isSelected = fontSize === option.level;
                return (
                  <button
                    key={option.level}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setFontSize(option.level)}
                    className={`py-2.5 px-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                      isSelected
                        ? 'bg-[#153833] text-white border-[#153833] shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-base sm:text-lg">{option.label}</span>
                    <span className="text-[11px] opacity-80">{option.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Visual & Contraste */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#153833]" aria-hidden="true" />
              Conforto Visual & Contraste
            </h3>

            {/* Toggle Modo Escuro (Dark Mode) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-4">
                <span className="text-sm font-bold text-slate-900 block flex items-center gap-1.5">
                  {darkMode ? (
                    <Moon className="w-4 h-4 text-[#EFAEC4]" aria-hidden="true" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  )}
                  Modo Escuro (Dark Mode)
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Paleta noturna botânica e acolhedora com tons profundos de pinheiro e contraste suave para leitura noturna.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={darkMode}
                aria-label="Ativar modo escuro"
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                  darkMode ? 'bg-[#153833]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Alto Contraste */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-4">
                <span className="text-sm font-bold text-slate-900 block">Modo de Alto Contraste</span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Fundo escuro profundo com textos e bordas de altíssima visibilidade (WCAG AAA).
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={highContrast}
                aria-label="Ativar modo de alto contraste"
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                  highContrast ? 'bg-[#153833]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Redução de Movimento */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-4">
                <span className="text-sm font-bold text-slate-900 block flex items-center gap-1.5">
                  <ZapOff className="w-4 h-4 text-slate-600" aria-hidden="true" />
                  Redução de Movimento
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Pausa giros do toca-discos, efeitos 3D contínuos e reduz animações que possam causar desconforto ou vertigem.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={reducedMotion}
                aria-label="Ativar redução de movimento"
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                  reducedMotion ? 'bg-[#153833]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Fonte de Alta Legibilidade */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="pr-4">
                <span className="text-sm font-bold text-slate-900 block">
                  Espaçamento & Legibilidade Expandida
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Aumenta espaçamento entre letras e parágrafos, facilitando a leitura para pessoas com dislexia ou fadiga visual.
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={readableFont}
                aria-label="Ativar espaçamento e legibilidade expandida"
                onClick={() => setReadableFont(!readableFont)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                  readableFont ? 'bg-[#153833]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    readableFont ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* 3. Audiodescrição e Síntese de Voz */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#153833]" aria-hidden="true" />
                Audiodescrição em Voz Alta
              </h3>
              <button
                type="button"
                onClick={handleTestSpeech}
                className="text-xs font-bold text-[#153833] hover:underline cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded px-1.5 py-0.5"
              >
                Ouvir voz de teste
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Todas as fichas de obras do acervo possuem botão para narração do contexto histórico e detalhes materiais em voz alta.
            </p>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">Velocidade da narração:</span>
              <div
                className="grid grid-cols-3 gap-2"
                role="radiogroup"
                aria-label="Velocidade da audiodescrição"
              >
                {(
                  [
                    { rate: 0.8, label: '0.8x (Mais lenta)' },
                    { rate: 1.0, label: '1.0x (Padrão)' },
                    { rate: 1.25, label: '1.25x (Rápida)' },
                  ] as { rate: SpeechRate; label: string }[]
                ).map((item) => (
                  <button
                    key={item.rate}
                    type="button"
                    role="radio"
                    aria-checked={speechRate === item.rate}
                    onClick={() => setSpeechRate(item.rate)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                      speechRate === item.rate
                        ? 'bg-[#153833] text-white border-[#153833]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Guia de Teclado e Atalhos */}
          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-[#153833]" aria-hidden="true" />
              Navegação por Teclado e Atalhos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between py-1">
                <span>Abrir este painel:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-sm">
                  Alt + A
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Fechar modais / fichas:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-sm">
                  Esc
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Navegar entre elementos:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-sm">
                  Tab
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Ativar botões ou links:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-sm">
                  Enter / Espaço
                </kbd>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={resetSettings}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded px-2 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Restaurar padrão
          </button>
          <button
            type="button"
            onClick={closePanel}
            className="px-5 py-2.5 rounded-full bg-[#153833] text-white text-xs sm:text-sm font-bold hover:bg-[#1c4d46] active:scale-95 transition-all cursor-pointer flex items-center gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            Concluir Ajustes
          </button>
        </div>
      </div>
    </div>
  );
};
