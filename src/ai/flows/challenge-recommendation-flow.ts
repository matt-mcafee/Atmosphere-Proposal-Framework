'use server';

/**
 * @fileOverview A conversational flow for challenging and validating an AI-generated project proposal.
 *
 * - challengeRecommendation - A function that handles the conversational validation.
 */

import { ai } from '@/ai/genkit';
import {
  ChallengeRecommendationInputSchema,
  ChallengeRecommendationOutputSchema,
  type ChallengeRecommendationInput,
  type ChallengeRecommendationOutput,
} from '@/ai/schemas/challenge-recommendation-schema';


export async function challengeRecommendation(input: ChallengeRecommendationInput): Promise<ChallengeRecommendationOutput> {
  return challengeRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'challengeRecommendationPrompt',
  input: { schema: ChallengeRecommendationInputSchema },
  output: { schema: ChallengeRecommendationOutputSchema },
  prompt: `You are an expert project management consultant acting as a "red team" to challenge and validate a project proposal. A user will ask you questions to probe for weaknesses or inaccuracies in the proposal. Your job is to provide critical, insightful, and helpful answers based on ALL the context provided. If the user's challenge is valid, acknowledge it. If it is not, explain why with data from the context.

**Project Context:**
- Client Data: {{{clientData}}}
- Vendor Quotes: {{{vendorQuotes}}}
- Logistical Configurations: {{{logisticalConfigurations}}}
- Cost Model Configurations: {{{costModelConfigurations}}}
- Bill of Materials: {{{billOfMaterials}}}
- Strategy A Analysis: {{{strategyAAnalysis}}}
- Strategy B Analysis: {{{strategyBAnalysis}}}
- Initial AI Recommendation: {{{initialRecommendation}}}

**Conversation History:**
{{#each conversationHistory}}
- {{role}}: {{{content}}}
{{/each}}

Based on the final user question in the conversation history, provide a direct and concise response.
`,
});

const challengeRecommendationFlow = ai.defineFlow(
  {
    name: 'challengeRecommendationFlow',
    inputSchema: ChallengeRecommendationInputSchema,
    outputSchema: ChallengeRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
