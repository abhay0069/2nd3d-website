import { useEffect, useState } from 'react';
import { SITE } from '../data/site';

/**
 * Live studio clock (Berlin) — a small sign that the site is alive.
 */
export function LiveClock({ className = '' }: { className?: string }) {
  const [time, setTime] = useState(() => format());

  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} aria-label="Current time in Berlin">
      {time}
    </span>
  );
}

function format(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: SITE.timezone,
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString('en-GB', { hour12: false });
  }
}
