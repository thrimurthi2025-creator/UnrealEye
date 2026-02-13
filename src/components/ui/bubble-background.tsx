import React from 'react';

export function BubbleBackground() {
  const bubbles = Array.from({ length: 10 });
  return (
    <div className="bubble-background" aria-hidden="true">
      {bubbles.map((_, i) => (
        <div key={i} className="bubble" />
      ))}
    </div>
  );
}
