'use client';

import { useState, useCallback, type ReactNode, type CSSProperties } from 'react';
import PageLoader from './PageLoader';

interface ClientShellProps {
  children: ReactNode;
}

// Page content sits behind the loader (opacity 0) until the sequence finishes.
// Using opacity (not visibility/display) so canvas + GSAP layout still works while hidden.
const hiddenStyle: CSSProperties = { opacity: 0, pointerEvents: 'none' };
const visibleStyle: CSSProperties = {
  opacity: 1,
  pointerEvents: 'auto',
  transition: 'opacity 0.4s ease',
};

export default function ClientShell({ children }: ClientShellProps) {
  const [ready, setReady] = useState(false);
  const handleLoaderDone = useCallback(() => setReady(true), []);

  return (
    <>
      {!ready && <PageLoader onComplete={handleLoaderDone} />}
      <div style={ready ? visibleStyle : hiddenStyle}>
        {children}
      </div>
    </>
  );
}
