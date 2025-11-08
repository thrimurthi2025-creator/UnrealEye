'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SwipeButtonProps {
  href: string;
  text: string;
}

export function SwipeButton({ href, text }: SwipeButtonProps) {
  const [sliding, setSliding] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const containerRef = useRef<HTMLAnchorElement>(null);
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
      // The user will now be able to click the link
    }
  }, [sliding, unlocked]);
  
  const handleInteractionEnd = () => {
    if (!sliding || unlocked) return;
    setSliding(false);
    
    if (sliderPosition < (containerRef.current!.offsetWidth - sliderRef.current!.offsetWidth - 5)) {
      setSliderPosition(0);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!unlocked) e.preventDefault();
    handleInteractionStart(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!unlocked) e.preventDefault();
    handleInteractionStart(e.touches[0].clientX);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!unlocked) {
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => handleInteractionMove(e.clientX);
    const handleTouchMoveGlobal = (e: TouchEvent) => handleInteractionMove(e.touches[0].clientX);
    const handleMouseUp = () => handleInteractionEnd();
    const handleTouchEnd = () => handleInteractionEnd();

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
    <Link 
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('swipe-button-container', { unlocked, sliding })}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClick={handleClick}
      draggable="false"
    >
      <div 
        ref={sliderRef}
        className="swipe-button-slider"
        style={{ transform: `translateX(${sliderPosition}px)` }}
      >
        {unlocked ? <ShieldCheck /> : <ChevronRight />}
      </div>
      <span className="swipe-button-text">
        {unlocked ? 'Click to Continue' : text}
      </span>
    </Link>
  );
}
