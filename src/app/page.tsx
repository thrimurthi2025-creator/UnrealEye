'use client';
import { useEffect, useState, useRef } from 'react';

// @ts-ignore
const GradioApp = (props) => <gradio-app {...props}></gradio-app>;

export default function Home() {
  const [isGradioReady, setIsGradioReady] = useState(false);
  const gradioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutationsList, obs) => {
      // The gradio-app component has a `div.gradio-container` inside when it is ready
      // and the inner "loading" status display is gone.
      if (gradioContainerRef.current) {
        const gradioApp = gradioContainerRef.current.querySelector('gradio-app');
        if (gradioApp?.shadowRoot?.querySelector('.gradio-container') && !gradioApp?.shadowRoot?.querySelector('.st-emotion-cache-12fmjuu')) {
          setIsGradioReady(true);
          obs.disconnect(); // Stop observing once it's ready
        }
      }
    });

    if (gradioContainerRef.current) {
      observer.observe(gradioContainerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => observer.disconnect();
  }, []);


  return (
    <>
      <div className="grid-bg"></div>
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>

      <div className="container">
        <header>
          <div className="logo">
            <div className="logo-icon">🔬</div>
            <span className="logo-text">Detection Lab</span>
          </div>
          <h1>AI Image Analysis</h1>
          <p className="subtitle">Advanced neural network forensics to distinguish AI-generated imagery from authentic photographs with precision and speed.</p>
        </header>

        <main className="main-card">
          <div className="card-header">
            <h2 className="card-title">Detection Interface</h2>
            <div className="status-badge">
              <span className="status-dot"></span>
              <span>SYSTEM ONLINE</span>
            </div>
          </div>

          <div className="detector-wrapper">
            <div className="scan-lines"></div>
            
            <div id="loadingOverlay" className={`loading-overlay ${isGradioReady ? 'hidden' : ''}`}>
                <div className="scanner">
                  <div className="scanner-ring"></div>
                  <div className="scanner-ring"></div>
                  <div className="scanner-core"></div>
                </div>
                <div className="loading-text">Initializing Neural Network</div>
                <div className="loading-subtext">Loading detection models...</div>
            </div>
            
            <div ref={gradioContainerRef} style={{ visibility: isGradioReady ? 'visible' : 'hidden' }}>
                <GradioApp src="https://thrimurthi2025-ai-or-not.hf.space"></GradioApp>
            </div>
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
          </div>
        </main>

        <footer>
          © 2025 AI Detection Lab • Powered by Hugging Face Infrastructure
        </footer>
      </div>
    </>
  );
}
