'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { factCheck, type FactCheckResponse } from '@/ai/flows/fact-check-flow';

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

function ClaimReviewCard({ result }: { result: FactCheckResponse['results'][0] }) {
  const { title, claim, verdict, publisher, published_date, claim_review_url } = result;

  return (
    <Card className="fact-check-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          "{claim}"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="fact-check-rating" data-rating={verdict.toLowerCase().replace(/ /g, '-')}>
          <p>Rating from <a href={publisher.site_url} target="_blank" rel="noopener noreferrer" className="font-bold underline">{publisher.name}</a>:</p>
          <p className="rating-text">{verdict}</p>
        </div>
         <div className="flex justify-between items-center">
          <a href={claim_review_url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">
            Read the full fact-check
          </a>
          <span className="text-xs text-text-secondary">{new Date(published_date).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FactCheckResponse | null>(null);
  const [isFactCheckLoading, setIsFactCheckLoading] = useState(false);
  const [factCheckError, setFactCheckError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleStatusClick = () => {
    if (!isLoading) {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 1000); // Duration of the blink animation
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsFactCheckLoading(true);
    setResults(null);
    setFactCheckError(null);

    try {
      const response = await factCheck({ query });
      setResults(response);
       if (response.status === 'error') {
        setFactCheckError(response.notes || 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error(err);
      setFactCheckError('An error occurred while fetching fact-checks. Please try again.');
    } finally {
      setIsFactCheckLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(new MouseEvent('click') as unknown as React.FormEvent);
  }

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

        <main>
          <div className={`main-card ${isLoading ? 'offline' : ''} ${isBlinking ? 'blinking' : ''}`}>
            <div className="card-header">
              <h2 className="card-title">Detection Interface</h2>
              <div 
                className={isLoading ? "status-badge offline" : "status-badge"}
                onClick={handleStatusClick}
                style={{ cursor: isLoading ? 'default' : 'pointer' }}
              >
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

            <div className="fact-check-section mt-8">
              <div className="fact-check-search-card">
                <div className="flex items-center gap-4 mb-2">
                  <Newspaper className="w-8 h-8 text-cyan-400" />
                  <div>
                    <h2 className="text-2xl font-bold">Fact Check Search</h2>
                    <p className="text-text-secondary">Search for fact-checks on news and claims</p>
                  </div>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2 mt-4">
                  <Input 
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="fact-check-input"
                  />
                  <Button type="submit" className="fact-check-button" disabled={isFactCheckLoading}>
                    <Search />
                  </Button>
                </form>
              </div>

              {isFactCheckLoading && (
                <div className="flex justify-center items-center mt-8">
                  <div className="scanner">
                    <div className="scanner-ring"></div>
                    <div className="scanner-ring"></div>
                    <div className="scanner-core"></div>
                  </div>
                </div>
              )}

              {factCheckError && <p className="text-center text-red-500 mt-8">{factCheckError}</p>}
              
              {results && (
                <div className="fact-check-results mt-8">
                  {results.status === 'ok' && (
                    <div className="grid gap-4">
                      {results.results.map((result) => (
                        <ClaimReviewCard key={result.id} result={result} />
                      ))}
                    </div>
                  )}
                  
                  {results.status === 'no_results' && (
                    <div className="text-center mt-8 p-6 bg-bg-secondary border border-border rounded-lg">
                      <p className="text-text-secondary">No fact-checks found for your query.</p>
                      {results.suggestions && results.suggestions.length > 0 && (
                        <div className="mt-4">
                          <p className="font-semibold text-text-primary">Did you mean:</p>
                          <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {results.suggestions.map((suggestion, index) => (
                              <Button 
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href="/emergency-help" className="emergency-card-link">
              <span className="border-light top"></span>
              <span className="border-light right"></span>
              <span className="border-light bottom"></span>
              <span className="border-light left"></span>
              <div className="emergency-card-content">
                <span className="emergency-card-icon">🛡️</span>
                <div className="emergency-card-text">
                  <h3 className="emergency-card-title">Emergency Help Center</h3>
                  <p className="emergency-card-desc">If you are a victim of image-based abuse, get help here.</p>
                </div>
              </div>
            </Link>
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
