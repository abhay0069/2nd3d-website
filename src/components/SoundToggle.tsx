import './SoundToggle.css';

interface Props {
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Subtle SOUND ON/OFF control. Audio never starts without consent.
 */
export function SoundToggle({ enabled, onToggle, className = '' }: Props) {
  return (
    <button
      type="button"
      className={`sound-toggle ${className}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn ambient sound off' : 'Turn ambient sound on'}
      data-cursor="SOUND"
    >
      <span className="sound-toggle__bars" aria-hidden="true">
        <span className={`sound-toggle__bar ${enabled ? 'is-on' : ''}`} />
        <span className={`sound-toggle__bar ${enabled ? 'is-on' : ''}`} />
        <span className={`sound-toggle__bar ${enabled ? 'is-on' : ''}`} />
      </span>
      <span className="sound-toggle__label">{enabled ? 'SOUND ON' : 'SOUND OFF'}</span>
    </button>
  );
}
