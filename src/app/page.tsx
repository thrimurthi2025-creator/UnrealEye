'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const GradioApp = (props: any) => {
  const ref = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const onLoad = () => setIsLoaded(true);
    ref.current.addEventListener('load', onLoad);
    return () => ref.current?.removeEventListener('load', onLoad);
  }, [ref]);

  return <gradio-app {...props} ref={ref}></gradio-app>;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false)
  const gradioRef = useRef<any>(null);


  useEffect(() => {
    setIsClient(true)
    const handleLoad = () => {
      setIsLoading(false);
    };

    const gradioEl = gradioRef.current;
    if (gradioEl) {
      gradioEl.addEventListener('load', handleLoad);
    }
    
    // Fallback timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);


    return () => {
      clearTimeout(timer);
      if (gradioEl) {
        gradioEl.removeEventListener('load', handleLoad);
      }
    };
  }, [isClient]);

  return (
    <>
      <div className="grid-bg"></div>
      
      <div className="container">
        <nav className="top-nav">
          <div className="logo">
            <Image src="https://i.postimg.cc/9F6mLw7z/Picsart-25-11-01-16-11-00-382.png" alt="Logo" width={50} height={50} />
            <span className="logo-text logo-text-gradient">Unreal Eye</span>
          </div>
        </nav>

        <header>
        </header>

        <main className={isLoading ? "main-card offline" : "main-card"}>
          <div className="card-header">
            <h2 className="card-title">Detection Interface</h2>
            <div className={isLoading ? "status-badge offline" : "status-badge"}>
              <span className="status-dot"></span>
              <span>{isLoading ? 'SYSTEM OFFLINE' : 'SYSTEM ONLINE'}</span>
            </div>
          </div>

          <div className="detector-wrapper">
            <div className="scan-lines"></div>
            
            <div id="loadingOverlay" className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
                <div className="scanner">
                  <div className="scanner-ring"></div>
                  <div className="scanner-ring"></div>
                  <div className="scanner-core"></div>
                </div>
                <div className="loading-text">Initializing Neural Network</div>
                <div className="loading-subtext">Loading detection models...</div>
            </div>
            
            {isClient && <GradioApp ref={gradioRef} src="https://thrimurthi2025-unrealeye.hf.space"></GradioApp>}
          </div>

          <div className="features">
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <h3 className="feature-title">Real-Time Analysis</h3>
              <p className="feature-desc">Process images in milliseconds with GPU-accelerated inference.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <h3 className="feature-title">High Accuracy</h3>
              <p className="feature-desc">99%+ precision trained on millions of diverse image samples.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔐</span>
              <h3 className="feature-title">Privacy First</h3>
              <p className="feature-desc">Zero data retention. All processing happens in-memory.</p>
            </div>
            <div className="feature">
              <span className="feature-icon">⚠️</span>
              <h3 className="feature-title">Disclaimer</h3>
              <p className="feature-desc">AI image detection might not be 100% accurate.</p>
            </div>
          </div>
        </main>

        <footer>
          © 2025 Unreal Eye
        </footer>
      </div>
    </>
  );
}
