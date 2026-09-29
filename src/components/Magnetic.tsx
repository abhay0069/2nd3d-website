import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

interface BaseProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  cursor?: string;
}

type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

/**
 * Magnetic target — element eases toward the cursor on hover.
 * Used for primary CTAs and the contact email.
 */
export function Magnetic(props: AnchorProps | ButtonProps) {
  const { children, className = '', strength = 0.26, cursor = 'OPEN', ...rest } = props;
  const ref = useMagnetic<HTMLSpanElement>(strength);

  const inner = (
    <span ref={ref} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </span>
  );

  if ('href' in props && props.href) {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchorProps} className={`magnetic ${className}`} data-cursor={cursor}>
        {inner}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...buttonProps} className={`magnetic ${className}`} data-cursor={cursor}>
      {inner}
    </button>
  );
}
