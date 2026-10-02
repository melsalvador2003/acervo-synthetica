import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, Headphones, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { ArchiveItem } from '../types';
import { speechService } from '../utils/speechSynthesis';
import { useAccessibility, SpeechRate } from '../context/AccessibilityContext';

interface AudioDescriptionPlayerProps {
  item: ArchiveItem;
  className?: string;
}

export const AudioDescriptionPlayer: React.FC<AudioDescriptionPlayerProps> = ({ item, className = '' }) => {
  const { speechRate, setSpeechRate, announce } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Generate complete descriptive text for the item
  const categoryLabels: Record<string, string> = {
    danca: 'Dança',
    musica: 'Música',
    cinema: 'Cinema',
    'artes-plasticas': 'Artes Plásticas',
    eletronicos: 'Eletrônicos',
  };

  const categoryName = categoryLabels[item.category] || item.category;

  const audioDescriptionText = [
    `Audiodescrição do registro histórico.`,
    `Título: ${item.title}.`,
    `Autor ou criador: ${item.creator}, no papel de ${item.role}.`,
    `Ano de criação: ${item.year}, pertencente à década de ${item.decade}.`,
    `Categoria cultural: ${categoryName}.`,
    `Suporte material e formato: ${item.mediaFormat}.`,
    `Contexto histórico: ${item.historyText}`,
    `Uso e circulação na época: ${item.historicalUse}`,
    `Público-alvo e recepção: ${item.targetAudience}`,
    `Legado e impacto cultural: ${item.legacyImpact}`,
    `Nota curatorial: ${item.curatorialNotes}`,
  ].join(' ');

  // Stop speech when item changes or component unmounts
  useEffect(() => {
    setIsPlaying(false);
    setIsPaused(false);
    speechService.stop();

    return () => {
      speechService.stop();
    };
  }, [item.id]);

  const handleStartPlay = () => {
    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
      setIsPlaying(true);
      announce(`Audiodescrição de ${item.title} retomada.`);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);
    announce(`Iniciando audiodescrição de ${item.title}.`);

    speechService.speak(audioDescriptionText, {
      rate: speechRate,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        announce(`Audiodescrição de ${item.title} concluída.`);
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onPause: () => {
        setIsPaused(true);
        setIsPlaying(false);
      },
      onResume: () => {
        setIsPaused(false);
        setIsPlaying(true);
      },
    });
  };

  const handlePause = () => {
    speechService.pause();
    setIsPaused(true);
    setIsPlaying(false);
    announce(`Audiodescrição pausada.`);
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    announce(`Audiodescrição interrompida.`);
  };

  const toggleRate = () => {
    const rates: SpeechRate[] = [0.8, 1.0, 1.25];
    const nextIdx = (rates.indexOf(speechRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setSpeechRate(nextRate);

    // If currently playing, restart with new rate
    if (isPlaying) {
      speechService.stop();
      setTimeout(() => {
        speechService.speak(audioDescriptionText, {
          rate: nextRate,
          onStart: () => {
            setIsPlaying(true);
            setIsPaused(false);
          },
          onEnd: () => {
            setIsPlaying(false);
            setIsPaused(false);
          },
        });
      }, 50);
    }
  };

  return (
    <section
      aria-label={`Audiodescrição de ${item.title}`}
      className={`rounded-2xl border p-3.5 sm:p-4 transition-all ${
        isPlaying
          ? 'bg-amber-50/80 border-amber-300 shadow-sm'
          : 'bg-slate-50 border-slate-200'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title & Status Indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isPlaying
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-[#153833] text-[#EFAEC4]'
            }`}
          >
            <Headphones className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
              <span>Audiodescrição do Registro</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                Acessibilidade
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              {isPlaying
                ? 'Narrando contexto histórico e material...'
                : isPaused
                ? 'Reprodução em pausa'
                : 'Ouvir ficha completa narrada em voz alta'}
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Play/Pause Button */}
          {!isPlaying ? (
            <button
              type="button"
              onClick={handleStartPlay}
              aria-label={`Reproduzir audiodescrição de ${item.title}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#153833] text-white hover:bg-[#1c4d46] text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>{isPaused ? 'Continuar' : 'Ouvir'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              aria-label="Pausar audiodescrição"
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
              <span>Pausar</span>
            </button>
          )}

          {/* Stop Button */}
          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              aria-label="Parar audiodescrição"
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              title="Parar reprodução"
            >
              <Square className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
            </button>
          )}

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={toggleRate}
            aria-label={`Velocidade da narração: ${speechRate}x. Clique para alterar.`}
            title="Alterar velocidade de leitura"
            className="px-2.5 py-1.5 sm:py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-mono font-bold transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            {speechRate}x
          </button>

          {/* View Transcript Toggle */}
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            aria-expanded={showTranscript}
            aria-label={showTranscript ? 'Ocultar transcrição' : 'Ver transcrição da audiodescrição'}
            title="Ver transcrição textual completa"
            className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Expandable Transcript Accordion */}
      {showTranscript && (
        <div className="mt-3 pt-3 border-t border-slate-200/80 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Transcrição da Audiodescrição
            </span>
            <button
              type="button"
              onClick={() => setShowTranscript(false)}
              className="text-[11px] text-slate-500 hover:underline cursor-pointer"
            >
              Ocultar
            </button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
            {audioDescriptionText}
          </p>
        </div>
      )}
    </section>
  );
};
