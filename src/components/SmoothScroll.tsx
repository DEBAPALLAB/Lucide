'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Instantiate Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Update GSAP ScrollTrigger whenever Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis's smooth rendering loop with the GSAP ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000); // GSAP ticker uses seconds, Lenis expects milliseconds
    };
    gsap.ticker.add(updateTicker);

    // Disable lag smoothing to prevent syncing latency issues between GSAP and Lenis
    gsap.ticker.lagSmoothing(0);

    // Expose lenis globally for debug/custom scripts (e.g. scroll locks or menu state resets)
    (window as any).lenis = lenis;

    // Cleanup resources
    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateTicker);
      delete (window as any).lenis;
    };
  }, []);

  return <>{children}</>;
}
