import React, { useState, useEffect } from 'react';
import {
  User,
  Accessibility,
  Menu,
  X,
  Info,
  Disc3,
  Moon,
  Sun,
  Sparkles,
  ShoppingBag,
  Building2,
  BarChart3,
  BookOpen,
  FileText,
} from 'lucide-react';
import { Category, UserProfile } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';

interface NavbarProps {
  onSelectCategory: (cat: Category | 'todos') => void;
  onOpenAbout: () => void;
  onOpenAddModal?: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenWrapped?: () => void;
  onOpenA11y?: () => void;
  onOpenSubscription?: () => void;
  onOpenAnalytics?: () => void;
  onOpenB2B?: () => void;
  onOpenBauMemorias?: () => void;
  collectedMemoryCount?: number;
  currentUser: UserProfile | null;
  activeCategory?: Category | 'todos';
}

interface NavItem {
  id: Category;
  label: string;
  sectionId: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'danca', label: 'Dança', sectionId: 'secao-danca' },
  { id: 'musica', label: 'Música', sectionId: 'secao-musica' },
  { id: 'cinema', label: 'Cinema', sectionId: 'secao-cinema' },
  { id: 'artes-plasticas', label: 'Artes Plásticas', sectionId: 'secao-artes-plasticas' },
  { id: 'eletronicos', label: 'Eletrônicos', sectionId: 'secao-eletronicos' },
];

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onOpenAbout,
  onOpenAuth,
  onOpenA11y,
  onOpenSubscription,
  onOpenAnalytics,
  onOpenB2B,
  onOpenBauMemorias,
  collectedMemoryCount = 0,
  currentUser,
  activeCategory = 'todos',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { reducedMotion, darkMode, toggleDarkMode } = useAccessibility();

  // Close mobile drawer when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const handleCategoryClick = (cat: Category, sectionId: string) => {
    onSelectCategory(cat);
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-2.5 sm:top-5 left-0 right-0 z-50 flex items-center justify-center px-2 sm:px-4 pointer-events-none">
        {/* Floating Capsule Bar - Always signature pink */}
        <div
          id="navbar-floating-capsule"
          style={{ backgroundColor: 'rgba(239, 174, 196, 0.96)' }}
          className="pointer-events-auto relative w-full max-w-[860px] min-h-[50px] sm:min-h-[56px] backdrop-blur-md border border-white/70 shadow-lg shadow-pink-950/15 rounded-full px-3 sm:px-5 py-1.5 flex items-center justify-between transition-all"
        >
          
          {/* Mobile Hamburguer Toggle Button (Left on small screens) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 text-[#153833] hover:bg-white/45 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#153833] focus-visible:outline-none border border-white/40"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Logo / Brand Indicator on Mobile */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => {
                onSelectCategory('todos');
                window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
              }}
              className="text-xs font-black tracking-wider uppercase text-[#153833] px-2.5 py-1 rounded-full hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#153833]" />
              <span>SYNTHETICA</span>
            </button>
          </div>

          {/* Desktop Navigation Links (Centered, Crisp & Clickable) */}
          <nav
            aria-label="Navegação principal do acervo"
            className="hidden md:flex items-center gap-1 lg:gap-2 mx-auto"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id, item.sectionId)}
                  className={`text-xs lg:text-[14px] font-semibold transition-all cursor-pointer whitespace-nowrap active:scale-95 px-3 py-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-[#153833] focus-visible:outline-none ${
                    isActive
                      ? 'bg-[#153833] text-white shadow-xs'
                      : 'text-[#153833] hover:text-black hover:bg-white/30'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Quem Somos Link */}
            <button
              onClick={onOpenAbout}
              className="text-xs lg:text-[14px] font-semibold text-[#153833] hover:text-black hover:bg-white/30 transition-all cursor-pointer whitespace-nowrap active:scale-95 px-3 py-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-[#153833] focus-visible:outline-none flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
              <span>Quem somos</span>
            </button>
          </nav>

          {/* Right Action Icons (Subscription, Dark Mode, Accessibility & User Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botão Baú de Memórias dos Anos 80 */}
            {onOpenBauMemorias && (
              <button
                type="button"
                onClick={onOpenBauMemorias}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#153833] text-white hover:bg-[#1e4e47] active:scale-95 transition-all cursor-pointer shadow-xs border border-white/40 focus-visible:ring-2 focus-visible:ring-[#153833] focus-visible:outline-none"
                title="Abrir Meu Baú de Memórias dos Anos 80 (Diário de Leo)"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#EFAEC4]" />
                <span className="hidden sm:inline">Baú 1984</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#E07A9A] text-slate-950 text-[10px] font-mono font-black">
                  {collectedMemoryCount}/8
                </span>
              </button>
            )}

            {/* Subscription Button */}
            {onOpenSubscription && (
              <button
                type="button"
                onClick={onOpenSubscription}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#153833] text-white hover:bg-[#1e4e47] active:scale-95 transition-all cursor-pointer shadow-xs border border-white/40 focus-visible:ring-2 focus-visible:ring-[#153833] focus-visible:outline-none"
                title="Conhecer planos de assinatura e apoio ao acervo"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EFAEC4]" />
                <span>
                  {currentUser?.subscription?.tier === 'sync'
                    ? 'Plano Sync'
                    : currentUser?.subscription?.tier === 'indie'
                    ? 'Plano Indie'
                    : 'Assinatura'}
                </span>
              </button>
            )}

            {/* Quick Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/25 hover:bg-white/40 text-[#153833] flex items-center justify-center active:scale-95 transition-all cursor-pointer border border-white/40 focus-visible:ring-2 focus-visible:ring-[#153833] focus-visible:outline-none"
              title={darkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              aria-label={darkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-[#153833]" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-[#153833]" aria-hidden="true" />
              )}
            </button>

            {/* User Account / Login Button */}
            <button
              onClick={() => onOpenAuth('login')}
              className="relative w-8 h-8 sm:w-9 sm:h-9 bg-[#153833] text-white rounded-full flex items-center justify-center hover:bg-[#1e4e47] active:scale-95 transition-all cursor-pointer shadow-md shrink-0 border border-white/40 focus-visible:ring-2 focus-visible:ring-[#153833] focus-visible:outline-none"
              title={currentUser ? `Logado como ${currentUser.displayName || currentUser.name}` : 'Login no acervo'}
              aria-label={currentUser ? `Perfil de ${currentUser.displayName || currentUser.name}` : 'Acessar conta'}
            >
              <User className="w-4 h-4 text-white" aria-hidden="true" />
              {currentUser && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#153833]"
                  title="Conectado"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Drawer Capsule Content */}
          <div className="absolute top-18 left-3 right-3 bg-white dark:bg-[#14211e] border-2 border-slate-200 dark:border-white/10 shadow-2xl rounded-3xl p-4 overflow-hidden z-50 text-slate-900 dark:text-slate-100 animate-in slide-in-from-top-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10 mb-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-[#EFAEC4]">
                Navegação do Acervo
              </span>
              <button
                onClick={() => {
                  onSelectCategory('todos');
                  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-[#153833] dark:text-[#EFAEC4] hover:underline"
              >
                Ver Todo o Acervo
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleCategoryClick(item.id, item.sectionId)}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#153833] dark:bg-[#E07A9A] text-white dark:text-[#0c2521] font-bold shadow-xs'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 active:bg-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs opacity-60 font-mono">Ir para seção &rarr;</span>
                  </button>
                );
              })}

              <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />

              {/* Baú de Memórias dos Anos 80 (Mobile) */}
              {onOpenBauMemorias && (
                <button
                  onClick={() => {
                    onOpenBauMemorias();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#E07A9A]/15 text-[#153833] dark:text-[#EFAEC4] hover:bg-[#E07A9A]/25 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#E07A9A]" />
                    <span>Baú de Memórias (1984)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#153833] text-white">
                    {collectedMemoryCount}/8
                  </span>
                </button>
              )}

              {/* Subscription Plans */}
              {onOpenSubscription && (
                <button
                  onClick={() => {
                    onOpenSubscription();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#153833]/10 dark:bg-[#EFAEC4]/10 text-[#153833] dark:text-[#EFAEC4] hover:bg-[#153833]/15 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#E07A9A]" />
                    <span>Planos de Assinatura</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#153833] text-white">
                    {currentUser?.subscription?.tier || 'Freemium'}
                  </span>
                </button>
              )}

              {/* Loja & Artefatos */}
              <button
                onClick={() => {
                  scrollToSection('secao-loja-cultural');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
              >
                <ShoppingBag className="w-4 h-4 text-[#E07A9A]" />
                <span>Loja do Acervo (Parceria E-commerce)</span>
              </button>

              {/* Catálogos B2B */}
              <button
                onClick={() => {
                  if (onOpenB2B) {
                    onOpenB2B();
                  } else {
                    scrollToSection('secao-parceiros-b2b');
                  }
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
              >
                <Building2 className="w-4 h-4 text-[#153833] dark:text-[#EFAEC4]" />
                <span>Gravadoras & Produtoras (B2B)</span>
              </button>

              {/* Relatório de Consumo (Sync) */}
              {onOpenAnalytics && (
                <button
                  onClick={() => {
                    onOpenAnalytics();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Relatório de Consumo Cultural &amp; Streams</span>
                </button>
              )}

              {/* Toca-discos shortcut in mobile menu */}
              <button
                onClick={() => {
                  scrollToSection('secao-vinil');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
              >
                <Disc3 className="w-4 h-4 text-[#E07A9A]" />
                <span>Toca-Discos & Áudio</span>
              </button>

              {/* Quem somos */}
              <button
                onClick={() => {
                  onOpenAbout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
              >
                <Info className="w-4 h-4 text-[#153833] dark:text-[#EFAEC4]" />
                <span>Quem somos (Manifesto)</span>
              </button>

              {/* Dark Mode in mobile menu */}
              <button
                onClick={() => {
                  toggleDarkMode();
                }}
                className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#153833] dark:text-[#EFAEC4]" />}
                  <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#EFAEC4] font-bold uppercase">
                  {darkMode ? 'Ativo' : 'Inativo'}
                </span>
              </button>

              {/* Acessibilidade */}
              {onOpenA11y && (
                <button
                  onClick={() => {
                    onOpenA11y();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#153833] dark:text-[#EFAEC4] bg-[#EFAEC4]/25 dark:bg-[#EFAEC4]/15 hover:bg-[#EFAEC4]/40 transition-all cursor-pointer text-left"
                >
                  <Accessibility className="w-4 h-4 text-[#153833] dark:text-[#EFAEC4]" />
                  <span>Acessibilidade (Alt + A)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
