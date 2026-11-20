/**
 * 生日蛋糕沉浸式 Web Audio 音频引擎：
 * 1. 未吹灭前：多音色优雅循环演奏《生日快乐歌》（3/4 拍完整旋律 + 和弦伴奏 + 立体声混响）
 *    支持三种风格：八音盒 (musicbox) / 温馨钢琴 (piano) / 梦幻风铃 (chimes)
 * 2. 吹灭瞬间与庆祝阶段：丰富层次感庆祝音效合集
 *    - 吹灭烛火气流噗声 + 烛芯滋滋微响
 *    - 左右立体声礼花筒爆裂声 (Party Poppers)
 *    - 欢庆铜管/钟琴号角 + 竖琴滑音 (Celebration Fanfare)
 *    - 温暖人群鼓掌与欢呼声场 (Applause & Cheer Swells)
 *    - 派对小喇叭嘟嘟声 (Party Horn)
 *    - 多发烟花升空啸叫 + 低音礼炮炸裂 + 立体声星火噼啪 (Fireworks)
 * 3. 重新点亮时：火柴微擦与点亮温暖呼声
 */

export type MusicStyle = 'musicbox' | 'piano' | 'chimes';

interface NoteEvent {
  /** 节拍起始位置（以 3/4 拍的四分音符为单位） */
  beat: number;
  /** MIDI 音高（主旋律） */
  melody?: number;
  /** 旋律时长（拍） */
  dur?: number;
  /** 旋律力度 0..1 */
  vel?: number;
  /** 左手/和弦伴奏 MIDI 音高列表 */
  chord?: number[];
  /** 低音 MIDI */
  bass?: number;
  /** 是否有延音渐慢 (fermata) */
  ritard?: boolean;
}

/**
 * F 大调经典 3/4 拍《Happy Birthday to You》完整编曲
 * 共 28 拍（含结尾呼吸停顿），循环播放自然流畅
 */
const HAPPY_BIRTHDAY_SCORE: NoteEvent[] = [
  // Pick-up: Hap-py
  { beat: 0.0, melody: 60, dur: 0.72, vel: 0.78 }, // C4
  { beat: 0.75, melody: 60, dur: 0.25, vel: 0.72 }, // C4

  // Bar 1 (F): Birth-day to
  { beat: 1.0, melody: 62, dur: 0.95, vel: 0.92, bass: 53, chord: [57, 60] }, // D4 | F
  { beat: 2.0, melody: 60, dur: 0.95, vel: 0.86, chord: [57, 60, 65] }, // C4
  { beat: 3.0, melody: 65, dur: 0.95, vel: 0.95, chord: [57, 60] }, // F4

  // Bar 2 (C7): you~
  { beat: 4.0, melody: 64, dur: 1.9, vel: 0.88, bass: 48, chord: [55, 58, 60] }, // E4 | C7
  { beat: 5.0, chord: [55, 58, 60] },
  // Pick-up: Hap-py
  { beat: 6.0, melody: 60, dur: 0.72, vel: 0.78 }, // C4
  { beat: 6.75, melody: 60, dur: 0.25, vel: 0.72 }, // C4

  // Bar 3 (C7): Birth-day to
  { beat: 7.0, melody: 62, dur: 0.95, vel: 0.92, bass: 48, chord: [55, 58, 60] }, // D4 | C7
  { beat: 8.0, melody: 60, dur: 0.95, vel: 0.86, chord: [55, 58] }, // C4
  { beat: 9.0, melody: 67, dur: 0.95, vel: 0.96, chord: [55, 58, 60] }, // G4

  // Bar 4 (F): you~
  { beat: 10.0, melody: 65, dur: 1.9, vel: 0.9, bass: 53, chord: [57, 60] }, // F4 | F
  { beat: 11.0, chord: [57, 60, 65] },
  // Pick-up: Hap-py
  { beat: 12.0, melody: 60, dur: 0.72, vel: 0.82 }, // C4
  { beat: 12.75, melody: 60, dur: 0.25, vel: 0.78 }, // C4

  // Bar 5 (F -> F7): Birth-day dear
  { beat: 13.0, melody: 72, dur: 1.0, vel: 1.0, bass: 53, chord: [57, 60, 65] }, // C5 | F
  { beat: 14.0, melody: 69, dur: 0.95, vel: 0.92, chord: [57, 60, 65] }, // A4
  { beat: 15.0, melody: 65, dur: 0.95, vel: 0.9, chord: [57, 60, 63] }, // F4 | F7

  // Bar 6 (Bb): [Name]~ (expressive warm hold)
  { beat: 16.0, melody: 64, dur: 1.05, vel: 0.88, bass: 46, chord: [53, 58, 62] }, // E4
  { beat: 17.0, melody: 62, dur: 1.55, vel: 0.85, chord: [53, 58, 62], ritard: true }, // D4 (fermata)

  // Pick-up: Hap-py
  { beat: 18.85, melody: 70, dur: 0.72, vel: 0.9 }, // Bb4
  { beat: 19.6, melody: 70, dur: 0.28, vel: 0.84 }, // Bb4

  // Bar 7 (F / C7): Birth-day to
  { beat: 20.0, melody: 69, dur: 0.95, vel: 0.95, bass: 53, chord: [57, 60, 65] }, // A4 | F/C
  { beat: 21.0, melody: 65, dur: 0.95, vel: 0.9, bass: 48, chord: [55, 58, 60] }, // F4 | C7
  { beat: 22.0, melody: 67, dur: 0.95, vel: 0.92, chord: [55, 58, 60] }, // G4

  // Bar 8 (F): you! (resolved warm arpeggio)
  { beat: 23.0, melody: 65, dur: 2.8, vel: 0.96, bass: 41, chord: [53, 57, 60, 65] }, // F4 | F
  { beat: 24.5, chord: [57, 60, 65, 69] }, // sparkle shimmer
];

const SCORE_TOTAL_BEATS = 27.6;

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;

  private isPlayingMusic = false;
  private musicEnabled = true;
  private sfxEnabled = true;
  private style: MusicStyle = 'musicbox';
  private volume = 0.72;
  private isDucked = false;

  private schedulerTimer: number | null = null;
  private nextEventIndex = 0;
  private loopStartTime = 0;
  private celebrationTimers: number[] = [];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      const ctx = new AudioCtx();
      this.ctx = ctx;

      const master = ctx.createGain();
      master.gain.value = this.volume;

      // 温和动态压缩器，避免和弦与礼花叠加削波失真
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 18;
      compressor.ratio.value = 4;
      compressor.attack.value = 0.005;
      compressor.release.value = 0.18;

      master.connect(compressor);
      compressor.connect(ctx.destination);
      this.masterGain = master;

      const musicGain = ctx.createGain();
      musicGain.gain.value = this.musicEnabled ? 0.55 : 0;
      musicGain.connect(master);
      this.musicGain = musicGain;

      const sfxGain = ctx.createGain();
      sfxGain.gain.value = this.sfxEnabled ? 0.85 : 0;
      sfxGain.connect(master);
      this.sfxGain = sfxGain;

      // 生成柔和空间脉冲响应 (Warm Hall Reverb)
      this.reverbNode = this.createWarmReverb(ctx, 2.2, 2.6);
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.34;
      this.reverbNode.connect(reverbGain);
      reverbGain.connect(master);
      this.reverbGain = reverbGain;

      // 预生成 3 秒立体声白噪声缓冲区供各种音效复用
      this.noiseBuffer = this.createNoiseBuffer(ctx, 3.0);
    }

    return this.ctx;
  }

  private createWarmReverb(ctx: AudioContext, duration: number, decay: number): ConvolverNode {
    const length = Math.floor(ctx.sampleRate * duration);
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      let prev = 0;
      for (let i = 0; i < length; i++) {
        const t = i / length;
        const env = Math.pow(1 - t, decay);
        const raw = (Math.random() * 2 - 1) * env;
        // 低通平滑让混响更温暖、不刺耳
        prev = prev * 0.72 + raw * 0.28;
        data[i] = prev;
      }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  private createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buf;
  }

  public async unlock(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    return ctx.state === 'running';
  }

  public isUnlocked(): boolean {
    return this.ctx?.state === 'running';
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      const target = enabled ? (this.isDucked ? 0.24 : 0.55) : 0.0001;
      this.musicGain.gain.setTargetAtTime(target, now, 0.08);
    }
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    if (this.ctx && this.sfxGain) {
      const now = this.ctx.currentTime;
      this.sfxGain.gain.cancelScheduledValues(now);
      this.sfxGain.gain.setTargetAtTime(enabled ? 0.85 : 0.0001, now, 0.05);
    }
  }

  public setMusicStyle(style: MusicStyle): void {
    this.style = style;
  }

  public setDucked(ducked: boolean): void {
    this.isDucked = ducked;
    if (!this.ctx || !this.musicGain || !this.musicEnabled) return;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setTargetAtTime(ducked ? 0.22 : 0.55, now, 0.12);
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  private getBeatDurationSec(): number {
    // 八音盒略舒缓温馨，钢琴优雅华尔兹，风铃梦幻空灵
    if (this.style === 'musicbox') return 0.52;
    if (this.style === 'piano') return 0.49;
    return 0.56;
  }

  /** 启动《生日快乐歌》循环播放 */
  public async startBirthdaySong(): Promise<boolean> {
    const unlocked = await this.unlock();
    if (!unlocked || !this.ctx) return false;

    if (this.isPlayingMusic) return true;
    this.isPlayingMusic = true;
    this.nextEventIndex = 0;
    this.loopStartTime = this.ctx.currentTime + 0.12;

    if (this.musicGain && this.musicEnabled) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(Math.max(0.001, this.musicGain.gain.value), now);
      this.musicGain.gain.linearRampToValueAtTime(this.isDucked ? 0.22 : 0.55, now + 0.35);
    }

    const scheduleAheadTime = 0.25;
    const tick = () => {
      if (!this.isPlayingMusic || !this.ctx) return;
      if (this.ctx.state !== 'running') return;

      const beatSec = this.getBeatDurationSec();
      const now = this.ctx.currentTime;

      while (true) {
        const ev = HAPPY_BIRTHDAY_SCORE[this.nextEventIndex];
        const eventTime = this.loopStartTime + ev.beat * beatSec;

        if (eventTime > now + scheduleAheadTime) break;

        if (this.musicEnabled && eventTime >= now - 0.05) {
          this.triggerScoreEvent(ev, Math.max(now + 0.01, eventTime), beatSec);
        }

        this.nextEventIndex++;
        if (this.nextEventIndex >= HAPPY_BIRTHDAY_SCORE.length) {
          this.nextEventIndex = 0;
          this.loopStartTime += SCORE_TOTAL_BEATS * beatSec;
        }
      }
    };

    tick();
    this.schedulerTimer = window.setInterval(tick, 80);
    return true;
  }

  /** 停止《生日快乐歌》 */
  public stopBirthdaySong(fadeSec = 0.3): void {
    this.isPlayingMusic = false;
    if (this.schedulerTimer !== null) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
    }
  }

  private triggerScoreEvent(ev: NoteEvent, time: number, beatSec: number): void {
    if (!this.ctx || !this.musicGain) return;
    const style = this.style;

    if (ev.bass !== undefined) {
      const bassMidi = style === 'musicbox' ? ev.bass + 12 : ev.bass;
      this.playInstrumentNote(bassMidi, time, beatSec * 2.1, 0.36, style, -0.18);
    }

    if (ev.chord) {
      ev.chord.forEach((midi, idx) => {
        const arpDelay = style === 'chimes' ? idx * 0.045 : idx * 0.018;
        const chordMidi = style === 'musicbox' ? midi + 12 : midi;
        const pan = (idx - (ev.chord!.length - 1) / 2) * 0.22;
        this.playInstrumentNote(chordMidi, time + arpDelay, beatSec * 1.45, 0.24, style, pan);
      });
    }

    if (ev.melody !== undefined) {
      const melodyMidi = style === 'musicbox' ? ev.melody + 12 : ev.melody;
      const dur = (ev.dur ?? 1) * beatSec * (ev.ritard ? 1.25 : 1.0);
      this.playInstrumentNote(melodyMidi, time, dur, (ev.vel ?? 0.85) * 0.58, style, 0.06);
    }
  }

  private playInstrumentNote(
    midi: number,
    time: number,
    duration: number,
    velocity: number,
    style: MusicStyle,
    pan = 0
  ): void {
    if (!this.ctx || !this.musicGain) return;
    const ctx = this.ctx;
    const freq = midiToFreq(midi);

    const out = ctx.createGain();
    out.gain.value = 1;

    let dest: AudioNode = this.musicGain;
    if (typeof ctx.createStereoPanner === 'function') {
      const panner = ctx.createStereoPanner();
      panner.pan.value = Math.max(-0.8, Math.min(0.8, pan));
      panner.connect(this.musicGain);
      dest = panner;
    }
    out.connect(dest);
    if (this.reverbNode) {
      const send = ctx.createGain();
      send.gain.value = style === 'chimes' ? 0.55 : style === 'musicbox' ? 0.42 : 0.3;
      out.connect(send);
      send.connect(this.reverbNode);
    }

    if (style === 'musicbox') {
      // 八音盒：清脆基频 + 高次金属泛音 + 极短音梳拨动瞬态
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const env1 = ctx.createGain();
      const env2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, time);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2.998, time); // 轻微失谐金属感

      const release = Math.max(duration + 0.55, 0.9);
      env1.gain.setValueAtTime(0.0001, time);
      env1.gain.linearRampToValueAtTime(velocity, time + 0.006);
      env1.gain.exponentialRampToValueAtTime(0.0001, time + release);

      env2.gain.setValueAtTime(0.0001, time);
      env2.gain.linearRampToValueAtTime(velocity * 0.22, time + 0.003);
      env2.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);

      osc1.connect(env1).connect(out);
      osc2.connect(env2).connect(out);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + release + 0.05);
      osc2.stop(time + 0.26);
    } else if (style === 'piano') {
      // 温馨毛毡钢琴：温暖三角波 + 柔化锯齿波低通滤波
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, time);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, time);
      osc2.detune.value = 3;

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(Math.min(3600, freq * 5), time);
      filter.frequency.exponentialRampToValueAtTime(Math.max(480, freq * 1.8), time + duration + 0.4);

      const g2 = ctx.createGain();
      g2.gain.value = 0.24;

      const release = Math.max(duration + 0.45, 0.75);
      env.gain.setValueAtTime(0.0001, time);
      env.gain.linearRampToValueAtTime(velocity * 0.95, time + 0.014);
      env.gain.exponentialRampToValueAtTime(velocity * 0.35, time + Math.min(0.25, duration * 0.6));
      env.gain.exponentialRampToValueAtTime(0.0001, time + release);

      osc1.connect(filter);
      osc2.connect(g2).connect(filter);
      filter.connect(env).connect(out);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + release + 0.05);
      osc2.stop(time + release + 0.05);
    } else {
      // 梦幻风铃 / 电钢：柔美双正弦微失谐 + 泛音闪烁
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const env = ctx.createGain();
      const bellEnv = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, time);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq, time);
      osc2.detune.value = 7;

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 4, time);

      const release = Math.max(duration + 0.95, 1.35);
      env.gain.setValueAtTime(0.0001, time);
      env.gain.linearRampToValueAtTime(velocity * 0.75, time + 0.025);
      env.gain.exponentialRampToValueAtTime(0.0001, time + release);

      bellEnv.gain.setValueAtTime(0.0001, time);
      bellEnv.gain.linearRampToValueAtTime(velocity * 0.14, time + 0.008);
      bellEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);

      osc1.connect(env);
      osc2.connect(env);
      env.connect(out);
      osc3.connect(bellEnv).connect(out);

      osc1.start(time);
      osc2.start(time);
      osc3.start(time);
      osc1.stop(time + release + 0.05);
      osc2.stop(time + release + 0.05);
      osc3.stop(time + 0.45);
    }
  }

  /**
   * 吹灭蜡烛后的全方位庆祝音效交响！
   * 包含：熄灭气流嘶声 -> 立体声礼花爆裂 -> 欢庆号角&竖琴 -> 鼓掌欢呼 -> 派对喇叭 -> 烟花群爆
   */
  public async playCelebrationSuite(): Promise<void> {
    this.stopBirthdaySong(0.18);
    this.clearCelebrationTimers();

    if (!this.sfxEnabled) return;
    const unlocked = await this.unlock();
    if (!unlocked || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    // 1. 蜡烛吹灭气流噗声 & 烛芯轻烟嘶响
    this.playCandleExtinguishSfx(now);

    // 2. 左右立体声礼花筒爆破
    this.playPartyPopper(now + 0.14, -0.55);
    this.playPartyPopper(now + 0.3, 0.55);
    this.playPartyPopper(now + 0.52, 0.0);

    // 3. 欢庆华丽号角 + 闪耀竖琴琶音
    this.playCelebrationFanfare(now + 0.22);

    // 4. 温暖人群鼓掌与欢呼声场
    this.playCrowdApplauseAndCheer(now + 0.36, 4.4);

    // 5. 俏皮派对小喇叭嘟声
    this.playPartyHorn(now + 0.95, 587.33, 0.45, -0.35);
    this.playPartyHorn(now + 1.48, 783.99, 0.55, 0.35);

    // 6. 多波次烟花升空与炸裂音效（配合 Fireworks 动画节奏）
    const fireworkSchedule = [
      { delayMs: 550, pan: -0.5, pitch: 1.0 },
      { delayMs: 1150, pan: 0.45, pitch: 1.15 },
      { delayMs: 1750, pan: -0.2, pitch: 0.92 },
      { delayMs: 2400, pan: 0.6, pitch: 1.08 },
      { delayMs: 3100, pan: -0.6, pitch: 0.96 },
      { delayMs: 3850, pan: 0.15, pitch: 1.2 },
    ];

    fireworkSchedule.forEach((fw) => {
      const id = window.setTimeout(() => {
        if (!this.ctx || !this.sfxEnabled) return;
        this.playFireworkBurst(this.ctx.currentTime, fw.pan, fw.pitch);
      }, fw.delayMs);
      this.celebrationTimers.push(id);
    });
  }

  /** 额外手动触发一波礼花欢呼（庆祝界面互动按钮） */
  public async playExtraCheerBurst(): Promise<void> {
    if (!this.sfxEnabled) return;
    const unlocked = await this.unlock();
    if (!unlocked || !this.ctx) return;

    const now = this.ctx.currentTime;
    this.playPartyPopper(now, -0.45);
    this.playPartyPopper(now + 0.14, 0.45);
    this.playSparkleGlissando(now + 0.05);
    this.playPartyHorn(now + 0.2, 698.46, 0.42, 0.25);
    this.playFireworkBurst(now + 0.35, -0.3, 1.1);
  }

  /** 重新点亮蜡烛的柔和火苗点亮音效 */
  public async playRelightSfx(): Promise<void> {
    this.clearCelebrationTimers();
    if (!this.sfxEnabled) return;
    const unlocked = await this.unlock();
    if (!unlocked || !this.ctx || !this.sfxGain || !this.noiseBuffer) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 温暖的点火呼声
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1900, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.36);
    filter.Q.value = 1.6;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.32, now + 0.05);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    src.connect(filter).connect(env).connect(this.sfxGain);
    src.start(now);
    src.stop(now + 0.42);

    // 清脆魔法点亮双音
    [72, 77].forEach((midi, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(midiToFreq(midi), now + 0.06 + i * 0.08);
      g.gain.setValueAtTime(0.001, now + 0.06 + i * 0.08);
      g.gain.linearRampToValueAtTime(0.18, now + 0.075 + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.55 + i * 0.08);
      osc.connect(g).connect(this.sfxGain!);
      osc.start(now + 0.06 + i * 0.08);
      osc.stop(now + 0.6 + i * 0.08);
    });
  }

  public clearCelebrationTimers(): void {
    this.celebrationTimers.forEach((id) => clearTimeout(id));
    this.celebrationTimers = [];
  }

  private playCandleExtinguishSfx(time: number): void {
    if (!this.ctx || !this.sfxGain || !this.noiseBuffer) return;
    const ctx = this.ctx;

    // 柔和吹熄气流声 + 烛芯微嘶
    const puff = ctx.createBufferSource();
    puff.buffer = this.noiseBuffer;

    const lp = ctx.createBiquadFilter();
    lp.type = 'bandpass';
    lp.frequency.setValueAtTime(1400, time);
    lp.frequency.exponentialRampToValueAtTime(260, time + 0.32);
    lp.Q.value = 0.9;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, time);
    env.gain.linearRampToValueAtTime(0.55, time + 0.03);
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.38);

    puff.connect(lp).connect(env).connect(this.sfxGain);
    puff.start(time);
    puff.stop(time + 0.42);

    // 高频细腻嘶声（烛芯余烟）
    const sizzle = ctx.createBufferSource();
    sizzle.buffer = this.noiseBuffer;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4200;
    const sEnv = ctx.createGain();
    sEnv.gain.setValueAtTime(0.001, time + 0.06);
    sEnv.gain.linearRampToValueAtTime(0.14, time + 0.12);
    sEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.55);

    sizzle.connect(hp).connect(sEnv).connect(this.sfxGain);
    sizzle.start(time + 0.06);
    sizzle.stop(time + 0.6);
  }

  private playPartyPopper(time: number, pan = 0): void {
    if (!this.ctx || !this.sfxGain || !this.noiseBuffer) return;
    const ctx = this.ctx;

    const dest = this.createPannedSfxDest(pan);

    // 爆裂低频冲击瞬态
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(48, time + 0.09);
    oscGain.gain.setValueAtTime(0.75, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.11);
    osc.connect(oscGain).connect(dest);
    osc.start(time);
    osc.stop(time + 0.13);

    // 纸屑喷射清脆噪爆发
    const burst = ctx.createBufferSource();
    burst.buffer = this.noiseBuffer;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2600, time);
    bp.frequency.exponentialRampToValueAtTime(900, time + 0.28);
    bp.Q.value = 0.7;

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.001, time);
    nGain.gain.linearRampToValueAtTime(0.65, time + 0.005);
    nGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.34);

    burst.connect(bp).connect(nGain).connect(dest);
    burst.start(time, Math.random() * 1.2);
    burst.stop(time + 0.38);
  }

  private playCelebrationFanfare(time: number): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;

    // 欢庆大调号角动机: C5 -> F5 -> A5 -> C6!
    const notes = [
      { midi: 72, t: 0.0, dur: 0.16, vel: 0.38 },
      { midi: 77, t: 0.14, dur: 0.16, vel: 0.42 },
      { midi: 81, t: 0.28, dur: 0.18, vel: 0.46 },
      { midi: 84, t: 0.44, dur: 1.15, vel: 0.56 },
    ];

    notes.forEach((n) => {
      const start = time + n.t;
      const freq = midiToFreq(n.midi);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const env = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, start);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.003, start);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, start);
      filter.frequency.exponentialRampToValueAtTime(3400, start + 0.07);
      filter.frequency.exponentialRampToValueAtTime(1600, start + n.dur + 0.25);

      env.gain.setValueAtTime(0.0001, start);
      env.gain.linearRampToValueAtTime(n.vel, start + 0.02);
      env.gain.exponentialRampToValueAtTime(n.vel * 0.55, start + n.dur * 0.7);
      env.gain.exponentialRampToValueAtTime(0.0001, start + n.dur + 0.35);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(env).connect(this.sfxGain!);
      if (this.reverbNode) {
        const send = ctx.createGain();
        send.gain.value = 0.45;
        env.connect(send).connect(this.reverbNode);
      }

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + n.dur + 0.4);
      osc2.stop(start + n.dur + 0.4);
    });

    // 同步闪耀竖琴/铃铛滑音
    this.playSparkleGlissando(time + 0.42);
  }

  private playSparkleGlissando(time: number): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    // F Major 9 五声/和弦闪耀音阶
    const scale = [65, 69, 72, 74, 77, 81, 84, 86, 89, 93];
    scale.forEach((midi, idx) => {
      const start = time + idx * 0.048;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(midiToFreq(midi), start);

      env.gain.setValueAtTime(0.0001, start);
      env.gain.linearRampToValueAtTime(0.18, start + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0001, start + 0.72);

      const dest = this.createPannedSfxDest((idx / scale.length) * 1.4 - 0.7);
      osc.connect(env).connect(dest);
      if (this.reverbNode) {
        const send = ctx.createGain();
        send.gain.value = 0.5;
        env.connect(send).connect(this.reverbNode);
      }

      osc.start(start);
      osc.stop(start + 0.76);
    });
  }

  private playCrowdApplauseAndCheer(time: number, durationSec: number): void {
    if (!this.ctx || !this.sfxGain || !this.noiseBuffer) return;
    const ctx = this.ctx;

    // 1. 密集立体声掌声颗粒群 (45 次错落微拍手)
    const clapCount = 46;
    for (let i = 0; i < clapCount; i++) {
      const progress = i / clapCount;
      const offset = progress * durationSec * 0.85 + Math.random() * 0.14;
      const t = time + offset;
      // 整体鼓掌包络：前强后渐弱
      const crowdEnv = Math.sin(Math.min(1, progress * 1.2) * Math.PI * 0.85) * (1 - progress * 0.35);

      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 950 + Math.random() * 1400;
      bp.Q.value = 1.4 + Math.random() * 1.2;

      const env = ctx.createGain();
      const amp = (0.08 + Math.random() * 0.11) * Math.max(0.2, crowdEnv);
      env.gain.setValueAtTime(0.0001, t);
      env.gain.linearRampToValueAtTime(amp, t + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.065 + Math.random() * 0.045);

      const pan = (Math.random() * 2 - 1) * 0.75;
      const dest = this.createPannedSfxDest(pan);

      src.connect(bp).connect(env).connect(dest);
      src.start(t, Math.random() * 2.0);
      src.stop(t + 0.14);
    }

    // 2. 温暖欢呼声场（共鸣峰滤波噪声模拟 "Woo-hoo / Yay!" 欢呼浪潮）
    const cheerSrc = ctx.createBufferSource();
    cheerSrc.buffer = this.noiseBuffer;
    cheerSrc.loop = true;

    const formant1 = ctx.createBiquadFilter();
    formant1.type = 'bandpass';
    formant1.frequency.setValueAtTime(650, time);
    formant1.frequency.linearRampToValueAtTime(1150, time + 0.65);
    formant1.frequency.linearRampToValueAtTime(820, time + durationSec);
    formant1.Q.value = 2.4;

    const cheerGain = ctx.createGain();
    cheerGain.gain.setValueAtTime(0.0001, time);
    cheerGain.gain.linearRampToValueAtTime(0.24, time + 0.42);
    cheerGain.gain.setValueAtTime(0.22, time + 1.4);
    cheerGain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec);

    cheerSrc.connect(formant1).connect(cheerGain).connect(this.sfxGain);
    if (this.reverbNode) {
      const send = ctx.createGain();
      send.gain.value = 0.4;
      cheerGain.connect(send).connect(this.reverbNode);
    }
    cheerSrc.start(time);
    cheerSrc.stop(time + durationSec + 0.05);
  }

  private playPartyHorn(time: number, freq: number, dur: number, pan = 0): void {
    if (!this.ctx || !this.sfxGain) return;
    const ctx = this.ctx;
    const dest = this.createPannedSfxDest(pan);

    const osc = ctx.createOscillator();
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const bp = ctx.createBiquadFilter();
    const env = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 0.92, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.03, time + 0.08);
    osc.frequency.setValueAtTime(freq, time + 0.14);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.96, time + dur);

    // 轻微颤音增加派对纸卷喇叭的俏皮质感
    vib.frequency.value = 26;
    vibGain.gain.value = 12;
    vib.connect(vibGain).connect(osc.frequency);

    bp.type = 'bandpass';
    bp.frequency.value = freq * 2.1;
    bp.Q.value = 1.8;

    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(0.22, time + 0.03);
    env.gain.setValueAtTime(0.19, time + dur * 0.72);
    env.gain.exponentialRampToValueAtTime(0.0001, time + dur + 0.06);

    osc.connect(bp).connect(env).connect(dest);
    osc.start(time);
    vib.start(time);
    osc.stop(time + dur + 0.08);
    vib.stop(time + dur + 0.08);
  }

  private playFireworkBurst(time: number, pan = 0, pitch = 1): void {
    if (!this.ctx || !this.sfxGain || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const dest = this.createPannedSfxDest(pan);

    // 1. 短促升空啸叫
    const whistle = ctx.createOscillator();
    const wGain = ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(480 * pitch, time);
    whistle.frequency.exponentialRampToValueAtTime(1650 * pitch, time + 0.24);
    wGain.gain.setValueAtTime(0.0001, time);
    wGain.gain.linearRampToValueAtTime(0.075, time + 0.08);
    wGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.26);
    whistle.connect(wGain).connect(dest);
    whistle.start(time);
    whistle.stop(time + 0.28);

    const boomTime = time + 0.25;

    // 2. 烟花绽放低频闷响
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(125 * pitch, boomTime);
    boomOsc.frequency.exponentialRampToValueAtTime(34, boomTime + 0.32);
    boomGain.gain.setValueAtTime(0.45, boomTime);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, boomTime + 0.36);
    boomOsc.connect(boomGain).connect(dest);
    boomOsc.start(boomTime);
    boomOsc.stop(boomTime + 0.38);

    // 3. 散落星火宽带余韵
    const burst = ctx.createBufferSource();
    burst.buffer = this.noiseBuffer;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3200, boomTime);
    lp.frequency.exponentialRampToValueAtTime(520, boomTime + 0.85);

    const bGain = ctx.createGain();
    bGain.gain.setValueAtTime(0.001, boomTime);
    bGain.gain.linearRampToValueAtTime(0.36, boomTime + 0.012);
    bGain.gain.exponentialRampToValueAtTime(0.0001, boomTime + 0.92);

    burst.connect(lp).connect(bGain).connect(dest);
    if (this.reverbNode) {
      const send = ctx.createGain();
      send.gain.value = 0.55;
      bGain.connect(send).connect(this.reverbNode);
    }
    burst.start(boomTime, Math.random() * 1.4);
    burst.stop(boomTime + 0.96);

    // 4. 噼啪微火星闪烁
    for (let i = 0; i < 6; i++) {
      const ct = boomTime + 0.14 + Math.random() * 0.55;
      const crack = ctx.createBufferSource();
      crack.buffer = this.noiseBuffer;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 4600;
      const cGain = ctx.createGain();
      cGain.gain.setValueAtTime(0.0001, ct);
      cGain.gain.linearRampToValueAtTime(0.12, ct + 0.003);
      cGain.gain.exponentialRampToValueAtTime(0.0001, ct + 0.032);
      crack.connect(hp).connect(cGain).connect(dest);
      crack.start(ct, Math.random() * 2.2);
      crack.stop(ct + 0.04);
    }
  }

  private createPannedSfxDest(pan: number): AudioNode {
    if (!this.ctx || !this.sfxGain) {
      throw new Error('AudioContext not initialized');
    }
    if (typeof this.ctx.createStereoPanner === 'function') {
      const panner = this.ctx.createStereoPanner();
      panner.pan.value = Math.max(-0.9, Math.min(0.9, pan));
      panner.connect(this.sfxGain);
      return panner;
    }
    return this.sfxGain;
  }

  public dispose(): void {
    this.stopBirthdaySong(0.05);
    this.clearCelebrationTimers();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.masterGain = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.reverbNode = null;
      this.reverbGain = null;
      this.noiseBuffer = null;
    }
  }
}

export const birthdayAudio = new BirthdayAudioEngine();
