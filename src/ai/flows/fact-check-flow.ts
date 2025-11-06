'use server';
/**
 * @fileOverview A flow for interacting with the Google Fact Check API.
 * 
 * - factCheck - A function to search for fact checks.
 * - FactCheckInput - The input type for the factCheck function.
 * - FactCheckResponse - The return type for the factCheck function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FactCheckInputSchema = z.object({
  query: z.string().describe("The user's search query for a fact check."),
});
export type FactCheckInput = z.infer<typeof FactCheckInputSchema>;

const FactCheckResultSchema = z.object({
  id: z.string().describe("A unique identifier for the result, typically the review URL."),
  title: z.string().describe("The title of the fact-check article."),
  claim: z.string().describe("The original claim being checked."),
  verdict: z.string().describe("The rating or verdict, like 'True', 'False', or 'Misleading'."),
  confidence: z.number().describe("A confidence score, currently not implemented and set to 0."),
  explanation: z.string().describe("A short summary of the fact-check."),
  publisher: z.object({
    name: z.string(),
    site_url: z.string().url(),
  }),
  published_date: z.string().describe("The publication date of the review in YYYY-MM-DD format."),
  claim_review_url: z.string().url().describe("The direct URL to the fact-check article."),
});

const FactCheckResponseSchema = z.object({
  query_used: z.string(),
  status: z.enum(["ok", "no_results", "error"]),
  results: z.array(FactCheckResultSchema),
  suggestions: z.array(z.string()).optional(),
  notes: z.string().optional(),
});
export type FactCheckResponse = z.infer<typeof FactCheckResponseSchema>;


export async function factCheck(input: FactCheckInput): Promise<FactCheckResponse> {
  return factCheckFlow(input);
}


// Internal Zod schemas for parsing the raw Google API response
const GooglePublisherSchema = z.object({
  name: z.string(),
  site: z.string().url(),
});

const GoogleClaimReviewSchema = z.object({
  publisher: GooglePublisherSchema,
  url: z.string().url(),
  title: z.string(),
  reviewDate: z.string(),
  textualRating: z.string(),
  languageCode: z.string(),
});

const GoogleClaimSchema = z.object({
  text: z.string(),
  claimant: z.string().optional(),
  claimDate: z.string(),
  claimReview: z.array(GoogleClaimReviewSchema),
});
export type Claim = z.infer<typeof GoogleClaimSchema>;

const GoogleFactCheckResponseSchema = z.object({
  claims: z.array(GoogleClaimSchema).optional(),
  nextPageToken: z.string().optional(),
});

const factCheckFlow = ai.defineFlow(
  {
    name: 'factCheckFlow',
    inputSchema: FactCheckInputSchema,
    outputSchema: FactCheckResponseSchema,
  },
  async ({ query }) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("Google API key not found. Please set GOOGLE_API_KEY in your .env file.");
    }
    
    // Pre-process query
    let processedQuery = query;
    if (query.trim().split(/\s+/).length <= 2) {
      processedQuery = `fact check ${query}`;
    }

    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(processedQuery)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        return {
          query_used: processedQuery,
          status: "error",
          results: [],
          notes: `API request failed with status ${response.status}: ${errorData.error.message}`,
        };
      }
      
      const data = await response.json();
      const validatedData = GoogleFactCheckResponseSchema.parse(data);

      if (!validatedData.claims || validatedData.claims.length === 0) {
        
        const suggestionPrompt = await ai.generate({
            prompt: `A user searched for a fact check with the query "${query}" and got no results. Provide 3 diverse and helpful alternative search queries they could try. The suggestions should be short and to the point. Return them as a JSON array of strings. Example: ["alternate query 1", "alternate query 2", "alternate query 3"]`,
            format: 'json'
        });
        const suggestions = suggestionPrompt.json() || [];

        return {
          query_used: processedQuery,
          status: "no_results",
          results: [],
          suggestions: suggestions as string[],
          notes: "No claims found for the given query.",
        };
      }
      
      const results = validatedData.claims
        .flatMap(claim => 
          claim.claimReview.map(review => ({
            id: review.url,
            title: review.title,
            claim: claim.text,
            verdict: review.textualRating,
            confidence: 0.0, // Not provided by API
            explanation: `Claim by ${claim.claimant || 'Unknown'}.`,
            publisher: {
              name: review.publisher.name,
              site_url: review.publisher.site,
            },
            published_date: new Date(review.reviewDate).toISOString().split('T')[0],
            claim_review_url: review.url,
          }))
        )
        // Deduplicate and limit results
        .filter((value, index, self) => self.findIndex(v => v.id === value.id) === index)
        .slice(0, 10);
        

      return {
        query_used: processedQuery,
        status: "ok",
        results: results,
        notes: `Found ${validatedData.claims.length} claims. Displaying ${results.length} unique reviews.`,
      };

    } catch (error) {
      console.error("Error in factCheckFlow:", error);
       return {
        query_used: processedQuery,
        status: "error",
        results: [],
        notes: error instanceof Error ? error.message : "An unknown error occurred.",
      };
    }
  }
);
