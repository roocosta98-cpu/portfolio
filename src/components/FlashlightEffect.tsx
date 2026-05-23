import React, { useEffect, useState, useRef } from 'react';

const FlashlightEffect: React.FC = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Detect touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!overlayRef.current) return;
      overlayRef.current.style.opacity = '1';
      overlayRef.current.style.background = `radial-gradient(
        circle 360px at ${e.clientX}px ${e.clientY}px,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(139, 92, 246, 0.045) 35%,
        rgba(6, 182, 212, 0.025) 65%,
        transparent 100%
      )`;
    };

    const handleMouseLeave = () => {
      if (!overlayRef.current) return;
      // Smoothly fade out the flashlight mask when mouse leaves the page
      overlayRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      if (!overlayRef.current) return;
      overlayRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-[45] opacity-0 mix-blend-screen"
      style={{
        transition: 'opacity 0.6s ease-out, background 0.02s linear',
      }}
    />
  );
};

export default FlashlightEffect;
