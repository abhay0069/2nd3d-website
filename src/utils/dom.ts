/** DOM helpers — text splitting + smooth anchor scrolling. */

export interface SplitOptions {
  /** wrap each line in an overflow-hidden mask */
  mask?: boolean;
  className?: string;
}

/**
 * Split element text into word spans (and line masks).
 * A lightweight, dependency-free alternative to GSAP's club SplitText.
 */
export function splitWords(el: HTMLElement, { mask = true, className = '' }: SplitOptions = {}): HTMLElement[] {
  const text = el.textContent ?? '';
  const words = text.trim().split(/\s+/);
  el.setAttribute('aria-label', text.trim());
  el.textContent = '';

  const line = document.createElement('span');
  line.className = mask ? 'split-line' : 'split-line split-line--open';
  line.setAttribute('aria-hidden', 'true');
  if (className) line.classList.add(className);

  const wordEls: HTMLElement[] = [];
  words.forEach((word, i) => {
    const wordEl = document.createElement('span');
    wordEl.className = 'split-word';
    wordEl.textContent = word;
    line.appendChild(wordEl);
    if (i < words.length - 1) {
      line.appendChild(document.createTextNode(' '));
    }
    wordEls.push(wordEl);
  });

  el.appendChild(line);
  return wordEls;
}

/** Split into character spans (keeps words unbroken for wrapping). */
export function splitChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? '';
  el.setAttribute('aria-label', text.trim());
  el.textContent = '';
  el.setAttribute('aria-hidden', 'false');

  const charEls: HTMLElement[] = [];
  text.split(/(\s+)/).forEach((token) => {
    if (/^\s+$/.test(token)) {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const word = document.createElement('span');
    word.className = 'split-word';
    word.style.display = 'inline-block';
    token.split('').forEach((ch) => {
      const charEl = document.createElement('span');
      charEl.className = 'split-char';
      charEl.textContent = ch;
      word.appendChild(charEl);
      charEls.push(charEl);
    });
    el.appendChild(word);
  });
  return charEls;
}

/** True when the device reports a fine pointer (mouse/trackpad). */
export const isFinePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/** True for touch-first devices. */
export const isTouchDevice = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
