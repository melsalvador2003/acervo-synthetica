import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Disc3, SkipBack, SkipForward } from 'lucide-react';
import { ArchiveItem } from '../types';
import { HolographicVinyl } from './HolographicVinyl';
import { audioEngine } from '../utils/audioPlayer';

interface VinylPlayerSectionProps {
  currentItem: ArchiveItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  elapsedSeconds: number;
}

export const VinylPlayerSection: React.FC<VinylPlayerSectionProps> = ({
  currentItem,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  elapsedSeconds,
}) => {
  const [speed, setSpeed] = useState<'33' | '45' | '78'>('33');
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync speed changes with audioEngine
  useEffect(() => {
    audioEngine.setSpeed(speed);
  }, [speed]);

  // Sync volume changes with audioEngine
  useEffect(() => {
    audioEngine.setVolume(isMuted ? 0 : volume / 100);
  }, [volume, isMuted]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <section
      id="secao-vinil"
      aria-label="Sala de Audição Analógica"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-slate-900 bg-white border-b border-slate-200 overflow-hidden scroll-mt-24"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Container with High-Contrast Editorial Aesthetic */}
        <div className="relative w-full rounded-3xl sm:rounded-4xl p-5 sm:p-10 md:p-12 bg-white/95 dark:bg-[#14211e] border-2 sm:border-3 border-[#153833] dark:border-[#EFAEC4]/40 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Top Section Tag Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-white/10 pb-3 sm:pb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#153833] text-white dark:bg-[#E07A9A] dark:text-[#0c2521]">
              02 / EXPERIÊNCIA DE REPRODUÇÃO
            </span>
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-500 dark:!text-[#EFAEC4] uppercase">
              REPRODUTOR HI-FI VINTAGE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-[#EFAEC4] opacity-75 ${
                  isPlaying ? 'animate-ping' : ''
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isPlaying ? 'bg-[#E07A9A]' : 'bg-slate-400'
                }`}
              />
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 dark:!text-[#EFAEC4] uppercase">
              {isPlaying ? 'PRATO GIRANDO • SINAL ANALÓGICO' : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Monumental Headline */}
        <div className="my-3">
          <h2
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#E07A9A] dark:text-[#EFAEC4] tracking-tight leading-[0.85] uppercase select-none"
            style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
          >
            SALA DE AUDIÇÃO ANALÓGICA
          </h2>

          <div className="w-full flex items-center justify-between text-[10px] sm:text-xs font-mono font-bold text-slate-500 dark:!text-[#EFAEC4] uppercase tracking-wider mt-1">
            <span className="text-slate-500 dark:!text-[#EFAEC4]">VELOCIDADES: 33 ⅓ • 45 • 78 RPM</span>
            <span className="hidden sm:inline text-slate-500 dark:!text-[#EFAEC4]">CHIADO AUTÊNTICO DE VINIL</span>
            <span className="text-slate-500 dark:!text-[#EFAEC4]">EXPERIÊNCIA IMERSIVA</span>
          </div>
        </div>

        {/* Main Turntable and Track Player Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Side: Turntable Platter with Holographic Vinyl (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative p-3 sm:p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-xl overflow-hidden player-motion">
            {/* Turntable Platter Base with Tone-arm and Vinyl Record */}
            <div
              className="relative w-full flex flex-col items-center justify-center py-2 cursor-pointer player-motion"
              onClick={onTogglePlay}
              title={isPlaying ? 'Clique para pausar reprodução' : 'Clique para girar o vinil'}
            >
              {/* Arm Rest Clip (resting stand when needle is lifted) */}
              <div className="absolute top-12 right-4 sm:top-14 sm:right-6 z-20 pointer-events-none flex flex-col items-center opacity-80">
                <div className="w-2.5 h-4 bg-slate-400 rounded-t-xs border border-slate-600 shadow-2xs" />
                <div className="w-3.5 h-2 bg-slate-700 rounded-xs shadow-xs" />
              </div>

              {/* Tonearm Assembly with Fluid, Natural Needle Placing & Lifting */}
              <div
                className="absolute top-2 right-4 sm:top-4 sm:right-7 z-30 pointer-events-none player-motion"
                style={{
                  transformOrigin: '16px 16px',
                  transform: isPlaying
                    ? 'rotate(18deg) translateY(0px)'
                    : 'rotate(-18deg) translateY(-6px)',
                  transition: 'transform 0.85s cubic-bezier(0.34, 1.4, 0.64, 1)',
                }}
              >
                {/* Pivot Base & Counterweight */}
                <div className="relative">
                  {/* Counterweight extending backward */}
                  <div className="absolute -top-3.5 left-1.5 w-4 h-6 rounded-xs bg-slate-700 border border-slate-600 shadow-xs" />
                  {/* Metallic Pivot Base Ring */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-400 via-slate-100 to-slate-400 border border-slate-600 shadow-md flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-500 shadow-inner" />
                  </div>
                </div>

                {/* Tonearm Rod & Headshell with live groove tracking wobble */}
                <div
                  className={`relative left-[13px] -top-1 flex flex-col items-center origin-top player-motion ${
                    isPlaying ? 'animate-tonearm-groove' : ''
                  }`}
                >
                  {/* Chrome Aluminum Arm Tube */}
                  <div className="w-1.5 sm:w-2 h-36 sm:h-44 rounded-full bg-gradient-to-r from-slate-300 via-white to-slate-400 shadow-md" />

                  {/* Headshell & Cartridge (Pink & Metallic Titanium) */}
                  <div className="w-5 sm:w-6 h-8 rounded-sm bg-gradient-to-b from-slate-800 to-[#153833] border border-slate-600 shadow-xl flex flex-col items-center justify-between p-1 -mt-1 rotate-3">
                    {/* Cartridge Accent */}
                    <div className="w-3.5 h-1.5 bg-[#EFAEC4] rounded-2xs shadow-2xs" />
                    {/* Stylus Needle tip (with illuminated groove point) */}
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPlaying
                          ? 'bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.9)] animate-pulse'
                          : 'bg-slate-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* The Turntable Platter (with Strobe Edge & Spinning Vinyl) */}
              <div
                className="relative p-2.5 sm:p-3 rounded-full bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-300 border-2 border-slate-400 shadow-2xl max-w-full flex items-center justify-center player-motion"
                style={{
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.8)',
                }}
              >
                {/* Platter Strobe Ring */}
                <div
                  className={`absolute inset-0 rounded-full border border-dashed border-slate-400/70 pointer-events-none player-motion ${
                    isPlaying ? 'animate-vinyl-spin' : ''
                  }`}
                  style={{
                    animationDuration: speed === '78' ? '1.2s' : speed === '45' ? '1.8s' : '2.5s',
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                />

                <HolographicVinyl
                  isSpinning={isPlaying}
                  size={340}
                  albumTitle={currentItem.title}
                  artist={currentItem.creator}
                  speed={speed}
                  className="w-[200px] h-[200px] xs:w-[240px] xs:h-[240px] sm:w-[320px] sm:h-[320px] max-w-full"
                />
              </div>
            </div>

            {/* Turntable Platter Base Status */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-between w-full text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-500 px-1 sm:px-2 gap-2">
              <span className="flex items-center gap-1.5">
                <Disc3
                  className={`w-3.5 h-3.5 player-motion ${
                    isPlaying ? 'animate-spin text-[#153833]' : 'text-slate-400'
                  }`}
                />
                <span>{isPlaying ? `GIRANDO A ${speed} RPM` : 'PRATO PARADO'}</span>
              </span>

              {/* Turntable RPM Selector */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200 shadow-2xs">
                {(['33', '45', '78'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpeed(s);
                    }}
                    className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      speed === s
                        ? 'bg-[#153833] text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {s} RPM
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Editorial Audio Controller (col-span-7) */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-8 rounded-3xl border-2 border-[#153833] shadow-xl flex flex-col justify-between">
            <div>
              {/* Header inside the controller */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-xs font-mono font-bold uppercase text-slate-500 flex-wrap gap-1">
                <div className="inline-flex items-center gap-2 text-[#153833]">
                  <Radio className="w-3.5 h-3.5 text-[#E07A9A]" />
                  <span>DISPOSITIVO: TOCA-DISCOS DIRETO</span>
                </div>
                <span className="text-[#E07A9A]">
                  {currentItem.category.toUpperCase()} • {currentItem.decade}
                </span>
              </div>

              {/* Title & Artist */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  OBRA EM REPRODUÇÃO ANALÓGICA:
                </span>
                <h3
                  className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 uppercase mt-0.5 leading-none"
                  style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
                >
                  {currentItem.title}
                </h3>
                <p className="text-slate-700 text-xs sm:text-base font-semibold mt-1">
                  {currentItem.creator} —{' '}
                  <span className="italic text-slate-500 font-normal">{currentItem.role}</span>
                </p>
              </div>

              {/* Curatorial Story Note */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
                {currentItem.historyText}
              </p>

              {/* Painel do Sinal Analógico (Estilo Anterior Otimizado & Totalmente Funcional) */}
              <div className="mt-5 sm:mt-6 rounded-2xl bg-slate-950 border border-slate-800 p-3.5 sm:p-4 shadow-inner player-motion">
                {/* Header Técnico do Sinal Analógico */}
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 mb-2.5 px-0.5">
                  <span className="flex items-center gap-1.5 text-[#EFAEC4]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPlaying ? 'bg-[#EFAEC4] animate-ping' : 'bg-slate-600'
                      }`}
                    />
                    <span>{isPlaying ? 'SINAL ANALÓGICO ATIVO' : 'SINAL EM ESPERA'}</span>
                  </span>
                  <span className="hidden sm:inline text-slate-500">HI-FI STEREO • 20Hz - 20kHz</span>
                  <span className="text-pink-300">{speed} RPM • {isPlaying ? 'SINAL VU +3.2dB' : 'CALIBRAÇÃO 0dB'}</span>
                </div>

                {/* Fileira de Frequências do Sinal Analógico em Tempo Real */}
                <div
                  className="w-full h-11 sm:h-12 bg-slate-900/90 rounded-xl border border-slate-800/80 flex items-end justify-between px-3 sm:px-4 pb-2 pt-1 overflow-hidden select-none player-motion"
                  title={isPlaying ? 'Sinal analógico em tempo real' : 'Sinal analógico em espera'}
                >
                  {Array.from({ length: 32 }).map((_, i) => {
                    const isPink = i % 4 === 2 || i % 7 === 0;
                    const barColor = isPink ? '#EFAEC4' : '#5EEAD4';
                    // Harmonic wave curve for authentic analog equalizer bounce
                    const baseHeight = 10 + Math.sin((i / 32) * Math.PI) * 16;
                    const animDelay = `${((i * 0.04) % 0.8).toFixed(2)}s`;
                    const animDuration = speed === '78' ? '0.45s' : speed === '45' ? '0.65s' : '0.85s';

                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center justify-end h-full player-motion"
                        style={{ width: '4px' }}
                      >
                        <span
                          className={`w-full rounded-full transition-all duration-300 player-motion ${
                            isPlaying
                              ? 'animate-analog-wave'
                              : 'opacity-30'
                          }`}
                          style={{
                            height: isPlaying ? `${baseHeight}px` : '4px',
                            backgroundColor: barColor,
                            color: barColor,
                            animationDelay: animDelay,
                            animationDuration: animDuration,
                            boxShadow: isPlaying ? `0 0 8px ${barColor}90` : 'none',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Sub-rótulos de Frequência do Equalizador Analógico */}
                <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono font-semibold text-slate-500 mt-2 px-1">
                  <span>GRAVES (60Hz)</span>
                  <span>MÉDIOS (1kHz)</span>
                  <span>AGUDOS (16kHz)</span>
                </div>
              </div>

              {/* Scrubber / Time */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] sm:text-xs font-mono text-slate-500">
                <span>{formatTime(elapsedSeconds)}</span>
                <span className="text-[9px] sm:text-[10px] uppercase text-[#153833] dark:!text-[#EFAEC4] font-bold tracking-wider text-center truncate px-1 flex items-center gap-1.5 justify-center">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPlaying ? 'bg-[#E07A9A] animate-ping' : 'bg-slate-400'
                    }`}
                  />
                  <span>{isPlaying ? 'ÁUDIO ANALÓGICO EM EXECUÇÃO' : 'STANDBY'}</span>
                </span>
                <span>3:45</span>
              </div>
            </div>

            {/* Playback Controls & Volume */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Previous Track */}
                <button
                  id="turntable-prev-track"
                  onClick={onPrevTrack}
                  className="p-3 rounded-full text-[#E07A9A] dark:text-[#EFAEC4] bg-[#EFAEC4]/10 hover:bg-[#EFAEC4]/25 dark:bg-[#EFAEC4]/15 dark:hover:bg-[#EFAEC4]/30 border border-[#E07A9A]/60 dark:border-[#EFAEC4]/60 transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Faixa anterior"
                  aria-label="Faixa anterior"
                >
                  <SkipBack className="w-4 h-4 text-[#E07A9A] dark:text-[#EFAEC4]" />
                </button>

                {/* Play / Pause Toggle */}
                <button
                  id="turntable-play-toggle"
                  onClick={onTogglePlay}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider text-[#153833] bg-[#EFAEC4] hover:bg-[#eb9bb4] transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-[#E07A9A]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pausar Disco</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-[#153833]" />
                      <span>Girar Vinil &amp; Tocar</span>
                    </>
                  )}
                </button>

                {/* Next Track */}
                <button
                  id="turntable-next-track"
                  onClick={onNextTrack}
                  className="p-3 rounded-full text-[#E07A9A] dark:text-[#EFAEC4] bg-[#EFAEC4]/10 hover:bg-[#EFAEC4]/25 dark:bg-[#EFAEC4]/15 dark:hover:bg-[#EFAEC4]/30 border border-[#E07A9A]/60 dark:border-[#EFAEC4]/60 transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Próxima faixa"
                  aria-label="Próxima faixa"
                >
                  <SkipForward className="w-4 h-4 text-[#E07A9A] dark:text-[#EFAEC4]" />
                </button>
              </div>

              {/* Master Volume Controller */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                  title={isMuted ? 'Desmutar' : 'Mutar'}
                  aria-label={isMuted ? 'Desmutar' : 'Mutar'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#153833]" />
                  )}
                </button>

                <label htmlFor="master-volume-slider" className="sr-only">
                  Volume analógico
                </label>
                <input
                  id="master-volume-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-24 sm:w-28 accent-[#153833] cursor-pointer"
                  aria-label="Controle de volume do toca-discos"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
