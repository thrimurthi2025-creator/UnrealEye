import React from 'react';

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-space-dark" />
      
      {/* Noise Overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.4"><path d="M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z"/></g></g></svg>')`,
      }} />

      {/* Animated Blobs */}
      <div className="absolute inset-0 -z-20 mix-blend-screen filter blur-[120px]">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 animate-blob rounded-full bg-light-cyan opacity-40" />
        <div className="absolute top-1/4 right-1/4 h-72 w-72 animate-blob rounded-full bg-light-purple opacity-40 [animation-delay:2s]" />
        <div className="absolute bottom-1/4 left-1/3 h-72 w-72 animate-blob rounded-full bg-light-blue opacity-40 [animation-delay:4s]" />
      </div>
    </div>
  );
}
