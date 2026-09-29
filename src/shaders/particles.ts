/**
 * Ambient particle field — soft dust drifting through depth,
 * gently repelled by the cursor. Reads as atmosphere, not stars.
 */
export const particlesVertex = /* glsl */ `
attribute float aScale;
attribute float aSeed;
attribute float aAccent;

uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uMouse;
uniform float uVelocity;

varying float vAlpha;
varying float vAccent;

void main() {
  vec3 pos = position;

  // Slow orbital drift — each particle breathes on its own phase.
  float t = uTime * 0.16;
  pos.x += sin(t * 0.9 + aSeed * 6.283) * 0.35;
  pos.y += cos(t * 0.7 + aSeed * 4.712) * 0.28 + sin(t * 0.22 + aSeed) * 0.42;
  pos.z += sin(t * 0.5 + aSeed * 2.399) * 0.3;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vec4 clip = projectionMatrix * mvPosition;
  vec2 ndc = clip.xy / max(clip.w, 0.0001);

  // Cursor repulsion in screen space — subtle, velocity-boosted.
  float d = distance(ndc, uMouse);
  float influence = smoothstep(0.55, 0.0, d) * (0.06 + uVelocity * 0.22);
  vec2 dir = normalize(ndc - uMouse + vec2(0.0001));
  mvPosition.xy += dir * influence * clip.w * 0.6;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = aScale * uPixelRatio * (26.0 / -mvPosition.z);

  float depthFade = smoothstep(-14.0, -2.0, mvPosition.z);
  vAlpha = mix(0.05, 0.62, depthFade) * (0.35 + aScale * 0.4);
  vAccent = aAccent;
}
`;

export const particlesFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uOpacity;

varying float vAlpha;
varying float vAccent;

void main() {
  float dist = distance(gl_PointCoord, vec2(0.5));
  float alpha = smoothstep(0.5, 0.08, dist) * vAlpha * uOpacity;
  if (alpha < 0.003) discard;

  vec3 col = mix(uColor, uAccent, vAccent);
  gl_FragColor = vec4(col, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
