// Audio Effects Engine supporting physical paper sounds and custom background music (/audio.mp3, /audio2.mp3)

type MusicStateListener = (isPlaying: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgAudio: HTMLAudioElement | null = null;
  private currentSrc: string = '/audio.mp3';
  private isMusicActive: boolean = false;
  private listeners: Set<MusicStateListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initBackgroundAudio();
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initBackgroundAudio(src: string = '/audio.mp3') {
    if (typeof window === 'undefined') return;

    if (!this.bgAudio) {
      this.currentSrc = src;
      this.bgAudio = new Audio(src);
      this.bgAudio.loop = true;
      this.bgAudio.preload = 'auto';
      this.bgAudio.volume = 0.6;

      this.bgAudio.addEventListener('play', () => {
        this.isMusicActive = true;
        this.notifyListeners(true);
      });

      this.bgAudio.addEventListener('pause', () => {
        this.isMusicActive = false;
        this.notifyListeners(false);
      });

      this.bgAudio.addEventListener('ended', () => {
        this.isMusicActive = false;
        this.notifyListeners(false);
      });

      // Fallback gracefully to default /audio.mp3 if custom /audio2.mp3 is not yet uploaded
      this.bgAudio.addEventListener('error', () => {
        if (this.currentSrc !== '/audio.mp3' && this.bgAudio) {
          console.log('Custom audio source not found, gracefully falling back to /audio.mp3');
          this.currentSrc = '/audio.mp3';
          this.bgAudio.src = '/audio.mp3';
          this.bgAudio.play().catch(() => {});
        }
      });
    } else if (src && this.currentSrc !== src) {
      this.currentSrc = src;
      const wasPlaying = !this.bgAudio.paused;
      this.bgAudio.src = src;
      if (wasPlaying) {
        this.bgAudio.play().catch(() => {});
      }
    }
  }

  public subscribe(listener: MusicStateListener) {
    this.listeners.add(listener);
    listener(this.isMusicActive);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(isPlaying: boolean) {
    this.listeners.forEach((listener) => listener(isPlaying));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgAudio) {
      this.bgAudio.muted = muted;
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public isMusicPlaying(): boolean {
    return this.isMusicActive;
  }

  // Starts playing background music (accepts optional custom song source)
  public playBackgroundMusic(src?: string) {
    const targetSrc = src || this.currentSrc || '/audio.mp3';
    this.initBackgroundAudio(targetSrc);
    if (!this.bgAudio) return;

    this.bgAudio.muted = this.isMuted;
    this.bgAudio.volume = 0.6;
    const playPromise = this.bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isMusicActive = true;
          this.notifyListeners(true);
        })
        .catch((err) => {
          console.warn('Audio playback waiting for interaction or error:', err);
        });
    }
  }

  // Softens volume during final signature / emotional stillness
  public softenVolume() {
    if (!this.bgAudio) return;
    let vol = this.bgAudio.volume;
    const fadeInterval = setInterval(() => {
      if (this.bgAudio && vol > 0.35) {
        vol = Math.max(0.35, vol - 0.05);
        this.bgAudio.volume = vol;
      } else {
        clearInterval(fadeInterval);
      }
    }, 400);
  }

  public pauseBackgroundMusic() {
    if (this.bgAudio && !this.bgAudio.paused) {
      this.bgAudio.pause();
    }
  }

  public stopBackgroundMusic() {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
      this.bgAudio.volume = 0.6;
      this.isMusicActive = false;
      this.notifyListeners(false);
    }
  }

  public toggleBackgroundMusic(): boolean {
    if (!this.bgAudio) {
      this.initBackgroundAudio();
    }
    if (!this.bgAudio) return false;

    if (this.bgAudio.paused) {
      this.playBackgroundMusic();
      return true;
    } else {
      this.pauseBackgroundMusic();
      return false;
    }
  }

  // Realistic paper rustle/slide sound
  public playPaperRustle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.1;
        b2 = 0.85 * b2 + white * 0.2;
        const decay = Math.sin((i / bufferSize) * Math.PI);
        output[i] = (b0 + b1 + b2) * 0.15 * decay;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.4);
      filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.44);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  }

  // Wax seal release / crackle
  public playWaxSealBreak() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);

      setTimeout(() => this.playPaperRustle(), 40);
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  }
}

export const soundEffects = new SoundEngine();
