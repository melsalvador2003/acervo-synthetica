import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type FontSizeLevel = 'normal' | 'large' | 'xlarge';
export type SpeechRate = 0.8 | 1.0 | 1.25;

export interface AccessibilitySettings {
  fontSize: FontSizeLevel;
  highContrast: boolean;
  reducedMotion: boolean;
  readableFont: boolean;
  speechRate: SpeechRate;
  darkMode: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setFontSize: (size: FontSizeLevel) => void;
  setHighContrast: (active: boolean) => void;
  setReducedMotion: (active: boolean) => void;
  setReadableFont: (active: boolean) => void;
  setSpeechRate: (rate: SpeechRate) => void;
  setDarkMode: (active: boolean) => void;
  toggleDarkMode: () => void;
  resetSettings: () => void;
  isOpenPanel: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  announcement: string;
  announce: (message: string) => void;
}

const STORAGE_KEY = 'synthetica_a11y_preferences_v1';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  readableFont: false,
  speechRate: 1.0,
  darkMode: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_SETTINGS, ...parsed, reducedMotion: false };
      }
    } catch {
      // fallback
    }

    // Check system prefers-color-scheme
    const prefersDarkMode =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

    return {
      ...DEFAULT_SETTINGS,
      reducedMotion: false,
      darkMode: Boolean(prefersDarkMode),
    };
  });

  const [isOpenPanel, setIsOpenPanel] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Apply CSS classes to document root
  useEffect(() => {
    const root = document.documentElement;

    // Font size classes
    root.classList.remove('a11y-font-large', 'a11y-font-xlarge');
    if (settings.fontSize === 'large') {
      root.classList.add('a11y-font-large');
    } else if (settings.fontSize === 'xlarge') {
      root.classList.add('a11y-font-xlarge');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('a11y-reduced-motion');
      document.body?.classList.add('a11y-reduced-motion');
    } else {
      root.classList.remove('a11y-reduced-motion');
      document.body?.classList.remove('a11y-reduced-motion');
    }

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
      document.body?.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body?.classList.remove('dark');
      root.removeAttribute('data-theme');
    }

    // Readable font
    if (settings.readableFont) {
      root.classList.add('a11y-readable-font');
    } else {
      root.classList.remove('a11y-readable-font');
    }
  }, [settings]);

  // Listen for OS prefers-reduced-motion and prefers-color-scheme changes if user hasn't manually overridden it
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setSettings((prev) => ({ ...prev, reducedMotion: e.matches }));
      }
    };
    motionMediaQuery.addEventListener?.('change', handleMotionChange);

    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setSettings((prev) => ({ ...prev, darkMode: e.matches }));
      }
    };
    darkMediaQuery.addEventListener?.('change', handleDarkChange);

    return () => {
      motionMediaQuery.removeEventListener?.('change', handleMotionChange);
      darkMediaQuery.removeEventListener?.('change', handleDarkChange);
    };
  }, []);

  // Screen reader announcer
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear after timeout so repeat messages can re-trigger
    setTimeout(() => {
      setAnnouncement('');
    }, 4000);
  }, []);

  // Keyboard shortcut: Alt + A opens/closes accessibility panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsOpenPanel((prev) => {
          const next = !prev;
          announce(next ? 'Painel de acessibilidade aberto.' : 'Painel de acessibilidade fechado.');
          return next;
        });
      }
      if (e.key === 'Escape' && isOpenPanel) {
        setIsOpenPanel(false);
        announce('Painel de acessibilidade fechado.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenPanel, announce]);

  const setFontSize = (size: FontSizeLevel) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
    const labels = {
      normal: 'Tamanho de texto normal restaurado.',
      large: 'Tamanho de texto aumentado para grande (115%).',
      xlarge: 'Tamanho de texto aumentado para extra grande (130%).',
    };
    announce(labels[size]);
  };

  const setHighContrast = (active: boolean) => {
    setSettings((prev) => ({ ...prev, highContrast: active }));
    announce(active ? 'Modo de alto contraste ativado.' : 'Modo de alto contraste desativado.');
  };

  const setReducedMotion = (active: boolean) => {
    setSettings((prev) => ({ ...prev, reducedMotion: active }));
    announce(active ? 'Redução de movimento ativada. Animações e giros pausados.' : 'Animações completas reativadas.');
  };

  const setReadableFont = (active: boolean) => {
    setSettings((prev) => ({ ...prev, readableFont: active }));
    announce(active ? 'Fonte de alta legibilidade ativada com espaçamento ampliado.' : 'Tipografia padrão restaurada.');
  };

  const setSpeechRate = (rate: SpeechRate) => {
    setSettings((prev) => ({ ...prev, speechRate: rate }));
    announce(`Velocidade da audiodescrição ajustada para ${rate}x.`);
  };

  const setDarkMode = (active: boolean) => {
    setSettings((prev) => ({ ...prev, darkMode: active }));
    announce(active ? 'Modo escuro ativado.' : 'Modo claro ativado.');
  };

  const toggleDarkMode = () => {
    setSettings((prev) => {
      const next = !prev.darkMode;
      announce(next ? 'Modo escuro ativado.' : 'Modo claro ativado.');
      return { ...prev, darkMode: next };
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    announce('Todas as configurações de acessibilidade foram redefinidas para o padrão.');
  };

  const openPanel = () => {
    setIsOpenPanel(true);
    announce('Painel de acessibilidade aberto.');
  };

  const closePanel = () => {
    setIsOpenPanel(false);
    announce('Painel de acessibilidade fechado.');
  };

  const togglePanel = () => {
    setIsOpenPanel((prev) => {
      const next = !prev;
      announce(next ? 'Painel de acessibilidade aberto.' : 'Painel de acessibilidade fechado.');
      return next;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        setFontSize,
        setHighContrast,
        setReducedMotion,
        setReadableFont,
        setSpeechRate,
        setDarkMode,
        toggleDarkMode,
        resetSettings,
        isOpenPanel,
        openPanel,
        closePanel,
        togglePanel,
        announcement,
        announce,
      }}
    >
      {children}
      {/* Off-screen live region for screen readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live-announcer"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
