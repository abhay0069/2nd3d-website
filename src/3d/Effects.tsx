import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface Props {
  enabled: boolean;
}

/**
 * Restrained post stack: whisper-soft bloom on highlights,
 * film vignette, a touch of grain. Nothing neon.
 */
export function Effects({ enabled }: Props) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        intensity={0.42}
        luminanceThreshold={0.74}
        luminanceSmoothing={0.3}
        radius={0.76}
      />
      <Vignette eskil={false} offset={0.16} darkness={0.72} blendFunction={BlendFunction.NORMAL} />
      <Noise premultiply opacity={0.05} blendFunction={BlendFunction.SCREEN} />
    </EffectComposer>
  );
}
