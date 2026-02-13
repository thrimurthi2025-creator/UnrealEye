'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ScanEye, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SharePage() {
  const [sharedImage, setSharedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.file) {
        const file = event.data.file as File;
        if (file.type.startsWith('image/')) {
          setSharedImage(URL.createObjectURL(file));
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, []);
  
  const detectorSrc = "https://thrimurthi2025-unrealeyeultra.hf.space";

  if (!isClient) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
        </div>
      );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
          <GlassCard className="flex items-center justify-between p-3 rounded-full">
            <Link href="/" className='flex items-center gap-2'>
              <ScanEye className="w-10 h-10 text-foreground" />
              <span className="font-bold text-xl text-foreground">Unreal Eye</span>
            </Link>
            <div className="flex items-center gap-2">
                <Link href="/" className="bg-foreground/5 text-foreground px-4 py-2 rounded-full text-sm hover:bg-foreground/10 transition-colors">
                  &larr; Back to Home
                </Link>
              <ThemeToggle />
            </div>
          </GlassCard>
        </header>

        <main className="mt-32 space-y-8">
            <h1 className="text-center text-3xl font-bold text-gradient-purple">Shared Image Analysis</h1>
            
            {sharedImage ? (
                  <GlassCard className="p-4 md:p-6">
                    <h2 className="text-xl font-bold mb-4 text-center">Your Shared Image</h2>
                    <div className="relative w-full max-w-lg mx-auto aspect-video mb-6 rounded-2xl overflow-hidden border border-border">
                        <Image src={sharedImage} alt="Shared content" fill objectFit="contain" />
                    </div>
                    <div className="flex items-center gap-3 bg-secondary p-4 rounded-2xl">
                        <AlertTriangle className="w-8 h-8 text-purple-400 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            For your privacy, this image has not been automatically uploaded. Please use the detector below to analyze it.
                        </p>
                    </div>
                </GlassCard>
            ) : (
                  <GlassCard className="p-10 text-center">
                    <p className="text-lg text-muted-foreground">Waiting to receive a shared image...</p>
                    <p className="text-sm mt-2 text-muted-foreground/80">Share an image from another app to begin analysis.</p>
                </GlassCard>
            )}

            <GlassCard className="p-4 md:p-6">
              <h2 className="text-xl font-bold text-center mb-4">Image Detector</h2>
              <div className="relative min-h-[950px] rounded-4xl overflow-hidden bg-secondary/50">
                <iframe
                  src={detectorSrc}
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </GlassCard>
        </main>

        <footer className="text-center py-16 text-muted-foreground text-sm">
          © 2025 Unreal Eye. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
