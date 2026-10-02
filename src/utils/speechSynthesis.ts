/**
 * Utilitário de Audiodescrição e Síntese de Voz (Text-to-Speech)
 * Suporta leitura em voz alta acessível de fichas curatoriais e registros do acervo
 */

export interface SpeechOptions {
  rate?: number; // 0.8, 1, 1.2, etc.
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onPause?: () => void;
  onResume?: () => void;
}

class SpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isAvailable: boolean = typeof window !== 'undefined' && 'speechSynthesis' in window;

  public isSupported(): boolean {
    return this.isAvailable;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isAvailable) return [];
    return window.speechSynthesis.getVoices();
  }

  public getPortugueseVoice(): SpeechSynthesisVoice | null {
    if (!this.isAvailable) return null;
    const voices = this.getVoices();
    // Prioritize pt-BR voices
    const ptBrVoice = voices.find((v) => v.lang === 'pt-BR' || v.lang === 'pt_BR');
    if (ptBrVoice) return ptBrVoice;
    // Fallback to any Portuguese voice
    const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
    return ptVoice || null;
  }

  public speak(text: string, options: SpeechOptions = {}): boolean {
    if (!this.isAvailable || !text.trim()) return false;

    // Stop any ongoing speech first
    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;

      const voice = this.getPortugueseVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        // 'interrupted' or 'canceled' are not fatal errors
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          options.onError?.(e);
        }
        this.currentUtterance = null;
      };

      utterance.onpause = () => {
        options.onPause?.();
      };

      utterance.onresume = () => {
        options.onResume?.();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Falha na síntese de voz:', e);
      options.onError?.(e);
      return false;
    }
  }

  public pause(): void {
    if (this.isAvailable && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (this.isAvailable && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    if (this.isAvailable) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (!this.isAvailable) return false;
    return window.speechSynthesis.speaking && !window.speechSynthesis.paused;
  }

  public isPaused(): boolean {
    if (!this.isAvailable) return false;
    return window.speechSynthesis.paused;
  }
}

export const speechService = new SpeechService();
