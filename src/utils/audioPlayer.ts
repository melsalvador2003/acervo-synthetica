// Web Audio API synth for warm nostalgic vinyl playback and musical previews
class SyntheticaAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private currentFreqIndex: number = 0;
  private speed: '33' | '45' | '78' = '33';
  private volume: number = 0.8;

  // Vintage musical chord progression frequencies (Hz)
  private melodyNotes: number[][] = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 392.0], // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 246.94, 293.66, 349.23], // G7
  ];

  private initContext() {
    try {
      if (!this.ctx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  // Create subtle vinyl crackle & warm tape hiss
  private startVinylCrackle() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        // Pink/brownish noise with occasional pops
        const white = Math.random() * 2 - 1;
        const pop = Math.random() > 0.998 ? (Math.random() - 0.5) * 0.4 : 0;
        data[i] = white * 0.015 + pop;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter to warm analog frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      const crackleGain = this.ctx.createGain();
      crackleGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(crackleGain);
      if (this.gainNode) {
        crackleGain.connect(this.gainNode);
      }

      noiseSource.start();
      this.noiseNode = noiseSource;
    } catch {
      // fallback
    }
  }

  // Play a warm polyphonic Rhodes / synth chord
  private playChord(chord: number[]) {
    if (!this.ctx || !this.gainNode) return;

    const pitchFactor = this.speed === '78' ? 1.45 : this.speed === '45' ? 1.2 : 1.0;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      try {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * pitchFactor, this.ctx.currentTime);

        // Gentle attack and decay
        noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.05, this.ctx.currentTime + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.3);
      } catch {
        // ignore
      }
    });
  }

  public play(onTick?: (elapsedSec: number) => void) {
    this.initContext();
    this.stop();

    if (!this.ctx) {
      this.isPlaying = true;
      return;
    }

    try {
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      this.startVinylCrackle();
      this.isPlaying = true;

      let elapsed = 0;
      this.playChord(this.melodyNotes[0]);

      const intervalTime = this.speed === '78' ? 600 : this.speed === '45' ? 800 : 1000;

      this.timerId = window.setInterval(() => {
        elapsed += 1;
        if (onTick) onTick(elapsed);

        if (elapsed % 2 === 0) {
          this.currentFreqIndex = (this.currentFreqIndex + 1) % this.melodyNotes.length;
          this.playChord(this.melodyNotes[this.currentFreqIndex]);
        }
      }, intervalTime);
    } catch {
      this.isPlaying = true;
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
      } catch {
        // ignore
      }
      this.noiseNode = null;
    }
  }

  public setSpeed(speed: '33' | '45' | '78') {
    this.speed = speed;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      } catch {
        // ignore
      }
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // --- Efeitos Sonoros Nostálgicos dos Anos 80 (Web Audio API) ---

  /** Toca acorde de chime etéreo/brilhante estilo DX7 dos anos 80 */
  public playDiscoveryChime() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Arpejo ascendente de sonho: E5, G#5, B5, E6
      const freqs = [659.25, 830.61, 987.77, 1318.51];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch {
      // ignore
    }
  }

  /** Efeito de transição de sonho (abrir os olhos para a realidade) */
  public playDreamAwakening() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(146.83, now); // D3

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4, now);
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.7);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch {
      // ignore
    }
  }

  /** Som de ficha caindo no fliperama dos anos 80 */
  public playArcadeCoin() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // ignore
    }
  }

  /** Som mecânico de clique do cabeçote de fita cassete K7 */
  public playTapeClick() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Duplo clique mecânico
      [0, 0.07].forEach((delay) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(delay === 0 ? 320 : 480, now + delay);
        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.04);
      });
    } catch {
      // ignore
    }
  }

  /** Toca o tema exclusivo da "Fita Demo Secreta de 1984" */
  public playSecretSynthwaveDemo() {
    this.initContext();
    if (!this.ctx) return;
    try {
      this.playDiscoveryChime();
      setTimeout(() => {
        this.playChord([220.0, 261.63, 329.63, 440.0]); // Am
      }, 400);
      setTimeout(() => {
        this.playChord([174.61, 220.0, 261.63, 349.23]); // F
      }, 1200);
      setTimeout(() => {
        this.playChord([196.0, 246.94, 293.66, 392.0]); // G
      }, 2000);
      setTimeout(() => {
        this.playChord([261.63, 329.63, 392.0, 523.25]); // C
      }, 2800);
    } catch {
      // ignore
    }
  }

  /** Som exclusivo de desbloqueio da Chave Holográfica dos Anos 90 (Boot de Console 90s + Chime Cristalino) */
  public playKey90sUnlock() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Arpeggio brilhante e triunfante
      const freqs = [329.63, 440.0, 554.37, 659.25, 880.0, 1108.73, 1318.51];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.2);
      });
    } catch {
      // ignore
    }
  }

  /** Som sintetizado do Handshake do Modem Dial-up 56k (Anos 90) */
  public playDialupHandshake() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Tom de discagem inicial
      const dialOsc1 = this.ctx.createOscillator();
      const dialOsc2 = this.ctx.createOscillator();
      const dialGain = this.ctx.createGain();
      dialOsc1.frequency.setValueAtTime(350, now);
      dialOsc2.frequency.setValueAtTime(440, now);
      dialGain.gain.setValueAtTime(0.06, now);
      dialGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      dialOsc1.connect(dialGain);
      dialOsc2.connect(dialGain);
      dialGain.connect(this.ctx.destination);
      dialOsc1.start(now);
      dialOsc2.start(now);
      dialOsc1.stop(now + 0.36);
      dialOsc2.stop(now + 0.36);

      // Bipes e chiados digitais
      [0.4, 0.55, 0.7, 0.85].forEach((delay, idx) => {
        if (!this.ctx) return;
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sawtooth';
        bOsc.frequency.setValueAtTime(idx % 2 === 0 ? 1200 : 1800, now + delay);
        bGain.gain.setValueAtTime(0.04, now + delay);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.08);
        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(now + delay);
        bOsc.stop(now + delay + 0.09);
      });
    } catch {
      // ignore
    }
  }
}

export const audioEngine = new SyntheticaAudioEngine();
