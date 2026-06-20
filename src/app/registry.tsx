'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

// Server-side style registry for styled-jsx in the App Router.
// Without this, `<style jsx>` CSS (used by the Work/Services section) is only
// injected on the client after hydration — causing a flash of unstyled content
// (huge raw images, unstyled copy) on reload. This flushes the collected CSS
// into the SSR'd HTML so styles are present on first paint.
export default function StyledJsxRegistry({ children }: { children: React.ReactNode }) {
  // Only create the stylesheet once, with lazy initial state.
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
