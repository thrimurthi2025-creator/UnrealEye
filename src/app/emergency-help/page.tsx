'use client';
import Link from 'next/link';
import { SwipeButton } from '@/components/ui/swipe-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Shield, Lock, FileCheck, ScanEye } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function EmergencyHelp() {
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
         <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
          <GlassCard className="flex items-center justify-between p-3 rounded-full">
            <Link href="/" className='flex items-center gap-2'>
              <ScanEye className="w-10 h-10 text-foreground" />
              <span className="font-bold text-xl text-foreground">Unreal Eye</span>
            </Link>
             <div className="hidden sm:flex items-center gap-2">
                <Link href="/" className="bg-foreground/5 text-foreground px-4 py-2 rounded-full text-sm hover:bg-foreground/10 transition-colors">
                  &larr; Back to Tools
                </Link>
                <ThemeToggle />
             </div>
          </GlassCard>
        </header>

        <main className="mt-32">
          <GlassCard className="p-6 md:p-10">
            <div className="flex flex-col items-center text-center">
              <Shield className="w-16 h-16 text-red-400 animate-pulse" />
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gradient-cyan">
                Emergency Help: Image-Based Abuse
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                If someone has shared or threatened to share an intimate image of you (real or AI-generated) without your consent, you can take action. This is known as Non-Consensual Intimate Imagery (NCII).
              </p>
            </div>

            <div className="my-8 grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-secondary p-6 rounded-3xl flex gap-4">
                  <Lock className="w-10 h-10 text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">Your Privacy is Protected</h3>
                    <p className="text-muted-foreground text-sm">Your images never leave your device. The service creates a secure digital fingerprint (a "hash") on your device to find and remove it, without uploading the image itself.</p>
                  </div>
              </div>
              <div className="bg-secondary p-6 rounded-3xl flex gap-4">
                  <FileCheck className="w-10 h-10 text-cyan-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground">It Covers AI Fakes</h3>
                    <p className="text-muted-foreground text-sm">The law and takedown policies often protect you even if the image is a "deepfake" or digitally altered version of a real person.</p>
                  </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-center mb-6 text-gradient-purple">How to Remove an Image from the Internet</h3>
              <div className="relative grid md:grid-cols-3 gap-8">
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent hidden md:block" />
                 <div className="relative flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-xl mb-3">1</div>
                    <h4 className="font-semibold mb-1">Preserve Evidence</h4>
                    <p className="text-sm text-muted-foreground">Take a screenshot of where the image is posted. This is for your records and potential legal action.</p>
                 </div>
                 <div className="relative flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-xl mb-3">2</div>
                    <h4 className="font-semibold mb-1">Generate a Hash</h4>
                    <p className="text-sm text-muted-foreground">Use the free tool at StopNCII.org. Click below to go to their secure website and follow the instructions to create a case.</p>
                 </div>
                 <div className="relative flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center font-bold text-xl mb-3">3</div>
                    <h4 className="font-semibold mb-1">Track Progress</h4>
                    <p className="text-sm text-muted-foreground">StopNCII.org works with participating tech companies to find and remove the image across their platforms.</p>
                 </div>
              </div>
            </div>

            <div className="mt-12 max-w-lg mx-auto">
              <SwipeButton
                href="https://stopncii.org/"
                text="Swipe to Get Help at StopNCII.org"
              />
            </div>
          </GlassCard>
        </main>
        
        <footer className="text-center py-16 text-muted-foreground text-sm">
          © 2026 Unreal Eye. All Rights Reserved.
        </footer>
      </div>
    </>
  );
}
