'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

// @ts-ignore
const GradioApp = (props) => <gradio-app {...props}></gradio-app>;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="grid-bg"></div>
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      
      <div className="container">
        <header>
          <div className="logo">
            <Image src="https://i.postimg.cc/mD3pJS5v/1761889825749.jpg" alt="Logo" width={50} height={50} />
            <span className="logo-text">Detection Lab</span>
          </div>
          <h1>AI Image Analysis</h1>
          <p className="subtitle">Advanced neural network forensics to distinguish AI-generated imagery from authentic photographs with precision and speed.</p>
        </header>

        <main className="main-card">
          <div className="card-header">
            <h2 className="card-title">Detection Interface</h2>
            <div className={isLoading ? "status-badge offline" : "status-badge"}>
              <span className="status-dot"></span>
              <span>{isLoading ? 'SYSTEM OFFLINE' : 'SYSTEM ONLINE'}</span>
            </div>
          </div>

          <div className="detector-wrapper">
            <div className="scan-lines"></div>
            
            {isLoading && (
              <div id="loadingOverlay" className="loading-overlay">
                  <div className="scanner">
                    <div className="scanner-ring"></div>
                    <div className="scanner-ring"></div>
                    <div className="scanner-core"></div>
                  </div>
                  <div className="loading-text">Initializing Neural Network</div>
                  <div className="loading-subtext">Loading detection models...</div>
              </div>
            )}
            
            {isClient && <GradioApp src="https://thrimurthi2025-ai-or-not.hf.space"></GradioApp>}
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
