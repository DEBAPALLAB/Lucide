'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Cursor() {
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'cta'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isOverLightBg, setIsOverLightBg] = useState(false);

  // Position motion values initialized off-screen
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // useSpring for high-performance physics-based lag
  const springX = useSpring(mouseX, { stiffness: 500, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 40 });

  useEffect(() => {
    // Check if the device has a mouse and hover capability
    const mediaQuery = window.matchMedia('(hover: hover)');
    setIsMobile(!mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(!e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const overLight = !!target.closest('.bg-paper') || !!target.closest('.light-bg') || !!target.closest('[data-theme="light"]');
        setIsOverLightBg(overLight);
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    // Event delegation to catch hover on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');
      if (interactiveEl) {
        // CTA Check based on special CSS class or text trigger
        const isCta = 
          interactiveEl.getAttribute('data-cursor') === 'cta' || 
          interactiveEl.classList.contains('cta-button') ||
          interactiveEl.textContent?.toLowerCase().includes('discovery');
        
        if (isCta) {
          setCursorType('cta');
        } else {
          setCursorType('hover');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');
      if (interactiveEl) {
        const relatedTarget = e.relatedTarget as HTMLElement | null;
        if (!relatedTarget || !relatedTarget.closest('a, button, [role="button"], input[type="submit"], input[type="button"]')) {
          setCursorType('default');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible) return null;

  // Determine dynamic size and style options
  let cursorSize = 10;
  let cursorBg = 'transparent';
  let cursorBorder = isOverLightBg
    ? '1.5px solid rgba(8, 8, 8, 0.6)'
    : '1.5px solid rgba(255, 255, 255, 0.6)';

  if (cursorType === 'hover') {
    cursorSize = 24; // 2.4x scale
    cursorBg = isOverLightBg ? 'rgba(8, 8, 8, 0.08)' : 'rgba(255, 255, 255, 0.08)';
    cursorBorder = isOverLightBg
      ? '1.5px solid rgba(8, 8, 8, 0.9)'
      : '1.5px solid rgba(255, 255, 255, 0.9)';
  } else if (cursorType === 'cta') {
    cursorSize = 30; // 3x scale
    cursorBg = isOverLightBg ? 'rgba(59, 127, 232, 0.10)' : 'rgba(59, 127, 232, 0.15)';
    cursorBorder = '1.5px solid var(--blue-sphere)';
  }

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        width: cursorSize,
        height: cursorSize,
        backgroundColor: cursorBg,
        border: cursorBorder,
      }}
      transition={{
        width: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        backgroundColor: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
        borderColor: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center overflow-hidden"
    >
      {cursorType === 'cta' && (
        <span 
          style={{ color: isOverLightBg ? 'var(--blue-glow)' : 'var(--blue-light)' }}
          className="text-[8px] font-mono font-bold select-none tracking-widest leading-none"
        >
          OPEN
        </span>
      )}
    </motion.div>
  );
}
