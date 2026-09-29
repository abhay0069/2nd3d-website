/**
 * Mutable scene state shared between React (ScrollTrigger) and the
 * WebGL frame loop. Written imperatively so the 3D scene never
 * causes React re-renders.
 */
export const sceneState = {
  /** 0..1 progress through the hero pin */
  heroProgress: 0,
  /** normalized pointer -1..1 */
  mouseX: 0,
  mouseY: 0,
  /** smoothed pointer velocity 0..1 */
  velocity: 0,
  /** 0..1 intro reveal after the preloader */
  intro: 0,
  /** flipped when the preloader releases the experience */
  introEnabled: false,
  /** global reduced-motion flag */
  reduced: false,
  /** page visibility — pause expensive work when hidden */
  visible: true,
};

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    sceneState.visible = !document.hidden;
  });
}
