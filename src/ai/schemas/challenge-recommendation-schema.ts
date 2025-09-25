import { z } from 'genkit';

/**
 * @fileOverview Schemas and types for the challenge-recommendation flow.
 *
 * - ConversationTurnSchema - A schema for a single turn in the conversation.
 * - ConversationTurn - A type for a single turn in the conversation.
 * - ChallengeRecommendationInputSchema - The input schema for the challengeRecommendation function.
 * - ChallengeRecommendationInput - The input type for the challengeRecommendation function.
 * - ChallengeRecommendationOutputSchema - The output schema for the challengeRecommendation function.
 * - ChallengeRecommendationOutput - The return type for the challengeRecommendation function.
 */

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
