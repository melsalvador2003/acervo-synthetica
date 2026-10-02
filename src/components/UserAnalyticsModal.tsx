import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BarChart3,
  TrendingUp,
  Disc3,
  Film,
  Download,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { UserSubscription, UserProfile, ArchiveItem } from '../types';

interface UserAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  items: ArchiveItem[];
  onUpgradeToSync: () => void;
  onShowToast: (msg: string) => void;
}

export const UserAnalyticsModal: React.FC<UserAnalyticsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  items,
  onUpgradeToSync,
  onShowToast,
}) => {
  const [syncServices, setSyncServices] = useState({
    spotify: true,
    mubi: true,
    tidal: false,
    criterion: true,
  });
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const isSyncMember = currentUser?.subscription?.tier === 'sync';

  const handleToggleService = (service: 'spotify' | 'mubi' | 'tidal' | 'criterion') => {
    setSyncServices((prev) => {
      const next = { ...prev, [service]: !prev[service] };
      onShowToast(
        `Plataforma ${service.toUpperCase()} ${
          next[service] ? 'sincronizada' : 'desconectada'
        }.`
      );
      return next;
    });
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onShowToast('📊 Relatório analítico exportado em JSON/PDF com sucesso!');
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#14211e] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#273a36] my-4 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[94vh] flex flex-col focus-visible:outline-none">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#273a36] flex items-center justify-between bg-gradient-to-r from-pink-50/50 via-white to-emerald-50/40 dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#153833] text-[#EFAEC4] flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E07A9A] dark:text-[#EFAEC4]">
                  Exclusivo do Plano Sync
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#153833] text-white">
                  Streaming &amp; Analytics
                </span>
              </div>
              <h2
                id="analytics-modal-title"
                className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                Relatório de Consumo Cultural &amp; Sincronização
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fechar relatório"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {!isSyncMember ? (
            /* Freemium / Indie Gate Preview */
            <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-50/80 via-white to-emerald-50/40 dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724] border-2 border-[#E07A9A] dark:border-[#EFAEC4] text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-[#153833] text-[#EFAEC4] flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3
                  className="text-xl font-black uppercase text-slate-900 dark:text-white"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  Desbloqueie o Plano Sync
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Sincronize automaticamente seus hábitos com <strong>Spotify, MUBI, TIDAL e Criterion</strong>, receba relatórios analíticos de estética pessoal e conte com curadoria ilimitada por IA.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onUpgradeToSync();
                  }}
                  className="px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-[#EFAEC4]" />
                  <span>Migrar para o Plano Sync</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Full Sync Dashboard */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Active Sync Integrations */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] space-y-4">
                <div className="flex items-center justify-between">
                  <h3
                    className="text-sm font-black uppercase text-slate-900 dark:text-white"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    Plataformas de Stream Sincronizadas
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Sincronização Ativa em Tempo Real
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'spotify', label: 'Spotify', sub: 'Música & Álbuns' },
                    { key: 'mubi', label: 'MUBI', sub: 'Cinema Cult' },
                    { key: 'tidal', label: 'TIDAL HiFi', sub: 'Master FLAC' },
                    { key: 'criterion', label: 'Criterion', sub: 'Película 4K' },
                  ].map((s) => {
                    const isConn = syncServices[s.key as keyof typeof syncServices];
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => handleToggleService(s.key as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isConn
                            ? 'bg-white dark:bg-[#182724] border-emerald-500/60 shadow-xs'
                            : 'bg-slate-100 dark:bg-[#14211e] border-slate-200 dark:border-[#273a36] opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {s.label}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isConn ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 block">
                          {s.sub}
                        </span>
                        <span className="text-[10px] font-mono text-[#E07A9A] font-bold block mt-1">
                          {isConn ? 'Conectado' : 'Clique p/ Ativar'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consumption Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Tempo no Toca-Discos & Acervo
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    42h 18min
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 block">
                    +18% em relação ao mês anterior
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Obras e Ensaios Explorados
                  </span>
                  <div className="text-2xl font-black text-[#E07A9A] dark:text-[#EFAEC4]">
                    38 registros
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    100% de leitura completa
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Década Dominante
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    1970s
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    Krautrock, Cinema Novo e Fita Magnética
                  </span>
                </div>
              </div>

              {/* Personalized AI Curator Insight */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#153833]/10 via-white to-pink-50/50 dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724] border border-[#153833]/30 dark:border-[#EFAEC4]/30 space-y-3">
                <div className="flex items-center gap-2 text-[#153833] dark:text-[#EFAEC4]">
                  <Sparkles className="w-4 h-4 text-[#E07A9A]" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Insight Analítico do Curador Synthetica (Gemini 2.5)
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  "Seu padrão de escuta entre as 21h e as 23h aponta uma afinidade forte com sequenciadores analógicos e timbres com reverb de placa EMT 140. Notamos também 14 visualizações completas da câmera de película 35mm. Sugerimos aprofundar na vanguarda fotográfica alemã da década de 70."
                </p>
              </div>

              {/* Export Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#273a36]">
                <span className="text-xs font-mono text-slate-500">
                  Dados compatíveis com formatos abertos de acervos digitais (JSON / PDF)
                </span>
                <button
                  type="button"
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Exportando...' : 'Exportar Relatório'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
