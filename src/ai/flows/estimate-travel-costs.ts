// estimate-travel-costs.ts
'use server';

/**
 * @fileOverview Estimates travel costs and technician living expenses for multi-location technology rollouts.
 *
 * - estimateTravelCosts - A function that estimates travel costs based on client locations.
 * - EstimateTravelCostsInput - The input type for the estimateTravelCosts function.
 * - EstimateTravelCostsOutput - The return type for the estimateTravelCosts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { calculateTravelCosts } from '@/services/travel-cost-calculator';

const EstimateTravelCostsInputSchema = z.object({
  locationsDataUri: z
    .string()
    .describe(
      "A spreadsheet or CSV file containing client locations, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'.  The file should contain columns for address information such as street, city, state, and zip code."
    ),
  livingExpensePerNight: z.number().describe('The average living expense per night for a technician.'),
  techniciansPerLocation: z.number().describe('The number of technicians required per location.'),
});
export type EstimateTravelCostsInput = z.infer<typeof EstimateTravelCostsInputSchema>;

const EstimateTravelCostsOutputSchema = z.object({
  totalTravelCost: z
    .number()
    .describe('The estimated total travel cost for all technicians across all locations.'),
  totalLivingExpenses: z
    .number()
    .describe('The estimated total living expenses for all technicians across all locations.'),
  optimalRouteSummary: z
    .string()
    .describe('A summary of the optimal travel route, including key locations and estimated travel times.'),
});
export type EstimateTravelCostsOutput = z.infer<typeof EstimateTravelCostsOutputSchema>;

export async function estimateTravelCosts(input: EstimateTravelCostsInput): Promise<EstimateTravelCostsOutput> {
  return estimateTravelCostsFlow(input);
}

const estimateTravelCostsFlow = ai.defineFlow(
  {
    name: 'estimateTravelCostsFlow',
    inputSchema: EstimateTravelCostsInputSchema,
    outputSchema: EstimateTravelCostsOutputSchema,
  },
  async input => {
    // Call the travel cost calculation service
    const calculationResult = await calculateTravelCosts(
      input.locationsDataUri,
      input.livingExpensePerNight,
      input.techniciansPerLocation
    );

    return {
      totalTravelCost: calculationResult.totalTravelCost,
      totalLivingExpenses: calculationResult.totalLivingExpenses,
      optimalRouteSummary: calculationResult.optimalRouteSummary,
    };
  }
);
