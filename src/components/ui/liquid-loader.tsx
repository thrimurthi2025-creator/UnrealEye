'use client';

export function LiquidLoader() {
  return (
    <div className="liquid-loader-container">
      <div className="liquid-loader-filter-container">
        <div className="liquid-loader-content">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
      </div>
      <div className="loader-text-wrapper">
         <span className="font-bold text-2xl text-gradient-cyan">Unreal Eye</span>
      </div>
    </div>
  );
}
