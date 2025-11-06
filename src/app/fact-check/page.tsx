'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { factCheck, type FactCheckResponse } from '@/ai/flows/fact-check-flow';

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


export default function FactCheckPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FactCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResults(null);
    setError(null);

    try {
      const response = await factCheck({ query });
      setResults(response);
       if (response.status === 'error') {
        setError(response.notes || 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching fact-checks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(new MouseEvent('click') as unknown as React.FormEvent);
  }

  return (
    <>
      <div className="grid-bg"></div>
      
      <div className="container">
        <header className="flex justify-between items-center py-4">
          <div className="logo">
            <Link href="/">
              <Image src="https://i.postimg.cc/9F6mLw7z/Picsart-25-11-01-16-11-00-382.png" alt="Logo" width={50} height={50} className="w-10 h-10 md:w-12 md:h-12" />
              <span className="logo-text logo-text-gradient">Unreal Eye</span>
            </Link>
          </div>
        </header>

        <main>
          <section className="fact-check-section">
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
                  placeholder="e.g., 'covid 25'"
                  className="fact-check-input"
                />
                <Button type="submit" className="fact-check-button" disabled={isLoading}>
                  <Search />
                </Button>
              </form>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center mt-8">
                <div className="scanner">
                  <div className="scanner-ring"></div>
                  <div className="scanner-ring"></div>
                  <div className="scanner-core"></div>
                </div>
              </div>
            )}

            {error && <p className="text-center text-red-500 mt-8">{error}</p>}
            
            {results && results.status === 'ok' && (
              <div className="fact-check-results mt-8">
                <div className="grid gap-4">
                  {results.results.map((result) => (
                    <ClaimReviewCard key={result.id} result={result} />
                  ))}
                </div>
              </div>
            )}
            
            {results && results.status === 'no_results' && (
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

          </section>
        </main>

        <footer>
          © 2025 Unreal Eye
        </footer>
      </div>
    </>
  );
}
