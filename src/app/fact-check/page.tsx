'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { factCheck, type FactCheckResponse, type Claim } from '@/ai/flows/fact-check-flow';

function ClaimReviewCard({ claim }: { claim: Claim }) {
  const claimReview = claim.claimReview[0];
  const publisher = claimReview.publisher;
  const rating = claimReview.textualRating;

  return (
    <Card className="fact-check-card">
      <CardHeader>
        <CardTitle className="text-lg">{claim.text}</CardTitle>
        <CardDescription>
          Claim by: {claim.claimant || 'Unknown'} | Reviewed on: {new Date(claimReview.reviewDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="fact-check-rating">
          <p>Rating from <a href={publisher.site} target="_blank" rel="noopener noreferrer" className="font-bold underline">{publisher.name}</a>:</p>
          <p className="rating-text" data-rating={rating.toLowerCase().replace(/ /g, '-')}>{rating}</p>
        </div>
        <a href={claimReview.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline">
          Read the full fact-check
        </a>
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
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching fact-checks. Please ensure your API key is configured correctly.');
    } finally {
      setIsLoading(false);
    }
  };

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
            
            {results && (
              <div className="fact-check-results mt-8">
                {results.claims && results.claims.length > 0 ? (
                  <div className="grid gap-4">
                    {results.claims.map((claim, index) => (
                      <ClaimReviewCard key={index} claim={claim} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-text-secondary mt-8">No fact-checks found for your query.</p>
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
