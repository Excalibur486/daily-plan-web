// Web Audio API generator for clean UI chimes and ambient sound synthesis

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a pleasant uplifting chime when completing a task or habit
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Dual-tone harmonic chime (Major third / Fifth)
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    freqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.06);

      gain.gain.setValueAtTime(0, now + index * 0.06);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.06);
      osc.stop(now + index * 0.06 + 0.6);
    });
  } catch {
    // Graceful fallback if audio is blocked
  }
}

/**
 * Play a gentle bell sound when timer completes
 */
export function playTimerFinishChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  } catch {
    // Ignore audio errors
  }
}

// Ambient Noise Synthesizers for Pomodoro Focus
let currentNoiseNode: AudioNode | null = null;
let currentNoiseGain: GainNode | null = null;

export function startAmbientNoise(type: 'rain' | 'waves' | 'brown' | 'whitenoise', volume: number = 0.2) {
  stopAmbientNoise();
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'whitenoise') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'brown' || type === 'waves') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // boost
      }
    } else if (type === 'rain') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.05 * white) / 1.05;
        lastOut = output[i];
        output[i] *= 2.5;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter
    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
    } else if (type === 'waves') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
    } else if (type === 'brown') {
      filter.type = 'lowpass';
      filter.frequency.value = 300;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 3500;
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();

    currentNoiseNode = whiteNoise;
    currentNoiseGain = gain;
  } catch {
    // Ignore audio start failures
  }
}

export function setAmbientVolume(vol: number) {
  if (currentNoiseGain && audioCtx) {
    currentNoiseGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
  }
}

export function stopAmbientNoise() {
  if (currentNoiseNode) {
    try {
      (currentNoiseNode as AudioScheduledSourceNode).stop();
      currentNoiseNode.disconnect();
    } catch {
      // Ignored
    }
    currentNoiseNode = null;
    currentNoiseGain = null;
  }
}
