// ===== Sound Effects using Web Audio API =====
// No external files needed — all sounds generated programmatically

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// ===== Helper: play a tone =====
function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume: number = 0.3,
  delay: number = 0
) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
  gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

// ===== 1. LOGIN SUCCESS — Magical chime =====
export function playLoginSuccess() {
  // Ascending bell-like chimes
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playTone(freq, 0.6, "sine", 0.2, i * 0.12);
  });
  // Sparkle overlay
  playTone(1568, 0.8, "sine", 0.08, 0.3);
  playTone(2093, 0.6, "sine", 0.05, 0.45);
}

// ===== 2. BUTTON CLICK — Soft tap =====
export function playButtonClick() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

// ===== 3. PAGE TRANSITION — Whoosh =====
export function playWhoosh() {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.3);
  filter.Q.value = 2;

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

// ===== 4. BAG SHAKE — Rattling coins =====
export function playBagShake() {
  const ctx = getAudioContext();

  for (let i = 0; i < 6; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(
      2000 + Math.random() * 3000,
      ctx.currentTime + i * 0.06
    );

    gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + i * 0.06 + 0.05
    );

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.06);
    osc.stop(ctx.currentTime + i * 0.06 + 0.05);
  }
}

// ===== 5. BAG OPEN / REVEAL — Ta-da! =====
export function playBagOpen() {
  // Rising fanfare
  const notes = [392, 494, 587, 784]; // G4, B4, D5, G5
  notes.forEach((freq, i) => {
    playTone(freq, 0.5, "sine", 0.15, i * 0.08);
  });

  // Shimmer
  playTone(1175, 1.0, "sine", 0.06, 0.2);
  playTone(1568, 0.8, "sine", 0.04, 0.35);

  // Coin drop
  setTimeout(() => {
    playTone(3000, 0.15, "square", 0.06);
    playTone(4000, 0.1, "square", 0.04, 0.05);
  }, 300);
}

// ===== 6. ERROR — Gentle buzz =====
export function playError() {
  playTone(200, 0.15, "sawtooth", 0.1);
  playTone(180, 0.15, "sawtooth", 0.08, 0.1);
}

// ===== 7. PHOTO TRANSITION — Soft camera shutter =====
export function playPhotoSwipe() {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.1;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 3000;
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

// ===== 8. CONFETTI / CELEBRATION =====
export function playCelebration() {
  // Ascending sparkle
  const sparkleNotes = [523, 659, 784, 1047, 1319, 1568];
  sparkleNotes.forEach((freq, i) => {
    playTone(freq, 0.4, "sine", 0.1, i * 0.07);
  });

  // Final shimmer
  playTone(2093, 1.2, "sine", 0.05, 0.4);
  playTone(2637, 1.0, "sine", 0.03, 0.5);
}
