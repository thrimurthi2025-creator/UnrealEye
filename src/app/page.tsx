'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const GradioApp = (props: any) => {
  const ref = useRef<HTMLElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const handleLoad = () => {
      if (!loaded) {
        props.onLoad?.();
        setLoaded(true);
      }
    };
    
    // Gradio apps can be slow to load, so we'll check for the event
    currentRef.addEventListener('load', handleLoad);

    // But also set a fallback timer
    const timer = setTimeout(handleLoad, 3000);

    return () => {
      currentRef?.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, [ref, props, loaded]);

  return <gradio-app {...props} ref={ref}></gradio-app>;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const spotlight = document.getElementById('spotlight');
    if (!spotlight) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      spotlight.style.setProperty('--x', `${clientX}px`);
      spotlight.style.setProperty('--y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div id="spotlight" className={isLoading ? 'offline' : ''}></div>
      <div className="grid-bg"></div>
      
      <div className="container">
        <header className="flex justify-between items-center py-4">
          <div className="logo">
            <Image src="https://i.postimg.cc/9F6mLw7z/Picsart-25-11-01-16-11-00-382.png" alt="Logo" width={50} height={50} className="w-10 h-10 md:w-12 md:h-12" />
            <span className="logo-text logo-text-gradient">Unreal Eye</span>
          </div>
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
            
            {isClient && (
              <GradioApp 
                src="https://thrimurthi2025-unrealeye.hf.space"
                onLoad={() => setIsLoading(false)}
              />
            )}
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
          <section className="emergency-section">
            <div className="emergency-header">
              <span className="emergency-icon">🛡️</span>
              <h2 className="emergency-title">Emergency Help: Image-Based Abuse</h2>
            </div>
            <p className="emergency-desc">
              If someone has shared or threatened to share an intimate image of you (real or AI-generated) without your consent, you can take action. This is called Non-Consensual Intimate Imagery (NCII).
            </p>
            <div className="emergency-reassurance">
              <p>🔒 <strong>Your images never leave your device.</strong> The service linked below creates a secure digital fingerprint (a "hash") of the image on your own device to find and remove it, without uploading the image itself.</p>
              <p>⚖️ <strong>This applies to AI-generated fakes of real people.</strong> The law and takedown policies often protect you even if the image is a "deepfake" or digitally altered.</p>
            </div>
            <div className="emergency-steps">
              <h3 className="steps-title">How to Remove an Image from the Internet</h3>
              <ol className="steps-list">
                <li><strong>Preserve Evidence:</strong> Before taking any other action, take a screenshot of where the image is posted. This is for your own records and potential legal action.</li>
                <li><strong>Generate the Hash:</strong> Use the free tool StopNCII.org. Click the button below to go to their secure website and follow their instructions to create a case.</li>
                <li><strong>Track Progress:</strong> Once your case is submitted, StopNCII.org works with participating tech companies to find and remove the image across their platforms.</li>
              </ol>
            </div>
            <a href="https://stopncii.org/" target="_blank" rel="noopener noreferrer" className="emergency-button">
              Remove from Internet (via StopNCII.org)
            </a>
          </section>
        </main>

        <footer>
          © 2025 Unreal Eye
        </footer>
      </div>
    </>
  );
}
