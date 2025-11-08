"use client";

import React, { useState, useRef, useCallback } from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';

interface SwipeButtonProps {
  href: string;
  text: string;
}

export function SwipeButton({ href, text }: SwipeButtonProps) {
  const [sliding, setSliding] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = (clientX: number) => {
    if (unlocked) return;
    setSliding(true);
  };

  const handleInteractionMove = useCallback((clientX: number) => {
    if (!sliding || unlocked || !containerRef.current || !sliderRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const sliderWidth = sliderRef.current.offsetWidth;
    
    let newPosition = clientX - containerRect.left - sliderWidth / 2;
    newPosition = Math.max(0, newPosition);
    
    const maxPosition = containerRect.width - sliderWidth;
    newPosition = Math.min(maxPosition, newPosition);

    setSliderPosition(newPosition);

    if (newPosition >= maxPosition - 5) {
      setUnlocked(true);
      setSliding(false);
      window.open(href, '_blank', 'noopener,noreferrer');
      // Reset after a delay
      setTimeout(() => {
        setSliderPosition(0);
        setUnlocked(false);
      }, 1500);
    }
  }, [sliding, unlocked, href]);
  
  const handleInteractionEnd = () => {
    if (!sliding || unlocked) return;
    setSliding(false);
    
    // Snap back if not unlocked
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (container && slider) {
      const maxPosition = container.offsetWidth - slider.offsetWidth;
      if (sliderPosition < maxPosition) {
        setSliderPosition(0);
      }
    }
  };

  const onMouseDown = (e: React.MouseEvent) => handleInteractionStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleInteractionMove(e.clientX);
  
  const onTouchStart = (e: React.TouchEvent) => handleInteractionStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleInteractionMove(e.touches[0].clientX);

  React.useEffect(() => {
    const handleMouseUp = () => handleInteractionEnd();
    const handleTouchEnd = () => handleInteractionEnd();
    const handleMouseMoveGlobal = (e: MouseEvent) => handleInteractionMove(e.clientX);
    const handleTouchMoveGlobal = (e: TouchEvent) => handleInteractionMove(e.touches[0].clientX);

    if (sliding) {
      window.addEventListener('mousemove', handleMouseMoveGlobal);
      window.addEventListener('touchmove', handleTouchMoveGlobal);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('touchmove', handleTouchMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sliding, handleInteractionMove]);


  return (
    <div 
      ref={containerRef}
      className={`swipe-button-container ${unlocked ? 'unlocked' : ''} ${sliding ? 'sliding' : ''}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div 
        ref={sliderRef}
        className="swipe-button-slider"
        style={{ transform: `translateX(${sliderPosition}px)` }}
      >
        {unlocked ? <ShieldCheck /> : <ChevronRight />}
      </div>
      <span className="swipe-button-text">
        {unlocked ? 'Action Complete' : text}
      </span>
    </div>
  );
}
