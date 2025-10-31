'use server';

/**
 * @fileOverview Flow for analyzing an uploaded image to determine the likelihood it was AI-generated.
 *
 * - analyzeUploadedImage - Analyzes the image and returns the likelihood of it being AI-generated.
 * - AnalyzeUploadedImageInput - Input type for the analyzeUploadedImage function.
 * - AnalyzeUploadedImageOutput - Return type for the analyzeUploadedImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AnalyzeUploadedImageInput = z.infer<typeof AnalyzeUploadedImageInputSchema>;

const AnalyzeUploadedImageOutputSchema = z.object({
  isAiGenerated: z.boolean().describe('The likelihood that the image was AI-generated.'),
  confidence: z
    .number()
    .describe('The confidence level of the AI determination, from 0 to 1.'),
});
export type AnalyzeUploadedImageOutput = z.infer<typeof AnalyzeUploadedImageOutputSchema>;

export async function analyzeUploadedImage(
  input: AnalyzeUploadedImageInput
): Promise<AnalyzeUploadedImageOutput> {
  return analyzeUploadedImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUploadedImagePrompt',
  input: {schema: AnalyzeUploadedImageInputSchema},
  output: {schema: AnalyzeUploadedImageOutputSchema},
  prompt: `You are an AI image detection expert. Analyze the provided image and determine the likelihood that it was AI-generated. Return a boolean value for isAiGenerated, and a confidence level between 0 and 1.

Image: {{media url=photoDataUri}}`,
});

const analyzeUploadedImageFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedImageFlow',
    inputSchema: AnalyzeUploadedImageInputSchema,
    outputSchema: AnalyzeUploadedImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
