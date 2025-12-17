
class AudioService {
  private volume: number = 0.5;

  setVolume(vol: number) {
    this.volume = vol;
  }

  playTick() {
    this.playTone(440, 0.05, 'sine', 0, 0.1);
  }

  playReveal() {
    this.playTone(880, 0.2, 'triangle', 0, 0.2);
  }

  playSuccess() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.playTone(523.25, 0.1, 'sine', 0, 0.2, ctx);
    this.playTone(659.25, 0.1, 'sine', 0.1, 0.2, ctx);
    this.playTone(783.99, 0.3, 'sine', 0.2, 0.2, ctx);
  }

  playUpgrade() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    for (let i = 0; i < 5; i++) {
      this.playTone(440 + (i * 110), 0.1, 'sine', i * 0.05, 0.15, ctx);
    }
  }

  playSacrifice() {
    this.playTone(110, 0.5, 'sawtooth', 0, 0.3);
  }

  playFusion() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.playTone(220, 1.0, 'square', 0, 0.1, ctx);
    // Sweep effect
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.0);
    gain.gain.setValueAtTime(this.volume * 0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.0);
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', delay: number = 0, gainMult: number = 0.2, existingCtx?: AudioContext) {
    try {
      const ctx = existingCtx || new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(this.volume * gainMult, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      // Audio might be blocked by browser policy until interaction
    }
  }
}

export const audio = new AudioService();
