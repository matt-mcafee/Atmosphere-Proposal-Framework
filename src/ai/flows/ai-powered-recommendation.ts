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
  strategyAAnalysis: z.string().describe('Analysis of Strategy A, a speed-based deployment scenario. This may include sub-scenarios (e.g., Accelerated, Balanced, Sequential).'),
  strategyBAnalysis: z.string().describe('Analysis of Strategy B, an optimized logistical deployment scenario. This focuses on cost-efficiency and operational constraints.'),
  scope: z.string().describe('Defines what is included and excluded in the project.'),
  assumptions: z.string().describe('Lists everything held to be true for the estimate to be valid.'),
  risks: z.string().describe('Identifies potential problems and uncertainties.'),
  knowns: z.string().describe('Captures hard facts and concrete data.'),
  dependencies: z.string().describe('Lists everything the project needs from other teams or systems.'),
  estimate: z.string().describe('The user-formulated estimate, including range and confidence level.'),
});

export type AiPoweredRecommendationInput = z.infer<typeof AiPoweredRecommendationInputSchema>;

const AiPoweredRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('A detailed recommendation and executive summary explaining the best costing and approach. Justify the choice between Strategy A and Strategy B.'),
  recommendedStrategy: z.enum(['Strategy A', 'Strategy B']).describe('The recommended strategy: either Strategy A or Strategy B.'),
  estimatedCost: z.number().describe('The estimated cost for the recommended strategy.'),
  keyFactors: z.string().describe('A brief summary of the key factors influencing the recommendation (e.g., cost savings, timeline, operational simplicity).'),
});

export type AiPoweredRecommendationOutput = z.infer<typeof AiPoweredRecommendationOutputSchema>;

export async function aiPoweredRecommendation(input: AiPoweredRecommendationInput): Promise<AiPoweredRecommendationOutput> {
  return aiPoweredRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredRecommendationPrompt',
  input: {schema: AiPoweredRecommendationInputSchema},
  output: {schema: AiPoweredRecommendationOutputSchema},
  prompt: `You are an expert project management consultant specializing in optimizing project costs and logistical efficiency for large-scale technology rollouts. Your task is to provide a comprehensive executive summary and recommendation based on two proposed deployment strategies.

Analyze all the provided information, including the qualitative inputs from the Estimating Canvas, to determine which strategy offers the best value proposition. Your summary should be clear, concise, and justify your choice.

**Core Project & Financial Data:**
- Client Data: {{{clientData}}}
- Vendor Quotes: {{{vendorQuotes}}}
- Logistical Configurations: {{{logisticalConfigurations}}}
- Cost Model Configurations: {{{costModelConfigurations}}}

**Estimating Canvas (Qualitative Inputs):**
- Scope & Boundaries: {{{scope}}}
- Assumptions: {{{assumptions}}}
- Risks & Uncertainties: {{{risks}}}
- Knowns & Data: {{{knowns}}}
- Dependencies: {{{dependencies}}}
- User's Preliminary Estimate: {{{estimate}}}

**Strategies for Analysis:**
- **Strategy A (Speed-Based Deployment):** {{{strategyAAnalysis}}}
- **Strategy B (Optimized Logistical Deployment):** {{{strategyBAnalysis}}}

**Your Task:**
1.  Write a detailed executive summary that introduces the project and the two strategies. Incorporate insights from the Estimating Canvas inputs to add depth to your analysis.
2.  Compare the pros and cons of each strategy (e.g., cost, speed, complexity), considering the stated risks and assumptions.
3.  Select the best strategy (Strategy A or Strategy B) and clearly state your recommendation.
4.  Provide an estimated total cost for your recommended strategy.
5.  Summarize the key factors that led to your decision, referencing the qualitative data where appropriate.
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
