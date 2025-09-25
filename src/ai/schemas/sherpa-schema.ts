import {z} from 'genkit';

export const SherpaInputSchema = z.object({
  request: z.string().describe('The natural language request from the user.'),
});
export type SherpaInput = z.infer<typeof SherpaInputSchema>;

export const SherpaOutputSchema = z.object({
  projectName: z.string().optional().describe('The name of the project.'),
  clientName: z.string().optional().describe('The name of the client.'),
});
export type SherpaOutput = z.infer<typeof SherpaOutputSchema>;
