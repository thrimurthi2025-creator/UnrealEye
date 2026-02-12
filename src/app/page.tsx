'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, Search, ArrowRight, X, ScanLine, FileText, Shield, Code, Bot, BrainCircuit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader } from '@/components/ui/loader';

type ClaimReview = {
  publisher: { name: string; site: string; };
  url: string;
  title: string;
  reviewDate: string;
  textualRating: string;
};

type Claim = {
  text: string;
  claimant: string;
  claimDate: string;
  claimReview: ClaimReview[];
};

function ClaimReviewCard({ claim }: { claim: Claim }) {
  const review = claim.claimReview?.[0];
  if (!review) return null;

  const { title, textualRating, publisher, url, reviewDate } = review;

  const getRatingColor = (rating: string) => {
    const lowerRating = rating.toLowerCase();
    if (['true', 'accurate', 'mostly true'].some(r => lowerRating.includes(r))) return 'text-cyan-400 border-cyan-400/50';
    if (['false', 'inaccurate', 'mostly false', 'misleading'].some(r => lowerRating.includes(r))) return 'text-red-400 border-red-400/50';
    if (['mixture', 'unproven', 'unsupported', 'no consensus'].some(r => lowerRating.includes(r))) return 'text-purple-400 border-purple-400/50';
    return 'text-gray-400 border-gray-400/50';
  }

  return (
    <GlassCard className="p-6 flex flex-col gap-4">
      <h3 className="font-semibold text-lg text-white">"{claim.text}"</h3>
      <div className={cn("p-3 rounded-lg border text-sm", getRatingColor(textualRating))}>
          <span className="font-bold">{textualRating}</span> according to <a href={publisher?.site} target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-white">{publisher?.name}</a>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-2 text-sm">
        Read Full Analysis <ArrowRight className="w-4 h-4" />
      </a>
    </GlassCard>
  );
}


export default function Home() {
  const [query, setQuery] = useState('');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isFactCheckLoading, setIsFactCheckLoading] = useState(false);
  const [factCheckError, setFactCheckError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [activeDetector, setActiveDetector] = useState('image');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsFactCheckLoading(true);
    setFactCheckError(null);
    setClaims([]);
    setHasSearched(true);

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!API_KEY) {
        setFactCheckError("API key is not configured on the server.");
        setIsFactCheckLoading(false);
        return;
    }

    try {
      const response = await fetch(
        `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setClaims(data.claims || []);
    } catch (err: any) {
      setFactCheckError(err.message || 'An error occurred.');
    } finally {
      setIsFactCheckLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setClaims([]);
    setHasSearched(false);
    setFactCheckError(null);
  };
  
  const detectorSrc = activeDetector === 'image'
    ? "https://thrimurthi2025-unrealeyeultra.hf.space"
    : "https://thrimurthi2025-unrealeye-text.hf.space";

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
          <GlassCard className="flex items-center justify-between p-3 rounded-full">
            <Link href="/" className='flex items-center gap-2'>
              <Image src="https://i.postimg.cc/D013wY0c/Picsart-25-11-01-16-11-00-382.png" alt="Logo" width={40} height={40} className="w-10 h-10" />
              <span className="font-bold text-xl text-white">Unreal Eye</span>
            </Link>
            <a href="#tools" className="hidden sm:block bg-white/10 text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-colors">
              Detection Tools
            </a>
          </GlassCard>
        </header>

        <main className="mt-32 space-y-24 md:space-y-32">
          
          {/* Hero Section */}
          <section className="text-center flex flex-col items-center animate-float">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient-cyan">
              Clarity in the Age of AI
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70">
              Advanced neural network forensics to distinguish AI-generated content from reality with crystal clarity and precision.
            </p>
          </section>

          {/* Core Tools Section */}
          <section id="tools" className="space-y-8">
            <h2 className="text-center text-3xl font-bold text-gradient-purple">Core Detection Suite</h2>
            <GlassCard className="p-4 md:p-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                 <button 
                   className={cn('px-4 py-2 rounded-full transition-colors', activeDetector === 'image' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5')}
                   onClick={() => setActiveDetector('image')}
                 >
                   Image Detector
                 </button>
                 <button 
                   className={cn('px-4 py-2 rounded-full transition-colors', activeDetector === 'text' ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5')}
                   onClick={() => setActiveDetector('text')}
                 >
                   Text Detector
                 </button>
              </div>

              <div className="relative min-h-[800px] rounded-4xl overflow-hidden bg-black/20">
                <iframe
                  key={activeDetector}
                  src={detectorSrc}
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </GlassCard>
          </section>

          {/* Fact Check Section */}
          <section className="space-y-8">
            <h2 className="text-center text-3xl font-bold text-gradient-cyan">Global Fact-Check</h2>
            <GlassCard className="p-4 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <Newspaper className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold">Fact Check Search</h3>
                    <p className="text-white/70">Search the public record for fact-checks on news and claims.</p>
                  </div>
                </div>
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-white/50" />
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for articles, topics, or keywords..."
                    className="fact-check-input h-14 pl-12 pr-14 rounded-full w-full"
                    disabled={isFactCheckLoading}
                  />
                  <button
                    type={hasSearched ? "button" : "submit"}
                    onClick={hasSearched ? handleClearSearch : undefined}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    disabled={isFactCheckLoading}
                  >
                    {hasSearched ? <X className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>
             
              {isFactCheckLoading && <div className="flex justify-center py-8"><Loader /></div>}
              {factCheckError && <p className="text-center text-red-400 mt-4">{factCheckError}</p>}
              
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {claims.map((claim, index) => (
                    <ClaimReviewCard key={`${claim.claimReview[0]?.url || index}`} claim={claim} />
                  ))}
                  {hasSearched && !isFactCheckLoading && claims.length === 0 && !factCheckError && (
                    <div className="text-center py-8 col-span-full">
                      <p className="text-white/50">No fact-checks found for your query.</p>
                    </div>
                  )}
              </div>
            </GlassCard>
          </section>

          {/* Emergency Help Section */}
          <section>
            <Link href="/emergency-help" className="block">
              <GlassCard className="p-8 flex flex-col justify-center items-center text-center border-red-500/50 hover:border-red-500/80">
                <Shield className="w-12 h-12 text-red-400 animate-pulse"/>
                <h3 className="mt-4 text-xl font-bold text-red-400">Emergency Help Center</h3>
                <p className="mt-2 text-white/60">If you are a victim of image-based abuse, get help here.</p>
                <ArrowRight className="mt-4 w-6 h-6 text-red-400" />
              </GlassCard>
            </Link>
          </section>

          {/* Features Section */}
          <section>
            <GlassCard className="p-8 space-y-6">
                <h3 className="text-xl font-bold text-gradient-purple text-center">Our Technology</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex gap-4">
                    <BrainCircuit className="w-8 h-8 text-purple-400" />
                    <div>
                      <h4 className="font-semibold">Real-Time Analysis</h4>
                      <p className="text-sm text-white/60">GPU-accelerated inference for millisecond processing.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Bot className="w-8 h-8 text-purple-400" />
                    <div>
                      <h4 className="font-semibold">High Accuracy</h4>
                      <p className="text-sm text-white/60">Trained on millions of diverse data samples.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Code className="w-8 h-8 text-purple-400" />
                    <div>
                      <h4 className="font-semibold">Privacy First</h4>
                      <p className="text-sm text-white/60">Zero data retention. All processing happens in-memory.</p>
                    </div>
                  </div>
                   <div className="flex gap-4">
                    <Shield className="w-8 h-8 text-purple-400" />
                    <div>
                      <h4 className="font-semibold">Disclaimer</h4>
                      <p className="text-sm text-white/60">AI detection is a tool, not a guarantee. Use with discretion.</p>
                    </div>
                  </div>
                </div>
            </GlassCard>
          </section>

        </main>

        <footer className="text-center py-16 text-white/40 text-sm">
          © 2025 Unreal Eye. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}
