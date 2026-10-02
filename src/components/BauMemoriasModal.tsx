import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Award,
  Disc3,
  Clock,
  Play,
  RotateCcw,
  Check,
  Lock,
  Unlock,
  Key,
  BookOpen,
  Volume2,
  Gamepad2,
  Tv,
  Compass,
  ArrowRight,
  Radio,
} from 'lucide-react';
import {
  MEMORIAS_1984,
  FragmentoMemoria80,
  reiniciarMemorias,
} from '../data/memoriaAnos80';
import {
  MEMORIAS_1994,
  FragmentoMemoria90,
  obterStatusChave1994,
  desbloquearChave1994,
  obterMemorias90Coletadas,
  reiniciarMemorias90,
} from '../data/memoriaAnos90';
import { ArchiveItem } from '../types';
import { audioEngine } from '../utils/audioPlayer';

interface BauMemoriasModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectedIds: string[];
  allItems: ArchiveItem[];
  onOpenArticle: (item: ArchiveItem) => void;
  onPlayItem?: (item: ArchiveItem) => void;
  onResetProgress?: () => void;
  onFilterDecade?: (decade: string) => void;
}

export const BauMemoriasModal: React.FC<BauMemoriasModalProps> = ({
  isOpen,
  onClose,
  collectedIds,
  allItems,
  onOpenArticle,
  onPlayItem,
  onResetProgress,
  onFilterDecade,
}) => {
  const [activeTab, setActiveTab] = useState<'1984' | '1994'>('1984');
  const [selectedMemoria80, setSelectedMemoria80] = useState<FragmentoMemoria80 | null>(null);
  const [selectedMemoria90, setSelectedMemoria90] = useState<FragmentoMemoria90 | null>(null);
  const [isPlayingSecretTape, setIsPlayingSecretTape] = useState(false);
  const [isPlayingKeyChime, setIsPlayingKeyChime] = useState(false);
  const [isPlayingDialup, setIsPlayingDialup] = useState(false);
  const [hasUnlocked90sKey, setHasUnlocked90sKey] = useState<boolean>(() => obterStatusChave1994());

  const totalCollected80 = collectedIds.length;
  const totalItems80 = MEMORIAS_1984.length;
  const isDecade80Complete = totalCollected80 >= totalItems80;
  const progressPercent80 = Math.round((totalCollected80 / totalItems80) * 100);

  const collectedIds90 = obterMemorias90Coletadas();
  const totalCollected90 = collectedIds90.length;
  const totalItems90 = MEMORIAS_1994.length;

  // Quando o usuário completa 8/8 dos anos 80, desbloqueia a chave de 1994 automaticamente
  useEffect(() => {
    if (isDecade80Complete && !hasUnlocked90sKey) {
      desbloquearChave1994();
      setHasUnlocked90sKey(true);
      audioEngine.playKey90sUnlock();
    }
  }, [isDecade80Complete, hasUnlocked90sKey]);

  if (!isOpen) return null;

  const handlePlaySecretTape = () => {
    setIsPlayingSecretTape(true);
    audioEngine.playSecretSynthwaveDemo();
    setTimeout(() => {
      setIsPlayingSecretTape(false);
    }, 4500);
  };

  const handlePlayKeySound = () => {
    setIsPlayingKeyChime(true);
    audioEngine.playKey90sUnlock();
    setTimeout(() => {
      setIsPlayingKeyChime(false);
    }, 1500);
  };

  const handlePlayDialup = () => {
    setIsPlayingDialup(true);
    audioEngine.playDialupHandshake();
    setTimeout(() => {
      setIsPlayingDialup(false);
    }, 2000);
  };

  const handleSwitchTo90s = () => {
    if (!isDecade80Complete && !hasUnlocked90sKey) {
      return;
    }
    setActiveTab('1994');
    handlePlayKeySound();
  };

  const handleReset = () => {
    if (window.confirm('Deseja reiniciar a caça aos objetos para encontrá-los novamente pelos artigos?')) {
      reiniciarMemorias();
      reiniciarMemorias90();
      setHasUnlocked90sKey(false);
      setActiveTab('1984');
      if (onResetProgress) onResetProgress();
    }
  };

  const handleExplore90sInArchive = () => {
    if (onFilterDecade) {
      onFilterDecade('1990s');
    }
    onClose();
    // Rolagem suave até o catálogo
    setTimeout(() => {
      document.getElementById('filtro-geral-acervo')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bau-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl sm:rounded-4xl bg-[#14211e] border-2 sm:border-3 border-[#EFAEC4] shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header do Baú com Abas de Décadas */}
        <div className="flex flex-col bg-[#153833] border-b border-[#EFAEC4]/40">
          <div className="flex items-center justify-between px-5 sm:px-8 py-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#E07A9A]" />
              <div>
                <h2
                  id="bau-modal-title"
                  className="text-base sm:text-xl font-black text-white uppercase tracking-tight"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  Baú Temporal de Memórias
                </h2>
                <p className="text-[11px] font-mono text-[#EFAEC4]">
                  Acervo Arqueológico de Mídias • Caça ao Tesouro Cultural
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              aria-label="Fechar baú de memórias"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Abas das Décadas (Zero-Pill: estilo abas segmentadas funcionais) */}
          <div className="flex items-center px-4 sm:px-8 gap-2 border-t border-white/10 bg-black/30">
            <button
              type="button"
              onClick={() => setActiveTab('1984')}
              className={`py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === '1984'
                  ? 'border-[#EFAEC4] text-white bg-white/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>📼 1984 • Fita K7 & CRT</span>
              {isDecade80Complete ? (
                <span className="text-[10px] text-amber-300 font-sans flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>8/8 Selado</span>
                </span>
              ) : (
                <span className="text-[10px] text-[#EFAEC4]">({totalCollected80}/8)</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleSwitchTo90s}
              className={`py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === '1994'
                  ? 'border-amber-400 text-amber-300 bg-amber-400/10'
                  : isDecade80Complete || hasUnlocked90sKey
                  ? 'border-transparent text-amber-300/80 hover:text-amber-200'
                  : 'border-transparent text-slate-500 opacity-60 cursor-not-allowed'
              }`}
              title={
                isDecade80Complete || hasUnlocked90sKey
                  ? 'Destrancado com a Chave de 1994!'
                  : 'Conquiste todos os 8 objetos de 1984 para forjar a Chave de 1994'
              }
            >
              {isDecade80Complete || hasUnlocked90sKey ? (
                <>
                  <Key className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>🗝️ 1994 • Revolução Multimídia</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-sans">
                    NOVO
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Baú de 1994 (Bloqueado)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CONTEÚDO DA DÉCADA DE 1984 */}
        {activeTab === '1984' && (
          <>
            {/* Barra de Progresso e Premiação da Década */}
            <div className="p-4 sm:p-6 bg-black/40 border-b border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-2">
                <span className="text-slate-300 font-bold">
                  Progresso de 1984:{' '}
                  <span className="text-[#E07A9A]">
                    {totalCollected80} de {totalItems80} Fragmentos
                  </span>{' '}
                  ({progressPercent80}%)
                </span>
                {isDecade80Complete ? (
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40">
                    <Award className="w-3.5 h-3.5" />
                    <span>🏆 Baú de 1984 Completo & Selado com Sucesso!</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">
                    Encontre os objetos escondidos nos ensaios do acervo enquanto lê
                  </span>
                )}
              </div>

              {/* Barra Visual */}
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${progressPercent80}%` }}
                />
              </div>

              {/* RECOMPENSA PRINCIPAL: CONQUISTA DA CHAVE DE 1994 (OPÇÃO 6) */}
              {isDecade80Complete && (
                <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1c2c26] via-[#153833] to-[#241b10] border-2 border-amber-400 shadow-2xl space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Ícone da Chave Dourada com brilho pulsante */}
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-[14px] bg-[#1a140b] flex items-center justify-center">
                          <Key className="w-7 h-7 text-amber-300 animate-bounce" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-400 border border-black flex items-center justify-center text-[9px] font-bold text-black">
                          ✓
                        </span>
                      </div>

                      <div className="space-y-0.5 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                            Relíquia Temporal Forjada
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                            • Década Conquistada
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                          Chave Holográfica do Baú de 1994 Conquistada!
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                          Você resgatou todos os 8 objetos do dia de Leo em 1984. O baú analógico dos anos 80 foi selado com distinção e a <strong>Chave dos Anos 90</strong> abriu a nova era: CDs, discman, consoles 16-bit e internet discada!
                        </p>
                      </div>
                    </div>

                    {/* Botões de Ação da Recompensa */}
                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center sm:justify-end">
                      <button
                        type="button"
                        onClick={handleSwitchTo90s}
                        className="px-4 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95"
                      >
                        <Unlock className="w-4 h-4 text-slate-950" />
                        <span>Destrancar Baú de 1994</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePlaySecretTape}
                        disabled={isPlayingSecretTape}
                        className="px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                        title="Ouvir a fita demo de sintetizadores de 1984"
                      >
                        <Disc3 className={`w-3.5 h-3.5 text-amber-300 ${isPlayingSecretTape ? 'animate-spin' : ''}`} />
                        <span>{isPlayingSecretTape ? 'Tocando Fita...' : 'Fita K7 1984'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Grade com os 8 Momentos do Dia de Leo (1984) */}
            <div className="p-4 sm:p-8 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MEMORIAS_1984.map((memoria) => {
                  const isFound = collectedIds.includes(memoria.id);
                  const linkedItem = allItems.find((i) => i.id === memoria.linkedArchiveId);

                  return (
                    <div
                      key={memoria.id}
                      onClick={() => isFound && setSelectedMemoria80(memoria)}
                      className={`relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between ${
                        isFound
                          ? 'bg-white/5 border-[#EFAEC4]/60 hover:border-[#EFAEC4] hover:bg-white/10 cursor-pointer shadow-md'
                          : 'bg-black/30 border-white/10 opacity-70'
                      }`}
                    >
                      {/* Topo do Card */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold text-[#EFAEC4]">
                            {memoria.timeOfDay}
                          </span>
                          {isFound ? (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                              <Check className="w-3 h-3" />
                              <span>Coletado</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                              <Lock className="w-3 h-3" />
                              <span>Oculto</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white line-clamp-1">
                          {isFound ? memoria.hiddenObjectName : `Fragmento #${memoria.order}`}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                          {memoria.sceneLocation}
                        </p>
                      </div>

                      {/* Meio: Miniatura ou Silhueta com Pista */}
                      <div className="my-3 aspect-[4/3] rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center relative">
                        {isFound && linkedItem?.coverUrl ? (
                          <img
                            src={linkedItem.coverUrl}
                            alt={memoria.hiddenObjectName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="p-3 text-center space-y-1">
                            <Lock className="w-5 h-5 text-slate-500 mx-auto opacity-60" />
                            <p className="text-[10px] text-slate-400 leading-tight">
                              {memoria.hiddenObjectHint}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Rodapé do Card */}
                      <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span className="truncate max-w-[120px]">
                          {isFound ? memoria.collectibleBadge : 'Explorar acervo...'}
                        </span>

                        {isFound && (
                          <span className="text-[#EFAEC4] font-bold">Ver detalhes →</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detalhe da Memória de 1984 Selecionada */}
              {selectedMemoria80 && (
                <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-[#153833]/80 border-2 border-[#EFAEC4] shadow-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#EFAEC4]">
                        {selectedMemoria80.timeOfDay}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {selectedMemoria80.hiddenObjectName}
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedMemoria80(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-serif border-l-2 border-[#EFAEC4] pl-3 py-1">
                    "{selectedMemoria80.storyExcerpt}"
                  </blockquote>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-emerald-300">
                    <strong className="text-white block mb-0.5">💡 Curiosidade Histórica:</strong>
                    {selectedMemoria80.historicalFunFact}
                  </div>

                  {/* Botão para saltar para o artigo correspondente */}
                  {(() => {
                    const item = allItems.find((i) => i.id === selectedMemoria80.linkedArchiveId);
                    if (!item) return null;
                    return (
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-2">
                        <span className="text-xs font-mono text-slate-300">
                          Obra associada: <strong>{item.title}</strong> ({item.year})
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenArticle(item);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-[#E07A9A] text-slate-950 hover:bg-[#efaec4] transition-all cursor-pointer flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Abrir Artigo Completo</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </>
        )}

        {/* CONTEÚDO DA DÉCADA DE 1994 (REVOLUÇÃO MULTIMÍDIA) */}
        {activeTab === '1994' && (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header da Década de 90 */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-cyan-950/40 via-black to-indigo-950/40 border-b border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                      🗝️ Baú Destrancado com a Chave de 1994
                    </span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] font-mono text-amber-300">
                      O Diário de Nina & A Revolução Digital
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white uppercase tracking-tight">
                    Os 6 Artefatos Lendários de 1994
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    A era em que as fitas deram lugar aos CDs com proteção anti-shock, os consoles 16-bit ganharam vida nas salas, as locadoras de VHS tinham rebobinadores esportivos e o primeiro chiado do modem discado conectou o mundo à Web.
                  </p>
                </div>

                {/* Botão de Atalho para Explorar Acervo de 90 */}
                <button
                  type="button"
                  onClick={handleExplore90sInArchive}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-400/20 active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explorar Acervo de 1990 no Site →</span>
                </button>
              </div>

              {/* Botões de Efeitos Sonoros dos Anos 90 */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10 flex-wrap">
                <span className="text-[11px] font-mono text-slate-400">
                  Sons Tácteis de Época:
                </span>

                <button
                  type="button"
                  onClick={handlePlayDialup}
                  disabled={isPlayingDialup}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/10 hover:bg-white/20 text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Ouvir o som do handshake do modem 56k"
                >
                  <Radio className={`w-3 h-3 ${isPlayingDialup ? 'animate-pulse' : ''}`} />
                  <span>{isPlayingDialup ? 'Discando...' : 'Modem 56k Dial-up'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlayKeySound}
                  disabled={isPlayingKeyChime}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/10 hover:bg-white/20 text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Ouvir o acorde de boot da Chave de 1994"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Chime de Boot 90s</span>
                </button>
              </div>
            </div>

            {/* Grid dos Itens de 1994 */}
            <div className="p-4 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MEMORIAS_1994.map((memoria) => {
                  const linkedItem = allItems.find((i) => i.id === memoria.linkedArchiveId);

                  return (
                    <div
                      key={memoria.id}
                      onClick={() => setSelectedMemoria90(memoria)}
                      className="group relative rounded-2xl p-4 border bg-white/5 border-cyan-500/30 hover:border-cyan-400 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold text-cyan-400">
                            {memoria.timeOfDay}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {memoria.objectCategoryLabel}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {memoria.hiddenObjectName}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                          {memoria.sceneLocation}
                        </p>
                      </div>

                      {/* Miniatura do Objeto */}
                      <div className="my-3 aspect-[16/9] rounded-xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center relative">
                        {linkedItem?.coverUrl ? (
                          <img
                            src={linkedItem.coverUrl}
                            alt={memoria.hiddenObjectName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="p-3 text-center space-y-1">
                            <Disc3 className="w-6 h-6 text-cyan-400 mx-auto animate-spin" />
                            <p className="text-[10px] text-slate-400">{memoria.hiddenObjectName}</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-[10px] font-mono text-cyan-200 truncate">
                            {memoria.collectibleBadge}
                          </span>
                        </div>
                      </div>

                      {/* Rodapé com Botão */}
                      <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Pista: {memoria.hiddenObjectHint}</span>
                        <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">
                          Ler diário →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detalhe da Memória de 1994 Selecionada */}
              {selectedMemoria90 && (
                <div className="mt-6 p-5 sm:p-6 rounded-3xl bg-cyan-950/60 border-2 border-cyan-400 shadow-2xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {selectedMemoria90.timeOfDay}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {selectedMemoria90.hiddenObjectName}
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedMemoria90(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-slate-200 leading-relaxed italic font-serif border-l-2 border-cyan-400 pl-3 py-1">
                    "{selectedMemoria90.storyExcerpt}"
                  </blockquote>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-500/30 text-xs text-cyan-300">
                    <strong className="text-white block mb-0.5">💡 Curiosidade da Década de 90:</strong>
                    {selectedMemoria90.historicalFunFact}
                  </div>

                  {/* Ação para ver no acervo */}
                  {(() => {
                    const item = allItems.find((i) => i.id === selectedMemoria90.linkedArchiveId);
                    if (!item) return null;
                    return (
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-2">
                        <span className="text-xs font-mono text-slate-300">
                          Relacionado ao artigo: <strong>{item.title}</strong>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenArticle(item);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Ler Ensaio no Acervo</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rodapé com Reiniciar e Fechar */}
        <div className="px-5 sm:px-8 py-3.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Reiniciar a busca de memórias para jogar novamente"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Caça aos Objetos</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer font-bold"
          >
            Fechar Baú
          </button>
        </div>
      </div>
    </div>
  );
};
