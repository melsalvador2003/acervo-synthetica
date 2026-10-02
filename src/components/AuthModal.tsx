import React, { useState, useEffect } from 'react';
import { X, Sparkles, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccessLogin: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccessLogin,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['musica', 'cinema']);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loggedUser: UserProfile = {
      id: 'usr-current',
      name: name.trim() || (mode === 'login' ? 'Sofia Valente' : 'Novo Curador'),
      email: email.trim() || 'usuario@acervodigital.art',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      bio: 'Curador independente apaixonado pela preservação de mídias e vanguarda analógica.',
      joinedDate: 'Setembro 2026',
      favoriteCategories: (selectedInterests as any) || ['musica', 'cinema', 'eletronicos'],
      wrappedHistoryIds: ['wrapped-2026-09', 'wrapped-2026-08'],
    };

    onSuccessLogin(loggedUser);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Entrar no Acervo' : 'Criar Sua Conta'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full h-full sm:h-auto sm:max-h-[92vh] max-w-4xl bg-white dark:bg-[#14211e] sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto sm:overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col my-0 sm:my-6">
        
        {/* Sticky Mobile/Desktop Top Header Bar with Prominent Close Button */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#14211e]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between sm:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Acervo</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
            aria-label="Fechar modal de login"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Fixed Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="hidden sm:flex absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer z-30 shadow-xs"
          title="Fechar (Esc)"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Reflected Layout Container */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 flex-1 transition-all duration-300 ${
            mode === 'register' ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* ================= FORM PANEL ================= */}
          <div
            className={`p-6 sm:p-10 flex flex-col justify-between bg-white dark:bg-[#14211e] z-20 ${
              mode === 'register' ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-pink-50 dark:bg-[#EFAEC4]/15 text-pink-700 dark:text-[#EFAEC4] border border-pink-200 dark:border-[#EFAEC4]/30">
                  {mode === 'login' ? 'Acesso ao Acervo' : 'Inscrição de Curador'}
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight uppercase"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                {mode === 'login' ? 'Entrar no Acervo' : 'Criar Sua Conta'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 mt-1.5 leading-relaxed">
                {mode === 'login'
                  ? 'Desbloqueie seu Wrapped Mensal, anote comentários e sincronize sua curadoria pessoal.'
                  : 'Junte-se à comunidade para receber indicações personalizadas todo início de mês.'}
              </p>

              {/* Form Elements */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-300 mb-1">
                      Nome de Exibição
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Beatriz Lima"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2FD19E]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2FD19E]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono uppercase text-slate-600 dark:text-slate-300">
                      Senha
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => alert('Para redefinir, utilize o e-mail cadastrado na próxima versão.')}
                        className="text-[11px] text-[#E07A9A] dark:text-[#EFAEC4] hover:underline"
                      >
                        Esqueceu a senha?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2FD19E]"
                  />
                </div>

                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-300 mb-1">
                        Confirmar Senha
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2FD19E]"
                      />
                    </div>

                    {/* Initial Interests Selection */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                        Segmentos de Maior Interesse:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'danca', label: 'Dança' },
                          { id: 'musica', label: 'Música' },
                          { id: 'cinema', label: 'Cinema' },
                          { id: 'artes-plasticas', label: 'Artes' },
                          { id: 'eletronicos', label: 'Eletrônicos' },
                        ].map((interest) => (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => toggleInterest(interest.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                              selectedInterests.includes(interest.id)
                                ? 'bg-[#EFAEC4] text-[#153833] border-[#EFAEC4] font-bold'
                                : 'bg-slate-50 dark:bg-black/20 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100'
                            }`}
                          >
                            {interest.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#EFAEC4] hover:bg-[#e89bb4] text-[#153833] font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-2 active:scale-95"
                >
                  {mode === 'login' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Entrar &amp; Acessar Wrapped</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Criar Conta &amp; Iniciar Curadoria</span>
                    </>
                  )}
                </button>
              </form>

              {/* Alternative Sign In */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 text-center space-y-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continuar com Google</span>
                </button>

                {/* Explicit Exit / Cancel button for Mobile & Desktop */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancelar e Sair</span>
                </button>
              </div>
            </div>

            {/* Mode Switcher Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login' ? (
                <p>
                  Ainda não tem conta no acervo?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-[#E07A9A] dark:text-[#EFAEC4] font-bold hover:underline cursor-pointer"
                  >
                    Criar conta agora
                  </button>
                </p>
              ) : (
                <p>
                  Já possui cadastro?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[#E07A9A] dark:text-[#EFAEC4] font-bold hover:underline cursor-pointer"
                  >
                    Fazer login
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* ================= HIGHLIGHT / RETROSPECTIVA PANEL ================= */}
          <div
            className={`hidden lg:flex p-8 sm:p-10 flex-col justify-between bg-slate-50 dark:bg-black/40 border-l border-slate-200 dark:border-white/10 relative overflow-hidden ${
              mode === 'register' ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
            }`}
          >
            {/* Visual background accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/20 dark:bg-[#EFAEC4]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/20 dark:bg-[#2FD19E]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-pink-100 dark:bg-[#EFAEC4]/20 text-[#E07A9A] dark:text-[#EFAEC4] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Benefício Exclusivo • Wrapped Mensal</span>
              </div>

              <h3
                className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase leading-tight tracking-tight"
                style={{ fontFamily: "'Unbounded', sans-serif" }}
              >
                Sua retrospectiva cultural está pronta
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                A cada 30 dias, o Acervo Digital calcula seu mapa de afinidade: os discos, filmes,
                danças e aparelhos que você mais explorou, gerando um dossiê e recomendações para o mês
                seguinte.
              </p>

              {/* Mini Wrapped Card Mockup */}
              <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-[#14211e] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
                  <span>SETEMBRO 2026</span>
                  <span className="text-[#E07A9A] dark:text-[#EFAEC4]">ED. ATUAL</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Persona:</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    "Arqueólogo de Frequências Sintéticas"
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/10 text-[11px]">
                  <div>
                    <span className="text-slate-400">Tempo ouvindo:</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">14h 22m</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Principal Era:</span>
                    <p className="font-bold text-[#E07A9A] dark:text-[#EFAEC4]">1980s Aurora</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 text-[11px] text-slate-500 dark:text-slate-400">
              Preservação sem fins lucrativos • Curadoria Comunitária Synthetica
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
