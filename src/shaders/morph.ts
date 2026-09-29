import { snoiseGLSL } from './noise';

/**
 * "Living matter" material — noise-displaced surface with fresnel
 * rim light and a moving ember accent light. Feels like a sculpture
 * lit in a dark room rather than a generic 3D object.
 */
export const morphVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFrequency;
uniform float uVelocity;
uniform float uReveal;

varying vec3 vNormalW;
varying vec3 vPosW;
varying float vNoise;

${snoiseGLSL}

float field(vec3 p, float t) {
  float n1 = snoise(p * uFrequency + vec3(t * 0.32, t * 0.21, -t * 0.18));
  float n2 = snoise(p * uFrequency * 2.35 - vec3(t * 0.42, -t * 0.3, t * 0.24));
  return n1 * 0.68 + n2 * 0.27;
}

void main() {
  float t = uTime;
  vec3 pos = position;

  float displacement = field(position, t);
  float amp = uAmp * (0.72 + uVelocity * 1.35);
  pos += normal * displacement * amp * uReveal;

  // Finite-difference normal so lighting follows the displacement.
  float e = 0.22;
  float dx = field(position + vec3(e, 0.0, 0.0), t);
  float dy = field(position + vec3(0.0, e, 0.0), t);
  float dz = field(position + vec3(0.0, 0.0, e), t);
  vec3 grad = vec3(dx - displacement, dy - displacement, dz - displacement) / e;
  vec3 displacedNormal = normalize(normal - grad * amp * uReveal * 0.85);

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vPosW = worldPos.xyz;
  vNormalW = normalize(mat3(modelMatrix) * displacedNormal);
  vNoise = displacement;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const morphFragment = /* glsl */ `
uniform vec3 uColorBase;
uniform vec3 uColorRim;
uniform vec3 uColorAccent;
uniform vec3 uLightPos;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float uTime;
uniform float uOpacity;

varying vec3 vNormalW;
varying vec3 vPosW;
varying float vNoise;

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);

  // Fresnel rim — the warm-white silhouette that defines the form.
  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.1);

  // Key + ember lights (wrap diffuse for a soft studio feel).
  vec3 L = normalize(uLightPos - vPosW);
  float wrap = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);
  float diff = clamp(dot(N, L), 0.0, 1.0);

  vec3 base = mix(uColorBase * 0.52, uColorBase * 1.35, wrap);

  // Machined banding driven by the noise field — material texture.
  float bands = smoothstep(0.42, 0.86, sin(vNoise * 9.0 + uTime * 0.18) * 0.5 + 0.5);
  base += bands * 0.045;

  vec3 col = base
    + uColorRim * fresnel * 0.78
    + uColorAccent * pow(diff, 2.6) * 0.5
    + uColorAccent * fresnel * 0.12;

  // Depth fog blends the form into the page background.
  float depth = length(cameraPosition - vPosW);
  float fog = smoothstep(uFogNear, uFogFar, depth);
  col = mix(col, uFogColor, fog * 0.82);

  gl_FragColor = vec4(col, uOpacity);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
