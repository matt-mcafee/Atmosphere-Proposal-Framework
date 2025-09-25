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
  prompt: `You are an expert project management consultant acting as a "red team" to challenge and validate a project proposal. A user will ask you questions to probe for weaknesses or inaccuracies.

Your first job is to provide critical, insightful, and helpful answers based on ALL the context provided.

Your second job is to identify when a user is explicitly asking for a change to a configuration parameter. For example, "What if we change PM overhead to 15%?" or "Set the technician rate to $85/hour."

If you detect a request to change a value, you MUST populate the 'updatedConfig' object in your output with the new values. Only include the fields that are being changed. The frontend will use this to update the state. Announce the change you are making in your response.

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

Based on the final user question in the conversation history, provide a direct and concise response, and update the config if requested.
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
