'use server';
/**
 * @fileOverview This flow generates a bill of materials from a PDF drawing.
 *
 * - generateBillOfMaterialsFromDrawing - A function that takes a PDF drawing (as a data URI) and returns a bill of materials.
 * - GenerateBillOfMaterialsFromDrawingInput - The input type for the generateBillOfMaterialsFromDrawing function.
 * - GenerateBillOfMaterialsFromDrawingOutput - The return type for the generateBillOfMaterialsFromDrawing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBillOfMaterialsFromDrawingInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF drawing, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateBillOfMaterialsFromDrawingInput = z.infer<typeof GenerateBillOfMaterialsFromDrawingInputSchema>;

const GenerateBillOfMaterialsFromDrawingOutputSchema = z.object({
  billOfMaterials: z.string().describe('The generated bill of materials.'),
});
export type GenerateBillOfMaterialsFromDrawingOutput = z.infer<typeof GenerateBillOfMaterialsFromDrawingOutputSchema>;

export async function generateBillOfMaterialsFromDrawing(input: GenerateBillOfMaterialsFromDrawingInput): Promise<GenerateBillOfMaterialsFromDrawingOutput> {
  return generateBillOfMaterialsFromDrawingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBillOfMaterialsFromDrawingPrompt',
  input: {schema: GenerateBillOfMaterialsFromDrawingInputSchema},
  output: {schema: GenerateBillOfMaterialsFromDrawingOutputSchema},
  prompt: `You are an expert project estimator. Based on the provided PDF drawing, generate a detailed bill of materials including all components and their quantities. Use your knowledge of construction, electrical and plumbing systems to identify the components. Be as accurate as possible with quantities. Include manufacturer if discernable.

PDF Drawing: {{media url=pdfDataUri}}`,
});

const generateBillOfMaterialsFromDrawingFlow = ai.defineFlow(
  {
    name: 'generateBillOfMaterialsFromDrawingFlow',
    inputSchema: GenerateBillOfMaterialsFromDrawingInputSchema,
    outputSchema: GenerateBillOfMaterialsFromDrawingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
