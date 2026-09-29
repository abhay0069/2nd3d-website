/** Math helpers used across motion + WebGL code. */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number): number =>
  from + (to - from) * t;

/** Frame-rate independent damping (Freya Holmér style). */
export const damp = (from: number, to: number, lambda: number, dt: number): number =>
  lerp(from, to, 1 - Math.exp(-lambda * dt));

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  shouldClamp = true,
): number => {
  const t = (value - inMin) / (inMax - inMin || 1);
  const eased = shouldClamp ? clamp(t, 0, 1) : t;
  return outMin + (outMax - outMin) * eased;
};

export const randomRange = (min: number, max: number): number =>
  min + Math.random() * (max - min);

/** Distance-based falloff 0..1 — used by cursor effects. */
export const falloff = (distance: number, radius: number): number => {
  if (radius <= 0) return 0;
  return clamp(1 - distance / radius, 0, 1);
};
