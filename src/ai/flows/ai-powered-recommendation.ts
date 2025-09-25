// A Genkit flow that recommends the best costing and approach for a project based on client data, vendor quotes, and logistical configurations.

'use server';

/**
 * @fileOverview AI-powered recommendation flow for project costing and approach.
 *
 * - aiPoweredRecommendation - A function that provides a recommendation of the best costing and approach.
 * - AiPoweredRecommendationInput - The input type for the aiPoweredRecommendation function.
 * - AiPoweredRecommendationOutput - The return type for the aiPoweredRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredRecommendationInputSchema = z.object({
  clientData: z.string().describe('Client-specific information, including pricing agreements and project requirements.'),
  vendorQuotes: z.string().describe('Vendor quotes for materials, equipment, and services.'),
  logisticalConfigurations: z.string().describe('Logistical considerations, such as project location(s), technician availability, and travel constraints.'),
  costModelConfigurations: z.string().describe('Cost model parameters such as labor rates, living expenses, and project management overhead.'),
  strategyAAnalysis: z.string().describe('Analysis of Strategy A deployment scenario'),
  strategyBAnalysis: z.string().describe('Analysis of Strategy B deployment scenario'),
});

export type AiPoweredRecommendationInput = z.infer<typeof AiPoweredRecommendationInputSchema>;

const AiPoweredRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('A detailed recommendation of the best costing and approach, including a justification for the recommendation.'),
  recommendedStrategy: z.enum(['Strategy A', 'Strategy B']).describe('The recommended strategy: either Strategy A or Strategy B.'),
  estimatedCost: z.number().describe('The estimated cost for the recommended strategy.'),
  keyFactors: z.string().describe('Key factors influencing the recommendation.'),
});

export type AiPoweredRecommendationOutput = z.infer<typeof AiPoweredRecommendationOutputSchema>;

export async function aiPoweredRecommendation(input: AiPoweredRecommendationInput): Promise<AiPoweredRecommendationOutput> {
  return aiPoweredRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredRecommendationPrompt',
  input: {schema: AiPoweredRecommendationInputSchema},
  output: {schema: AiPoweredRecommendationOutputSchema},
  prompt: `You are an expert project management consultant specializing in optimizing project costs and logistical efficiency. Based on the information provided, you will analyze the various strategies and recommend the best costing and approach. Provide a detailed explanation of your recommendation, including a justification for your choice and the key factors that influenced your decision.

Client Data: {{{clientData}}}
Vendor Quotes: {{{vendorQuotes}}}
Logistical Configurations: {{{logisticalConfigurations}}}
Cost Model Configurations: {{{costModelConfigurations}}}
Strategy A Analysis: {{{strategyAAnalysis}}}
Strategy B Analysis: {{{strategyBAnalysis}}}

Consider factors such as total cost, project duration, logistical complexity, and potential risks when formulating your recommendation. Select the most appropriate strategy (Strategy A or Strategy B) and provide an estimated cost for the recommended approach.
`,
});

const aiPoweredRecommendationFlow = ai.defineFlow(
  {
    name: 'aiPoweredRecommendationFlow',
    inputSchema: AiPoweredRecommendationInputSchema,
    outputSchema: AiPoweredRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
