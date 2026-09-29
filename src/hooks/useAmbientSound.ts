import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Procedural ambient drone — synthesized with WebAudio, no assets.
 * Two detuned oscillators through a slowly-breathing low-pass filter.
 * Always OFF by default; the user opts in.
 */
export function useAmbientSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  const buildGraph = useCallback((ctx: AudioContext) => {
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // Drone body
    const oscA = ctx.createOscillator();
    oscA.type = 'sine';
    oscA.frequency.value = 55;

    const oscB = ctx.createOscillator();
    oscB.type = 'triangle';
    oscB.frequency.value = 82.5;

    const oscC = ctx.createOscillator();
    oscC.type = 'sine';
    oscC.frequency.value = 110.3;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;
    filter.Q.value = 0.8;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.5;

    oscA.connect(droneGain);
    oscB.connect(droneGain);
    oscC.connect(droneGain);
    droneGain.connect(filter);
    filter.connect(master);

    // Slow breathing on the filter cutoff
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    oscA.start();
    oscB.start();
    oscC.start();
    lfo.start();

    return master;
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;

      if (next) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return false;

        if (!ctxRef.current) {
          ctxRef.current = new Ctor();
          masterRef.current = buildGraph(ctxRef.current);
        }
        void ctxRef.current.resume();
        const now = ctxRef.current.currentTime;
        masterRef.current?.gain.cancelScheduledValues(now);
        masterRef.current?.gain.linearRampToValueAtTime(0.045, now + 1.4);
      } else if (ctxRef.current && masterRef.current) {
        const now = ctxRef.current.currentTime;
        masterRef.current.gain.cancelScheduledValues(now);
        masterRef.current.gain.linearRampToValueAtTime(0, now + 0.7);
      }

      return next;
    });
  }, [buildGraph]);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
    },
    [],
  );

  return { enabled, toggle };
}
