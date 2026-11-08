/**
 * Pure Web Audio API synthesized festive sound generator.
 * No external MP3 files required — 100% reliable, zero network latency,
 * and immune to cross-origin or missing asset errors.
 */

class FestiveAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private listeners: Array<(muted: boolean) => void> = [];

  constructor() {
    // Check localStorage for muted preference
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('diwali_audio_muted');
        if (saved !== null) {
          this.isMuted = saved === 'true';
        }
      } catch {
        // ignore
      }
    }
  }

  public subscribe(cb: (muted: boolean) => void): () => void {
    this.listeners.push(cb);
    cb(this.isMuted);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('diwali_audio_muted', String(this.isMuted));
    } catch {
      // ignore
    }
    this.listeners.forEach((cb) => cb(this.isMuted));
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('diwali_audio_muted', String(this.isMuted));
    } catch {
      // ignore
    }
    this.listeners.forEach((cb) => cb(this.isMuted));
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Sound 1: Sacred Temple Bell Chime
   * Metallic resonant overtone bells with long gentle decay.
   */
  public playBellSound(frequency: number = 587.33) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const harmonics = [1, 2.01, 3.02, 4.2, 5.4];
    const gains = [0.25, 0.15, 0.1, 0.05, 0.03];

    harmonics.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(frequency * ratio, now);

      gain.gain.setValueAtTime(gains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  /**
   * Sound 2: Diya Lighting Chime
   * Delicate warm rising arpeggio (sacred blessing feel).
   */
  public playDiyaLightSound() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + index * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.85);
    });
  }

  /**
   * Sound 3: Sparkler Crackle
   * High-frequency noise bursts with shimmering crackle.
   */
  public playSparklerSound() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackle bursts with sporadic density
      const isBurst = Math.random() < 0.25;
      data[i] = isBurst ? (Math.random() * 2 - 1) * Math.random() : (Math.random() * 2 - 1) * 0.05;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3500, ctx.currentTime);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  /**
   * Sound 4: Fireworks Launch & Burst
   * Rocket whistle + resonant boom + sparkling tails.
   */
  public playFireworkSound() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Whistling rocket ascent
    const whistle = ctx.createOscillator();
    const whistleGain = ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(320, now);
    whistle.frequency.exponentialRampToValueAtTime(1100, now + 0.22);

    whistleGain.gain.setValueAtTime(0.08, now);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    whistle.connect(whistleGain);
    whistleGain.connect(ctx.destination);
    whistle.start(now);
    whistle.stop(now + 0.25);

    // 2. Deep resonant explosion boom
    const boomTime = now + 0.22;
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(140, boomTime);
    boomOsc.frequency.exponentialRampToValueAtTime(38, boomTime + 0.55);

    boomGain.gain.setValueAtTime(0.4, boomTime);
    boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.7);

    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(boomTime);
    boomOsc.stop(boomTime + 0.75);

    // 3. Crackling sparkle tails
    const bufferSize = Math.floor(ctx.sampleRate * 0.7);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.2));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, boomTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28, boomTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.7);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(boomTime);
  }
}

export const festiveAudio = new FestiveAudioEngine();
