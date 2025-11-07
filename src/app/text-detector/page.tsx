'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader } from '@/components/ui/loader';

const GradioApp = (props: any) => {
  const ref = useRef<HTMLElement | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const handleLoad = () => {
      if (!loaded.current) {
        props.onLoad?.();
        loaded.current = true;
      }
    };
    
    currentRef.addEventListener('load', handleLoad);
    const timer = setTimeout(handleLoad, 5000);

    return () => {
      currentRef?.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, [ref, props]);

  return <gradio-app {...props} ref={ref}></gradio-app>;
};

export default function TextDetectorPage() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <div className="grid-bg"></div>
      
      <div className="container">
        <header className="flex justify-between items-center py-4">
          <div className="logo">
            <Link href="/" className='flex items-center gap-3'>
              <Image src="https://i.postimg.cc/9F6mLw7z/Picsart-25-11-01-16-11-00-382.png" alt="Logo" width={50} height={50} className="w-10 h-10 md:w-12 md:h-12" />
              <span className="logo-text logo-text-gradient">Unreal Eye</span>
            </Link>
          </div>
        </header>

        <main>
          <section className="main-card">
            <div className="card-header">
                <h2 className="card-title">AI-Generated Content Detector</h2>
            </div>
            <div className="detector-wrapper">
                <div id="loadingOverlay" className={`loading-overlay ${!isLoading ? 'hidden' : ''}`}>
                  <Loader />
                </div>

                {isClient && (
                    <GradioApp 
                      src="https://thrimurthi2025-unrealeye-text.hf.space" 
                      onLoad={() => setIsLoading(false)}
                    />
                )}
            </div>
          </section>
        </main>

        <footer>
          © 2025 Unreal Eye
        </footer>
      </div>
    </>
  );
}
