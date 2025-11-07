'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, Search, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EmergencyCardLink } from '@/app/emergency-card-link';
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
    // Fallback timer in case the 'load' event doesn't fire
    const timer = setTimeout(handleLoad, 5000); 

    return () => {
      currentRef?.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, [ref, props]);

  // The `key` prop is crucial here to force re-mounting when the src changes
  return <gradio-app {...props} ref={ref}></gradio-app>;
};


function ClaimReviewCard({ claim }: { claim: Claim }) {
  const review = claim.claimReview?.[0];
  if (!review) return null;

  const { title, textualRating, publisher, url, reviewDate } = review;

  const getRatingClass = (rating: string) => {
    const lowerRating = rating.toLowerCase();
    if (['true', 'accurate', 'mostly true'].some(r => lowerRating.includes(r))) return 'true';
    if (['false', 'inaccurate', 'mostly false', 'misleading'].some(r => lowerRating.includes(r))) return 'false';
    if (['mixture', 'unproven', 'unsupported', 'no consensus'].some(r => lowerRating.includes(r))) return 'mixture';
    return '';
  }

  return (
    <Card className="fact-check-card">
      <CardHeader>
        <CardTitle className="text-lg">{title || 'Claim'}</CardTitle>
        <CardDescription>
          "{claim.text}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="fact-check-rating" data-rating={getRatingClass(textualRating)}>
          <p>Rating from <a href={publisher?.site} target="_blank" rel="noopener noreferrer" className="font-bold underline">{publisher?.name || 'Unknown Publisher'}</a>:</p>
          <p className="rating-text">{textualRating}</p>
        </div>
         <div className="flex justify-between items-center text-sm">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            Read the full fact-check
          </a>
          <span className="text-text-secondary">{new Date(reviewDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isFactCheckLoading, setIsFactCheckLoading] = useState(false);
  const [factCheckError, setFactCheckError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  const [isDetectorLoading, setIsDetectorLoading] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [activeDetector, setActiveDetector] = useState('image');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStatusClick = () => {
    if (!isDetectorLoading) {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 1000); 
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsFactCheckLoading(true);
    setFactCheckError(null);
    setClaims([]);
    setHasSearched(true);

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!API_KEY) {
        setFactCheckError("API key not configured. The site administrator needs to configure this feature.");
        setIsFactCheckLoading(false);
        return;
    }

    try {
      const response = await fetch(
        `https://factchecktools.googleapis.com/v1alpha1/claims:search?key=${API_KEY}&query=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setClaims(data.claims || []);
    } catch (err: any) {
      console.error(err);
      setFactCheckError(err.message || 'An error occurred while fetching fact-checks.');
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
    ? "https://thrimurthi2025-unrealeye.hf.space"
    : "https://thrimurthi2025-unrealeye-text.hf.space";

  return (
    <>
      <div className={`grid-bg ${isBlinking ? 'blinking' : ''}`}></div>
      
      <div className={`container ${isBlinking ? 'blinking' : ''}`}>
        <header className="flex justify-between items-center py-4">
          <div className="logo">
            <Link href="/" className='flex items-center gap-3'>
              <Image src="https://i.postimg.cc/9F6mLw7z/Picsart-25-11-01-16-11-00-382.png" alt="Logo" width={50} height={50} className="w-10 h-10 md:w-12 md:h-12" />
              <span className="logo-text logo-text-gradient">Unreal Eye</span>
            </Link>
          </div>
        </header>

        <main className="space-y-8">
           <div className={`main-card ${isDetectorLoading ? 'offline' : ''} ${isBlinking ? 'blinking' : ''}`}>
            <div className="card-header">
              <div className="flex items-center gap-2">
                 <button 
                   className={`detector-tab-button ${activeDetector === 'image' ? 'active' : ''}`}
                   onClick={() => {
                     setActiveDetector('image');
                     setIsDetectorLoading(true);
                   }}
                 >
                   Image Detector
                 </button>
                 <button 
                   className={`detector-tab-button ${activeDetector === 'text' ? 'active' : ''}`}
                   onClick={() => {
                     setActiveDetector('text');
                     setIsDetectorLoading(true);
                   }}
                 >
                   Text Detector
                 </button>
              </div>
              <div 
                className={isDetectorLoading ? "status-badge offline" : "status-badge"}
                onClick={handleStatusClick}
                style={{ cursor: isDetectorLoading ? 'default' : 'pointer' }}
              >
                <span className="status-dot"></span>
                <span>{isDetectorLoading ? 'SYSTEM OFFLINE' : 'SYSTEM ONLINE'}</span>
              </div>
            </div>

            <div className="detector-wrapper">
              <div className="scan-lines"></div>
              
              <div id="loadingOverlay" className={`loading-overlay ${!isDetectorLoading ? 'hidden' : ''}`}>
                  <Loader />
              </div>
              
              {isClient && (
                <GradioApp 
                  key={activeDetector}
                  src={detectorSrc}
                  onLoad={() => setIsDetectorLoading(false)}
                />
              )}
            </div>
          </div>

          <EmergencyCardLink />

          <div className="fact-check-section">
             <div className="fact-check-search-card">
              <div className="flex items-start gap-4 mb-4">
                <Newspaper className="w-8 h-8 text-accent-cyan flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold">Fact Check Search</h2>
                  <p className="text-text-secondary">Search for fact-checks on news and claims.</p>
                </div>
              </div>
              <form onSubmit={handleSearch} className="fact-check-form">
                <Search className="w-5 h-5 fact-check-input-icon" />
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for articles, topics, or keywords..."
                  className="fact-check-input"
                  disabled={isFactCheckLoading}
                />
                <button
                  type={hasSearched ? "button" : "submit"}
                  onClick={hasSearched ? handleClearSearch : undefined}
                  className={cn("fact-check-button", { "fact-check-button-clear": hasSearched })}
                  disabled={isFactCheckLoading}
                >
                  {hasSearched ? <X className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>

            {isFactCheckLoading && (
               <div className="flex justify-center items-center mt-8">
                 <Loader />
               </div>
            )}

            {factCheckError && <p className="text-center text-red-500 mt-8">{factCheckError}</p>}
            
            <div className="fact-check-results mt-8">
                {claims.length > 0 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {claims.map((claim, index) => (
                      <ClaimReviewCard key={`${claim.claimReview[0]?.url || index}`} claim={claim} />
                    ))}
                  </div>
                )}
                
                {hasSearched && !isFactCheckLoading && claims.length === 0 && !factCheckError && (
                  <div className="text-center mt-8 p-6 bg-bg-secondary border border-border rounded-lg">
                    <p className="text-text-secondary">No fact-checks found for your query.</p>
                  </div>
                )}
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
