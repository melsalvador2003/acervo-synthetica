import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Disc3,
  Layers,
  Zap,
} from 'lucide-react';
import {
  SubscriptionTier,
  BillingCycle,
  UserSubscription,
} from '../types';
import { SUBSCRIPTION_PLANS } from '../data/monetizationData';

interface SubscriptionSectionProps {
  currentSubscription?: UserSubscription;
  onOpenSubscriptionModal: (tier?: SubscriptionTier) => void;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  currentSubscription,
  onOpenSubscriptionModal,
}) => {
  const [cycle, setCycle] = useState<BillingCycle>('annual');
  const currentTier = currentSubscription?.tier || 'freemium';

  return (
    <section
      id="secao-assinaturas"
      className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0b1211] border-t border-b border-slate-200 dark:border-[#223632] transition-colors"
      aria-label="Planos de Assinatura e Membresia Synthetica"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-[#273a36]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E07A9A]" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#E07A9A] dark:text-[#EFAEC4] uppercase">
                Sustentabilidade Cultural & Modelo Recorrente
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              Escolha seu Nível de Imersão
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Do acesso livre à linha do tempo até a sincronização contínua com serviços de streaming e inteligência artificial curatorial. Cada plano financia diretamente a conservação digital de matrizes históricas.
            </p>
          </div>

          {/* Cycle Toggle Pill */}
          <div className="inline-flex items-center p-1.5 bg-white dark:bg-[#14211e] rounded-2xl border border-slate-200 dark:border-[#273a36] shadow-sm self-start md:self-auto">
            <button
              type="button"
              onClick={() => setCycle('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cycle === 'monthly'
                  ? 'bg-[#153833] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setCycle('annual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                cycle === 'annual'
                  ? 'bg-[#153833] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Anual</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#EFAEC4] text-[#153833] px-2 py-0.5 rounded-full">
                -20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* 3 Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentTier === plan.tier;
            const isHighlighted = plan.highlighted;
            const priceToDisplay =
              cycle === 'annual'
                ? plan.annualMonthlyEquivalent
                : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-white dark:bg-[#14211e] border-2 border-[#E07A9A] dark:border-[#EFAEC4] shadow-2xl scale-[1.02] z-10'
                    : 'bg-white/80 dark:bg-[#101b18] border border-slate-200 dark:border-[#223632] shadow-md hover:shadow-lg'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      isHighlighted
                        ? 'bg-[#EFAEC4] text-[#153833]'
                        : 'bg-slate-100 dark:bg-[#1f302b] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {plan.badge}
                  </span>

                  {isCurrent && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                      Seu Plano Atual
                    </span>
                  )}
                </div>

                {/* Plan Headings */}
                <div>
                  <h3
                    className="text-2xl font-black uppercase text-slate-900 dark:text-white"
                    style={{ fontFamily: "'Unbounded', sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 min-h-[44px] leading-relaxed">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="my-6 pb-6 border-b border-slate-100 dark:border-[#273a36]">
                    {plan.monthlyPrice === 0 ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black text-slate-900 dark:text-white">
                          R$ 0
                        </span>
                        <span className="text-xs font-mono text-slate-500">
                          / gratuito para sempre
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-mono text-slate-500">
                            R$
                          </span>
                          <span className="text-4xl font-black text-slate-900 dark:text-white">
                            {priceToDisplay.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            / mês
                          </span>
                        </div>
                        {cycle === 'annual' && (
                          <span className="text-[11px] font-mono font-bold text-[#E07A9A] dark:text-[#EFAEC4] block mt-1">
                            Faturado anualmente por R${' '}
                            {plan.annualTotalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Benefit Items */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-snug"
                      >
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenSubscriptionModal(plan.tier)}
                    className={`w-full py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-slate-200 dark:bg-[#223632] text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                        : isHighlighted
                        ? 'bg-[#153833] hover:bg-[#1d4d46] text-white shadow-emerald-950/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                    }`}
                  >
                    <span>{isCurrent ? 'Gerenciar Assinatura' : plan.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Indicators */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#273a36] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E07A9A]" />
            <span>Preservação cultural transparente · CNPJ Institucional auditado</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Pix Instantâneo</span>
            <span>·</span>
            <span>Cartão de Crédito</span>
            <span>·</span>
            <span>Cancelamento em 1 clique</span>
          </div>
        </div>
      </div>
    </section>
  );
};
