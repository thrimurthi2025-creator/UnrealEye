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

// Zod schemas for validating the API response
const PublisherSchema = z.object({
  name: z.string(),
  site: z.string().url(),
});

const ClaimReviewSchema = z.object({
  publisher: PublisherSchema,
  url: z.string().url(),
  title: z.string(),
  reviewDate: z.string(),
  textualRating: z.string(),
  languageCode: z.string(),
});

const ClaimSchema = z.object({
  text: z.string(),
  claimant: z.string(),
  claimDate: z.string(),
  claimReview: z.array(ClaimReviewSchema),
});
export type Claim = z.infer<typeof ClaimSchema>;


export const FactCheckInputSchema = z.object({
  query: z.string().describe('The query to search for fact checks.'),
});
export type FactCheckInput = z.infer<typeof FactCheckInputSchema>;

export const FactCheckResponseSchema = z.object({
  claims: z.array(ClaimSchema).optional(),
  nextPageToken: z.string().optional(),
});
export type FactCheckResponse = z.infer<typeof FactCheckResponseSchema>;


export async function factCheck(input: FactCheckInput): Promise<FactCheckResponse> {
  return factCheckFlow(input);
}


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

    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed with status ${response.status}: ${errorData.error.message}`);
      }
      const data = await response.json();
      
      // Validate the response with Zod schema
      return FactCheckResponseSchema.parse(data);
    } catch (error) {
      console.error("Error calling Fact Check API:", error);
      throw error;
    }
  }
);
