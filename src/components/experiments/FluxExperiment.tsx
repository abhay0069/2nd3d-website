import { useEffect, useRef } from 'react';
import { snoiseGLSL } from '../../shaders/noise';

const VERT = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uVelocity;

${snoiseGLSL}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  vec2 mouse = uMouse * 2.0 - 1.0;

  float t = uTime * 0.22;

  // liquid metaball-ish field distorted by noise
  float n = snoise(vec3(uv * 1.35, t));
  float n2 = snoise(vec3(uv * 2.6 + n * 0.6, t * 1.4));

  vec2 warp = uv + vec2(n, n2) * 0.22;
  float d = length(warp - mouse * 0.55);

  float core = smoothstep(0.92 + uVelocity * 0.25, 0.06, d);
  float rings = sin(d * 9.0 - t * 5.0) * 0.5 + 0.5;
  float mask = smoothstep(0.35, 0.95, core * (0.55 + rings * 0.65));

  vec3 graphite = vec3(0.078, 0.078, 0.086);
  vec3 paper = vec3(0.949, 0.937, 0.914);
  vec3 accent = vec3(1.0, 0.29, 0.122);

  vec3 col = mix(graphite, paper, mask);
  col = mix(col, accent, smoothstep(0.55, 1.0, mask * rings) * 0.55);

  // vignette
  float vig = smoothstep(1.65, 0.45, length(uv));
  col *= 0.72 + vig * 0.28;

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * EXPERIMENT 03 — FLUX
 * A raw-WebGL liquid geometry shader. No libraries, ~1 quad.
 */
export function FluxExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!parent || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uVelocity = gl.getUniformLocation(program, 'uVelocity');

    let mouse = { x: 0.5, y: 0.5 };
    let target = { x: 0.5, y: 0.5 };
    let velocity = 0;
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.75);
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
    };

    const tick = (now: number) => {
      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.x += (target.x - mouse.x) * 0.07;
      mouse.y += (target.y - mouse.y) * 0.07;
      velocity += (Math.min(1, Math.hypot(mouse.x - prevX, mouse.y - prevY) * 26) - velocity) * 0.1;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uVelocity, velocity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    canvas.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} className="experiment__canvas" aria-hidden="true" />;
}
