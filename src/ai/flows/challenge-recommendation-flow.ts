'use server';

/**
 * @fileOverview A conversational flow for challenging and validating an AI-generated project proposal.
 *
 * - challengeRecommendation - A function that handles the conversational validation.
 * - ChallengeRecommendationInput - The input type.
 * - ChallengeRecommendationOutput - The output type.
 * - ConversationTurn - A type for a single turn in the conversation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ConversationTurnSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ConversationTurn = z.infer<typeof ConversationTurnSchema>;

export const ChallengeRecommendationInputSchema = z.object({
  clientData: z.string(),
  vendorQuotes: z.string(),
  logisticalConfigurations: z.string(),
  costModelConfigurations: z.string(),
  strategyAAnalysis: z.string(),
  strategyBAnalysis: z.string(),
  billOfMaterials: z.string(),
  initialRecommendation: z.string(),
  conversationHistory: z.array(ConversationTurnSchema),
});
export type ChallengeRecommendationInput = z.infer<typeof ChallengeRecommendationInputSchema>;

export const ChallengeRecommendationOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s challenging question.'),
});
export type ChallengeRecommendationOutput = z.infer<typeof ChallengeRecommendationOutputSchema>;


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
