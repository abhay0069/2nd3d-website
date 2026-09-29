import { useEffect, useState } from 'react';

/**
 * Honour the OS-level reduced motion preference
 * and keep a reactive value for animation gates.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;

    const apply = () => {
      const value = mql.matches;
      setReduced(value);
      root.setAttribute('data-reduced-motion', String(value));
    };

    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, []);

  return reduced;
}
