import React, { useState, useEffect, useCallback } from 'react';
import {
  MonthlyWrapped,
  FriendCurator,
  UserProfile,
  ArchiveItem,
  CuratorRecommendation,
  Category,
} from '../types';
import {
  Sparkles,
  Share2,
  Users,
  Compass,
  ArrowRight,
  Award,
  Check,
  X,
  Layers,
  RefreshCw,
  Clock,
  BookOpen,
  Cpu,
  Bookmark,
} from 'lucide-react';
import {
  getOrGenerateWrappedNarrative,
  WrappedNarrativaResponse,
  WrappedInsumoPayload,
} from '../utils/curadorApi';

interface WrappedViewProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  wrappedData: MonthlyWrapped;
  historicalWrappeds: MonthlyWrapped[];
  friends: FriendCurator[];
  items?: ArchiveItem[];
  onOpenArticleById: (id: string) => void;
  onRequireLogin: () => void;
}

export const WrappedView: React.FC<WrappedViewProps> = ({
  isOpen,
  onClose,
  currentUser,
  wrappedData,
  historicalWrappeds,
  friends,
  items = [],
  onOpenArticleById,
  onRequireLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'wrapped' | 'history' | 'friends'>('wrapped');
  const [selectedWrapped, setSelectedWrapped] = useState<MonthlyWrapped>(wrappedData);
  const [copied, setCopied] = useState(false);

  // AI Narrative State (Curador Synthetica - Gemini)
  const [aiData, setAiData] = useState<WrappedNarrativaResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Build the audit payload from user activity and archive items
  const buildInsumo = useCallback(
    (forceRegenerate = false): WrappedInsumoPayload => {
      // Find interacted items
      const readCompletedItems = items.filter((i) => i.hasCompletedRead);
      const likedItems = items.filter((i) => i.isLiked);
      const savedItems = items.filter((i) => i.isFavorite);
      const sharedItems = items.filter((i) => (i.sharesCount || 0) > 0);

      // Section counts
      const secaoCount: Record<string, number> = {};
      const decadeSet = new Set<string>();

      items.forEach((i) => {
        if (i.isLiked || i.hasCompletedRead || i.isFavorite || (i.readsCount || 0) > 0) {
          secaoCount[i.category] = (secaoCount[i.category] || 0) + 1;
          decadeSet.add(i.decade);
        }
      });

      const secaoEntries = Object.entries(secaoCount).sort((a, b) => b[1] - a[1]);
      const secaoPredominante = secaoEntries[0]?.[0] || 'musica';

      // Compute highlights with signals
      const highlights: WrappedInsumoPayload['destaques'] = [];
      const usedIds = new Set<string>();

      // 1. Completed reads (maximum attention signal)
      readCompletedItems.forEach((it, idx) => {
        if (!usedIds.has(it.id)) {
          usedIds.add(it.id);
          highlights.push({
            id: it.id,
            titulo: it.title,
            secao: it.category,
            ano: it.year,
            resumo: it.curatorialNotes,
            sinais: ['leitura completa', 'atenção máxima'],
            posicao: idx + 1,
          });
        }
      });

      // 2. Saved / Liked items
      [...savedItems, ...likedItems, ...sharedItems].forEach((it, idx) => {
        if (!usedIds.has(it.id) && highlights.length < 5) {
          usedIds.add(it.id);
          const sinais: string[] = [];
          if (it.isFavorite) sinais.push('salvou no acervo');
          if (it.isLiked) sinais.push('curtiu');
          if ((it.sharesCount || 0) > 0) sinais.push('compartilhou');
          highlights.push({
            id: it.id,
            titulo: it.title,
            secao: it.category,
            ano: it.year,
            resumo: it.curatorialNotes,
            sinais: sinais.length > 0 ? sinais : ['revisitou'],
            posicao: highlights.length + 1,
          });
        }
      });

      // Fallback highlights if user hasn't interacted much yet
      if (highlights.length === 0 && items.length > 0) {
        items.slice(0, 3).forEach((it, idx) => {
          highlights.push({
            id: it.id,
            titulo: it.title,
            secao: it.category,
            ano: it.year,
            resumo: it.curatorialNotes,
            sinais: ['explorado no acervo'],
            posicao: idx + 1,
          });
        });
      }

      // Available archive sample for recommendations
      const acervoDisponivel = items.slice(0, 10).map((it) => ({
        id: it.id,
        titulo: it.title,
        secao: it.category,
        ano: it.year,
        creator: it.creator,
      }));

      return {
        periodo: { mes: 9, ano: 2047 },
        perfil: {
          decada_predominante: 1970,
          secao_predominante: secaoPredominante,
          decadas_visitadas: Math.max(2, decadeSet.size),
          secoes_visitadas: Math.max(2, Object.keys(secaoCount).length),
        },
        destaques: highlights,
        acervo_disponivel: acervoDisponivel,
        forcar_regeneracao: forceRegenerate,
      };
    },
    [items]
  );

  // Fetch or regenerate AI narrative
  const fetchAiNarrative = useCallback(
    async (forceRegenerate = false) => {
      setLoadingAi(true);
      setAiError(null);
      const userId = currentUser?.id || 'visitante-acervo';
      const insumo = buildInsumo(forceRegenerate);

      try {
        const res = await getOrGenerateWrappedNarrative(userId, insumo);
        setAiData(res);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Falha ao conectar com o Curador';
        setAiError(msg);
      } finally {
        setLoadingAi(false);
      }
    },
    [currentUser?.id, buildInsumo]
  );

  // Trigger fetch when modal opens
  useEffect(() => {
    if (isOpen && !aiData && !loadingAi) {
      fetchAiNarrative(false);
    }
  }, [isOpen, aiData, loadingAi, fetchAiNarrative]);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'danca':
        return '#f472b6';
      case 'musica':
        return '#EFAEC4';
      case 'cinema':
        return '#fbbf24';
      case 'artes-plasticas':
        return '#38bdf8';
      case 'eletronicos':
        return '#2dd4bf';
      default:
        return '#a855f7';
    }
  };

  // Safe fallback stats & affinity scores
  const stats = selectedWrapped.stats || {
    articlesRead: items.filter((i) => (i.readsCount || 0) > 0).length || 14,
    itemsLiked: items.filter((i) => i.isLiked).length || 9,
    topDecade: selectedWrapped.dominantDecade || '1970s',
    totalMinutesSpent: 58,
  };

  const affinityList =
    selectedWrapped.affinityScores ||
    selectedWrapped.categoryPercentages || [
      { category: 'musica' as Category, percentage: 38 },
      { category: 'eletronicos' as Category, percentage: 26 },
      { category: 'danca' as Category, percentage: 16 },
      { category: 'cinema' as Category, percentage: 12 },
      { category: 'artes-plasticas' as Category, percentage: 8 },
    ];

  // AI recommendations or fallback picks
  const currentRecommendations: CuratorRecommendation[] =
    aiData?.recomendacoes && aiData.recomendacoes.length > 0
      ? aiData.recomendacoes
      : selectedWrapped.nextMonthRecommendations?.map((r, idx) => ({
          id: r.linkedArchiveId || `rec-${idx}`,
          titulo: r.title,
          secao: r.category,
          ano: 1975,
          razao: r.reason,
          creator: r.creator,
        })) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-2 sm:my-6 text-slate-900 max-h-[96vh] sm:max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-[#153833] font-black shadow-xs border border-pink-200 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#E07A9A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-base sm:text-xl font-black text-slate-950 uppercase tracking-tight"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  Synthetica Wrapped
                </h2>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold bg-[#153833] text-white tracking-widest uppercase">
                  Curador IA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
                Retrospectiva Cultural do Mês • {selectedWrapped.month || selectedWrapped.monthName || 'Setembro'} {selectedWrapped.year || 2047}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Fechar Retrospectiva (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-3 sm:px-6 bg-slate-50 flex-shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('wrapped')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'wrapped'
                ? 'border-[#E07A9A] text-[#153833]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E07A9A]" />
            <span>Retrospectiva &amp; Curador IA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-[#E07A9A] text-[#153833]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Arquivo Mensal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('friends')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'friends'
                ? 'border-[#E07A9A] text-[#153833]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-slate-400" />
            <span>Curadores &amp; Afinidade</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1 bg-white">
          {/* ================= TAB 1: RETROSPECTIVA MENSAL ================= */}
          {activeTab === 'wrapped' && (
            <div className="space-y-8">
              {/* SEÇÃO 1: O CURADOR SYNTHETICA (IA GEMINI) - A NARRATIVA DO MÊS */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#153833]/5 via-white to-pink-50/50 border-2 border-[#EFAEC4]/70 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pink-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#153833] text-white flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-[#EFAEC4]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#153833] uppercase tracking-wider">
                          O Curador Synthetica
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EFAEC4]/50 text-[#153833] border border-[#EFAEC4]">
                          A Narrativa do Mês (IA)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Síntese em linguagem natural do seu percurso pelo acervo
                      </span>
                    </div>
                  </div>

                  {/* Model Provenance & Refresh Button */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {aiData?.origem || 'Gemini 3.8 Flash'}
                    </span>
                    <button
                      type="button"
                      onClick={() => fetchAiNarrative(true)}
                      disabled={loadingAi}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
                      title="Regenerar leitura com IA após novas leituras ou salvamentos"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin text-[#E07A9A]' : ''}`} />
                      <span>{loadingAi ? 'Sintetizando...' : 'Atualizar com IA'}</span>
                    </button>
                  </div>
                </div>

                {/* Narrative Body */}
                {loadingAi ? (
                  <div className="py-6 space-y-3 animate-pulse">
                    <div className="h-4 bg-pink-100 rounded-md w-3/4" />
                    <div className="h-4 bg-pink-50 rounded-md w-full" />
                    <div className="h-4 bg-pink-100/60 rounded-md w-5/6" />
                    <p className="text-xs font-mono text-[#153833] italic pt-2">
                      O Curador Synthetica está cruzando as décadas em que você passou mais tempo, as seções revisitadas e o registro que prendeu sua atenção...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <blockquote
                      className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium italic p-4 rounded-2xl bg-white/80 border-l-4 border-[#153833] shadow-2xs"
                    >
                      "{aiData?.narrativa || selectedWrapped.personaDescription || 'Seu percurso pelo acervo destacou um fascínio vívido por gravações em fita magnética, arte contemporânea e experimentações dos anos 1970.'}"
                    </blockquote>

                    {/* Audit signal tags (Seção 4: Insumos auditáveis) */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                      <span className="text-slate-500">Insumos auditados:</span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-[#E07A9A] border border-pink-200 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {items.filter((i) => i.hasCompletedRead).length > 0
                          ? `Leitura até o fim: ${items.find((i) => i.hasCompletedRead)?.title.slice(0, 24)}...`
                          : 'Atenção máxima registrada'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-900 border border-pink-200">
                        Década dominante: {selectedWrapped.dominantDecade || '1970s'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-800 border border-pink-200">
                        Seções integradas: Dança, Música, Cinema
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* SEÇÃO 2: TRÊS RECOMENDAÇÕES JUSTIFICADAS PELA IA (Seção 1 e Seção 5 do Documento) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#E07A9A]" />
                      <span>Três Recomendações Justificadas (Curador IA)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sugestões de próximos conteúdos acompanhadas da razão pela qual foram escolhidas
                    </p>
                  </div>
                  <span className="text-xs font-mono text-pink-700 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200 font-bold hidden sm:inline-block">
                    3 Obras Selecionadas
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentRecommendations.slice(0, 3).map((rec, idx) => (
                    <div
                      key={rec.id || idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-pink-300 hover:shadow-md transition-all group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span
                            className="px-2 py-0.5 rounded uppercase font-bold text-slate-950"
                            style={{ backgroundColor: getCategoryColor(rec.secao || rec.categoria || 'musica') }}
                          >
                            {rec.secao || rec.categoria || 'Acervo'}
                          </span>
                          <span className="text-slate-600 font-semibold">{rec.ano}</span>
                        </div>

                        <h5 className="text-sm font-black text-slate-900 leading-snug group-hover:text-[#153833] transition-colors">
                          {rec.titulo}
                        </h5>
                        {rec.creator && (
                          <p className="text-xs text-slate-500 font-medium">
                            {rec.creator}
                          </p>
                        )}

                        <div className="pt-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E07A9A] font-bold block mb-1">
                            Por que foi escolhida:
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            "{rec.razao}"
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenArticleById(rec.id);
                        }}
                        className="mt-4 flex items-center justify-between text-xs font-bold text-[#153833] hover:text-[#E07A9A] cursor-pointer pt-3 border-t border-slate-200 transition-colors"
                      >
                        <span>Ver no Acervo</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Persona Cultural Hero Banner */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-pink-200 overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-pink-700 text-xs font-mono mb-3 border border-pink-200 font-bold">
                    <Award className="w-3.5 h-3.5 text-[#E07A9A]" />
                    <span>Sua Persona Cultural de {selectedWrapped.month || 'Setembro'} {selectedWrapped.year || 2047}</span>
                  </div>

                  <h3
                    className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    "{selectedWrapped.archetypeName || selectedWrapped.personaTitle || 'Arqueólogo Sonoro & Esteta do Movimento'}"
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-medium">
                    {selectedWrapped.archetypeDescription || selectedWrapped.personaDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-200 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block">Artigos &amp; Ensaios:</span>
                      <span className="text-slate-950 font-bold text-sm">
                        {stats.articlesRead} lidos
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Curtidas no Acervo:</span>
                      <span className="text-rose-600 font-bold text-sm">
                        {stats.itemsLiked} itens
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Década Predominante:</span>
                      <span className="text-cyan-700 font-bold text-sm">
                        {stats.topDecade}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tempo Imersivo:</span>
                      <span className="text-amber-700 font-bold text-sm">
                        {stats.totalMinutesSpent} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Share Button Inside Card */}
                <div className="absolute top-6 right-6 z-10 hidden sm:block">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-800 font-bold text-xs border border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95 hover:bg-slate-100"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Compartilhar Wrapped</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Affinity Percentages Chart Bar */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#E07A9A]" />
                  <span>Distribuição de Afinidade Cultural no Mês</span>
                </h4>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
                  {affinityList.map((score) => (
                    <div key={score.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 capitalize">
                          {score.category === 'artes-plasticas'
                            ? 'Artes Plásticas'
                            : score.category}
                        </span>
                        <span className="font-mono text-slate-600 font-bold">{score.percentage}%</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${score.percentage}%`,
                            backgroundColor: getCategoryColor(score.category),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: HISTÓRICO DE WRAPPEDS ================= */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-950">
                  Arquivo de Edições Mensais Passadas
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Navegue pelos ciclos anteriores e observe como seus interesses culturais evoluíram.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[wrappedData, ...historicalWrappeds].map((wrap) => {
                  const isCurrent = wrap.id === selectedWrapped.id;
                  const wrapStats = wrap.stats || { articlesRead: 12, topDecade: '1970s' };
                  return (
                    <div
                      key={wrap.id}
                      onClick={() => {
                        setSelectedWrapped(wrap);
                        setActiveTab('wrapped');
                      }}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-pink-50/70 border-pink-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-[#E07A9A]">
                          {wrap.month || wrap.monthName || 'Setembro'} {wrap.year || 2047}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFAEC4] text-[#153833]">
                            Visualizando
                          </span>
                        )}
                      </div>

                      <h5 className="text-base font-bold text-slate-900">
                        "{wrap.archetypeName || wrap.personaTitle || 'Explorador Cultural'}"
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {wrap.archetypeDescription || wrap.personaDescription}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                        <span>{wrapStats.articlesRead} artigos lidos</span>
                        <span>Década: {wrapStats.topDecade}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 3: AMIGOS & AFINIDADE CULTURAL ================= */}
          {activeTab === 'friends' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#E07A9A]" />
                    <span>Curadores &amp; Amigos Conectados</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Compare afinidades culturais e descubra novas obras recomendadas pelos seus amigos
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center gap-2 cursor-pointer w-fit border border-slate-200"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Convidar Mais Amigos</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
                  >
                    <div>
                      {/* Friend Avatar & Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border-2 border-slate-200"
                        />
                        <div>
                          <h5 className="text-sm font-bold text-slate-900 leading-none">
                            {friend.name}
                          </h5>
                          <span className="text-[11px] font-mono text-[#E07A9A] font-bold">
                            {friend.badge}
                          </span>
                        </div>
                      </div>

                      {/* Affinity meter badge */}
                      <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-between text-xs mb-3">
                        <span className="text-slate-700 font-medium">Afinidade de Gosto:</span>
                        <span className="font-mono font-black text-pink-700">
                          {friend.affinityPercentage}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{friend.recentWrappedTheme}"
                      </p>

                      {/* Favorite item recommendation */}
                      <div className="mt-4 pt-3 border-t border-slate-200 text-xs">
                        <span className="text-[10px] font-mono uppercase text-slate-500 block">
                          Favorito do Mês:
                        </span>
                        <span className="text-slate-900 font-semibold block truncate mt-0.5">
                          {friend.recentFavorites?.[0] || 'Acervo Histórico'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenArticleById(friend.recentFavorites?.[0] || 'syn-mus-01');
                      }}
                      className="mt-4 w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-[#E07A9A] border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Explorar Obra Recomendada</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-600">
            {currentUser ? (
              <span>
                Conectado como <strong className="text-slate-950">{currentUser.name}</strong>
              </span>
            ) : (
              <span className="text-[#E07A9A] font-medium">
                Modo Visitante • Faça login para salvar seu histórico de Wrappeds
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!currentUser && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequireLogin();
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#EFAEC4] text-[#153833] hover:bg-[#e89bb4] transition-colors cursor-pointer shadow-xs"
              >
                Fazer Login / Criar Conta
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer border border-slate-300 shadow-2xs"
            >
              Fechar Wrapped
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
