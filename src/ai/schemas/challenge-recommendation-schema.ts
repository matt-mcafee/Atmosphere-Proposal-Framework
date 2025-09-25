import { z } from 'genkit';

/**
 * @fileOverview Schemas and types for the challenge-recommendation flow.
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
  scope: z.string(),
  assumptions: z.string(),
  risks: z.string(),
  knowns: z.string(),
  dependencies: z.string(),
  estimate: z.string(),
});
export type ChallengeRecommendationInput = z.infer<typeof ChallengeRecommendationInputSchema>;


const UpdatedConfigSchema = z.object({
    onSiteLabor: z.number().optional(),
    technicianRate: z.number().optional(),
    livingExpenses: z.number().optional(),
    pmOverhead: z.number().optional(),
    travelHoursMatrix: z.number().optional(),
    parking: z.number().optional(),
    mealsCost: z.number().optional(),
}).describe('If the user requests a change to a config value, populate this object with the new values.');


export const ChallengeRecommendationOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's challenging question."),
  updatedConfig: UpdatedConfigSchema.optional(),
});
export type ChallengeRecommendationOutput = z.infer<typeof ChallengeRecommendationOutputSchema>;
