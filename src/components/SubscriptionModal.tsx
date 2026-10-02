import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Disc3,
  CreditCard,
  QrCode,
  ArrowRight,
  TrendingUp,
  Headphones,
  Film,
  Compass,
} from 'lucide-react';
import {
  SubscriptionTier,
  BillingCycle,
  UserSubscription,
  SubscriptionPlan,
} from '../types';
import { SUBSCRIPTION_PLANS } from '../data/monetizationData';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription?: UserSubscription;
  onSelectPlan: (tier: SubscriptionTier, cycle: BillingCycle) => void;
  onShowToast: (msg: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  onSelectPlan,
  onShowToast,
}) => {
  const [cycle, setCycle] = useState<BillingCycle>(
    currentSubscription?.cycle || 'annual'
  );
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(
    currentSubscription?.tier || 'indie'
  );
  const [paymentStep, setPaymentStep] = useState<'plans' | 'checkout'>('plans');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  if (!isOpen) return null;

  const currentTier = currentSubscription?.tier || 'freemium';
  const targetPlan =
    SUBSCRIPTION_PLANS.find((p) => p.tier === selectedTier) ||
    SUBSCRIPTION_PLANS[1];

  const handleStartCheckout = (tier: SubscriptionTier) => {
    if (tier === 'freemium') {
      onSelectPlan('freemium', cycle);
      onShowToast('Seu plano atual foi ajustado para o Plano Freemium.');
      onClose();
      return;
    }
    setSelectedTier(tier);
    setPaymentStep('checkout');
  };

  const handleConfirmSubscription = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSelectPlan(selectedTier, cycle);
      onShowToast(
        `🎉 Assinatura do ${targetPlan.name} (${
          cycle === 'annual' ? 'Anual' : 'Mensal'
        }) ativada com sucesso!`
      );
      setPaymentStep('plans');
      onClose();
    }, 1200);
  };

  const finalPrice =
    cycle === 'annual'
      ? couponApplied
        ? (targetPlan.annualTotalPrice * 0.9).toFixed(2)
        : targetPlan.annualTotalPrice.toFixed(2)
      : couponApplied
      ? (targetPlan.monthlyPrice * 0.9).toFixed(2)
      : targetPlan.monthlyPrice.toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#14211e] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#273a36] my-4 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[94vh] flex flex-col focus-visible:outline-none">
        {/* Top Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#273a36] flex items-center justify-between bg-gradient-to-r from-pink-50/50 via-white to-emerald-50/30 dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#153833] text-[#EFAEC4] flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E07A9A] dark:text-[#EFAEC4]">
                  Modelo de Apoio & Assinatura Recorrente
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-[#EFAEC4] border border-pink-200 dark:border-[#E07A9A]/30">
                  Transparência Cultural
                </span>
              </div>
              <h2
                id="subscription-modal-title"
                className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                Planos Synthetica
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Fechar janela de planos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {paymentStep === 'plans' ? (
            <>
              {/* Introduction & Billing Cycle Switch */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#273a36]">
                <div className="max-w-xl">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Sua assinatura financia a digitalização de fitas master, a conservação de obras raras e o desenvolvimento de inteligência curatorial para as artes. Escolha o nível de imersão ideal para você.
                  </p>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-[#182724] rounded-2xl border border-slate-200 dark:border-[#273a36] self-start md:self-auto shadow-inner">
                  <button
                    type="button"
                    onClick={() => setCycle('monthly')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      cycle === 'monthly'
                        ? 'bg-white dark:bg-[#153833] text-slate-900 dark:text-white shadow-xs'
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

              {/* 3 Pricing Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                      className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                        isHighlighted
                          ? 'bg-gradient-to-b from-white via-pink-50/30 to-white dark:from-[#182724] dark:via-[#14211e] dark:to-[#182724] border-2 border-[#E07A9A] dark:border-[#EFAEC4] shadow-xl'
                          : 'bg-slate-50/70 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] shadow-sm'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            isHighlighted
                              ? 'bg-[#EFAEC4] text-[#153833] dark:bg-[#EFAEC4] dark:text-[#153833]'
                              : 'bg-slate-200 dark:bg-[#223632] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {plan.badge}
                        </span>

                        {isCurrent && (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                            Plano Atual
                          </span>
                        )}
                      </div>

                      {/* Plan Title & Tagline */}
                      <div>
                        <h3
                          className="text-xl font-black uppercase text-slate-900 dark:text-white"
                          style={{ fontFamily: "'Unbounded', sans-serif" }}
                        >
                          {plan.name}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed min-h-[36px]">
                          {plan.tagline}
                        </p>

                        {/* Price Block */}
                        <div className="my-5 pb-4 border-b border-slate-200 dark:border-[#273a36]">
                          {plan.monthlyPrice === 0 ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                Gratuito
                              </span>
                              <span className="text-xs font-mono text-slate-500">
                                / permanente
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xs font-mono text-slate-500">
                                  R$
                                </span>
                                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                  {priceToDisplay.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="text-xs font-mono text-slate-500">
                                  / mês
                                </span>
                              </div>
                              {cycle === 'annual' && (
                                <p className="text-[11px] font-mono text-[#E07A9A] dark:text-[#EFAEC4] mt-1 font-semibold">
                                  Cobrado anualmente: R$ {plan.annualTotalPrice.toFixed(2).replace('.', ',')} (economize 2 meses)
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Features List */}
                        <div className="space-y-2.5 mb-6">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            O que está incluído:
                          </span>
                          {plan.features.map((feat, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-snug"
                            >
                              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Action Button */}
                      <div>
                        {isCurrent ? (
                          <button
                            disabled
                            className="w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-[#182724] text-slate-500 dark:text-slate-400 cursor-not-allowed text-center"
                          >
                            Seu Plano Ativo
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartCheckout(plan.tier)}
                            className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                              isHighlighted
                                ? 'bg-[#153833] hover:bg-[#1d4d46] text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                            }`}
                          >
                            <span>{plan.ctaLabel}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cultural Trust & Transparency Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#E07A9A] shrink-0" />
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white block font-bold">
                      Garantia de Preservação e Cancelamento Flexível
                    </strong>
                    Cancele a qualquer momento com 1 clique. 100% dos recursos são auditados e destinados à custódia, pesquisa e digitalização pública.
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 shrink-0">
                  <span>Pix Instantâneo</span>
                  <span>·</span>
                  <span>Cartão até 12x</span>
                  <span>·</span>
                  <span>Recibo Cultural</span>
                </div>
              </div>
            </>
          ) : (
            /* Checkout Step */
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => setPaymentStep('plans')}
                className="text-xs font-mono font-bold text-[#E07A9A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                &larr; Voltar para comparação de planos
              </button>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0f1917] border border-slate-200 dark:border-[#273a36] space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#273a36]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Resumo da Adesão
                    </span>
                    <h3
                      className="text-lg font-black uppercase text-slate-900 dark:text-white"
                      style={{ fontFamily: "'Unbounded', sans-serif" }}
                    >
                      {targetPlan.name} • Ciclo {cycle === 'annual' ? 'Anual' : 'Mensal'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      R$ {finalPrice.replace('.', ',')}
                    </span>
                    <span className="text-xs font-mono text-slate-500 block">
                      {cycle === 'annual' ? 'cobrado por ano' : 'cobrado por mês'}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Forma de Pagamento:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'border-[#153833] bg-pink-50/50 dark:bg-[#153833]/30 font-bold'
                          : 'border-slate-200 dark:border-[#273a36] bg-white dark:bg-[#14211e]'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-[#E07A9A]" />
                      <div>
                        <span className="text-xs block text-slate-900 dark:text-white font-bold">
                          Pix Instantâneo
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Liberação imediata
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-[#153833] bg-pink-50/50 dark:bg-[#153833]/30 font-bold'
                          : 'border-slate-200 dark:border-[#273a36] bg-white dark:bg-[#14211e]'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#E07A9A]" />
                      <div>
                        <span className="text-xs block text-slate-900 dark:text-white font-bold">
                          Cartão de Crédito
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Cobrança recorrente
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-500 block mb-1">
                    Cupom de Incentivo Cultural (Ex: MEMORIA10)
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO DO CUPOM"
                      className="flex-1 px-3 py-2 rounded-xl text-xs font-mono bg-white dark:bg-[#14211e] border border-slate-200 dark:border-[#273a36] focus:outline-none focus:ring-2 focus:ring-[#153833]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (couponCode.trim()) {
                          setCouponApplied(true);
                          onShowToast('Cupom MEMORIA10 aplicado: 10% de desconto adicional!');
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-[#223632] hover:bg-slate-300 text-slate-800 dark:text-slate-100 transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                {/* Confirm Subscription Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleConfirmSubscription}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider bg-[#153833] hover:bg-[#1d4d46] text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-[#EFAEC4]" />
                        <span>Confirmando transação segura...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-[#EFAEC4]" />
                        <span>
                          Confirmar Assinatura • R$ {finalPrice.replace('.', ',')}
                        </span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Transação simulada no ambiente de demonstração Synthetica. Seu plano será atualizado imediatamente no perfil.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
