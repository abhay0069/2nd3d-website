import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Last line of defence behind the boot watchdog: any render failure
 * degrades to a branded recovery screen instead of a black page.
 * Styles are inline on purpose — the fallback must survive a broken
 * stylesheet bundle, which is exactly when it is needed.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[OBSCURA] render failure caught by error boundary:', error, info.componentStack);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;

    return (
      <div
        role="alert"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          padding: '2rem',
          background: '#0b0b0c',
          color: '#f2efe9',
          textAlign: 'center',
          fontFamily: "'Space Grotesk', 'Helvetica Neue', sans-serif",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.68rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#ff4a1f',
          }}
        >
          System interrupt
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(1.6rem, 5vw, 3rem)',
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          The experience failed to render.
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: '34rem',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: '#c9c5bd',
          }}
        >
          The signal dropped mid-flight. Reloading usually restores it — if the
          problem persists, the studio is already looking at the wires.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          style={{
            marginTop: '0.5rem',
            padding: '0.9rem 1.6rem',
            background: '#ff4a1f',
            color: '#0b0b0c',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.7rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}
