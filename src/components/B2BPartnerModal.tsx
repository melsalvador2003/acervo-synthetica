import React, { useState } from 'react';
import {
  X,
  Building2,
  Disc3,
  Film,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  TrendingUp,
  Send,
  Sliders,
} from 'lucide-react';
import { B2BPartnerCatalog } from '../types';
import { B2B_PARTNER_CATALOGS } from '../data/monetizationData';

interface B2BPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const B2BPartnerModal: React.FC<B2BPartnerModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'proposta' | 'simulador' | 'formulario'>('proposta');
  const [selectedB2BPlan, setSelectedB2BPlan] = useState<'spotlight' | 'retrospectiva' | 'integral'>('retrospectiva');

  // Simulator states
  const [worksCount, setWorksCount] = useState<number>(25);
  const [durationMonths, setDurationMonths] = useState<number>(6);

  // Form states
  const [institutionName, setInstitutionName] = useState('');
  const [institutionType, setInstitutionType] = useState('gravadora');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [catalogDescription, setCatalogDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Simulator math
  const basePricePerWork = 180; // R$ per work per month
  const estimatedReach = worksCount * 2800 * durationMonths;
  const rawMonthlyFee = Math.round(worksCount * basePricePerWork);
  const discountMultiplier = durationMonths >= 12 ? 0.8 : durationMonths >= 6 ? 0.9 : 1.0;
  const finalMonthlyFee = Math.round(rawMonthlyFee * discountMultiplier);
  const totalContract = finalMonthlyFee * durationMonths;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institutionName || !contactEmail) {
      onShowToast('Por favor, preencha o nome da instituição e o e-mail de contato.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast(
        `🏛️ Proposta institucional de "${institutionName}" enviada! Nossa curadoria entrará em contato em até 24h.`
      );
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="b2b-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#14211e] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#273a36] my-4 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[94vh] flex flex-col focus-visible:outline-none">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#273a36] flex items-center justify-between bg-gradient-to-r from-[#153833]/10 via-white to-pink-50/40 dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#153833] text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-[#EFAEC4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E07A9A] dark:text-[#EFAEC4]">
                  Monetização B2B • Parceria Institucional
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#153833] text-white">
                  Gravadoras & Produtoras
                </span>
              </div>
              <h2
                id="b2b-modal-title"
                className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                Synthetica Institucional B2B
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-slate-100 dark:border-[#273a36] flex gap-2">
          {[
            { id: 'proposta', label: '1. Modelo B2B & Planos' },
            { id: 'simulador', label: '2. Simulador de Alcance' },
            { id: 'formulario', label: '3. Enviar Catálogo' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-3 px-3 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === t.id
                  ? 'border-[#153833] text-[#153833] dark:border-[#EFAEC4] dark:text-[#EFAEC4]'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'proposta' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] space-y-3">
                <h3
                  className="text-base font-black uppercase text-slate-900 dark:text-white"
                  style={{ fontFamily: "'Unbounded', sans-serif" }}
                >
                  Por que disponibilizar seu acervo no Synthetica?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  O Synthetica conecta catálogos históricos de gravadoras, produtoras de cinema e cinematecas a um público altamente engajado de pesquisadores, audiófilos, curadores e colecionadores. Mediante uma taxa de custódia e destaque curatorial, as obras da sua instituição ganham:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#182724] border border-slate-200 dark:border-[#273a36] space-y-1">
                    <strong className="text-slate-900 dark:text-white block">
                      Vitrine Nobre na Home
                    </strong>
                    <span className="text-slate-500">
                      Showcase dedicado com branding institucional e selo oficial de patrocínio.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#182724] border border-slate-200 dark:border-[#273a36] space-y-1">
                    <strong className="text-slate-900 dark:text-white block">
                      Ensaio Crítico & IA
                    </strong>
                    <span className="text-slate-500">
                      Contextualização histórica profunda e inclusão no Curador Synthetica.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#182724] border border-slate-200 dark:border-[#273a36] space-y-1">
                    <strong className="text-slate-900 dark:text-white block">
                      Audição & 3D Interativo
                    </strong>
                    <span className="text-slate-500">
                      Digitalização de fitas master para o Toca-Discos e réplicas 3D dos suportes.
                    </span>
                  </div>
                </div>
              </div>

              {/* B2B Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'spotlight',
                    name: 'Catálogo Spotlight',
                    price: 'R$ 4.500',
                    period: '/ mês',
                    features: [
                      'Até 12 obras em destaque na página principal',
                      'Selo oficial de Catálogo Parceiro',
                      'Links diretos para lojas e streams oficiais',
                      'Relatório trimestral de visualizações e audições',
                    ],
                  },
                  {
                    id: 'retrospectiva',
                    name: 'Retrospectiva Histórica',
                    price: 'R$ 8.500',
                    period: '/ mês',
                    badge: 'Recomendado',
                    features: [
                      'Até 35 obras catalogadas com fichas completas',
                      'Destaque no Banner Principal e Seções Temáticas',
                      'Digitalização de áudio para o Toca-Discos Virtual',
                      'Modelagem 3D personalizada do acervo',
                      'Inclusão nas recomendações do Curador IA',
                    ],
                  },
                  {
                    id: 'integral',
                    name: 'Preservação Integral',
                    price: 'R$ 15.000',
                    period: '/ mês',
                    features: [
                      'Obras ilimitadas do selo ou produtora',
                      'Curadoria dedicada com historiador da arte',
                      'Página monográfica exclusiva da instituição',
                      'Evento e audição comentada virtual para membros Sync',
                      'Exportação de metadados em padrão museológico',
                    ],
                  },
                ].map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between ${
                      plan.badge
                        ? 'border-[#153833] bg-pink-50/30 dark:bg-[#182724] shadow-md'
                        : 'border-slate-200 dark:border-[#273a36] bg-white dark:bg-[#101b18]'
                    }`}
                  >
                    <div>
                      {plan.badge && (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EFAEC4] text-[#153833] inline-block mb-2">
                          {plan.badge}
                        </span>
                      )}
                      <h4
                        className="text-sm font-black uppercase text-slate-900 dark:text-white"
                        style={{ fontFamily: "'Unbounded', sans-serif" }}
                      >
                        {plan.name}
                      </h4>
                      <div className="my-3 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          {plan.period}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {plan.features.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedB2BPlan(plan.id as any);
                        setActiveTab('formulario');
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white transition-colors cursor-pointer text-center"
                    >
                      Selecionar este Plano
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'simulador' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] space-y-5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#E07A9A]" />
                  <h3
                    className="text-base font-black uppercase text-slate-900 dark:text-white"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    Simulador de Custódia e Impacto Cultural
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Calcule a estimativa de taxa mensal e alcance qualificado com base no volume de obras do catálogo da sua gravadora ou produtora.
                </p>

                {/* Slider 1: Works count */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Número de Obras no Catálogo</span>
                    <span className="text-base font-black font-mono text-[#E07A9A]">
                      {worksCount} obras
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={worksCount}
                    onChange={(e) => setWorksCount(Number(e.target.value))}
                    className="w-full accent-[#153833] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>5 obras (Compacto)</span>
                    <span>50 obras (Catálogo Médio)</span>
                    <span>100+ obras (Acervo Integral)</span>
                  </div>
                </div>

                {/* Slider 2: Duration */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Duração do Período de Destaque</span>
                    <span className="text-base font-black font-mono text-[#153833] dark:text-[#EFAEC4]">
                      {durationMonths} meses {durationMonths >= 12 ? '(20% OFF)' : durationMonths >= 6 ? '(10% OFF)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    step="3"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="w-full accent-[#153833] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>3 meses</span>
                    <span>6 meses (10% desconto)</span>
                    <span>12+ meses (20% desconto)</span>
                  </div>
                </div>

                {/* Calculation Output Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-[#273a36]">
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#182724] border border-slate-200 dark:border-[#273a36]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Taxa Mensal Estimada
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                      R$ {finalMonthlyFee.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      / mês de custódia
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-[#182724] border border-slate-200 dark:border-[#273a36]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Alcance Qualificado Estimado
                    </span>
                    <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
                      ~{estimatedReach.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      impactos de pesquisadores
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-[#182724] border border-slate-200 dark:border-[#273a36]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Contrato Total ({durationMonths}m)
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                      R$ {totalContract.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-[10px] text-[#E07A9A] font-mono font-bold">
                      Faturamento institucional
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('formulario')}
                    className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                  >
                    <span>Solicitar Proposta Formal com Esta Simulação</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'formulario' && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200 dark:border-[#E07A9A]/30 text-xs text-slate-700 dark:text-slate-300">
                Preencha os dados institucionais da sua gravadora, produtora audiovisual ou museu. Nosso comitê curatorial retornará com minuta de convênio e requisitos técnicos de matrizes.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nome da Instituição / Selo / Produtora *
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Ex: Selo Fita Rara / O2 Audiovisual"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#101b18] border border-slate-200 dark:border-[#273a36] focus:outline-none focus:ring-2 focus:ring-[#153833]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tipo de Instituição *
                  </label>
                  <select
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#101b18] border border-slate-200 dark:border-[#273a36] focus:outline-none focus:ring-2 focus:ring-[#153833]"
                  >
                    <option value="gravadora">Gravadora / Selo Musical</option>
                    <option value="produtora">Produtora Audiovisual / Cinema</option>
                    <option value="cinemateca">Cinemateca / Arquivo Fílmico</option>
                    <option value="instituto">Instituto de Dança / Artes Cênicas</option>
                    <option value="outro">Outra Instituição Cultural</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nome do Responsável / Diretor *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo de Castro"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#101b18] border border-slate-200 dark:border-[#273a36] focus:outline-none focus:ring-2 focus:ring-[#153833]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    E-mail Corporativo Institucional *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="acervo@suainstituicao.com.br"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#101b18] border border-slate-200 dark:border-[#273a36] focus:outline-none focus:ring-2 focus:ring-[#153833]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Breve Resumo do Acervo e Obras Candidatas ao Destaque
                </label>
                <textarea
                  rows={3}
                  value={catalogDescription}
                  onChange={(e) => setCatalogDescription(e.target.value)}
                  placeholder="Ex: Dispomos de 20 matrizes de vinil de 1974 a 1982 em fita magnética de 2 polegadas, incluindo álbuns fundamentais da MPB psicodélica..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-[#101b18] border border-slate-200 dark:border-[#273a36] focus:outline-none focus:ring-2 focus:ring-[#153833]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1e4e47] text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-[#EFAEC4]" />
                      <span>Transmitindo proposta institucional...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#EFAEC4]" />
                      <span>Enviar Proposta de Parceria B2B</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
