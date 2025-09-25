'use server';

/**
 * @fileOverview A flow that processes natural language requests to populate the proposal framework.
 *
 * - sherpa - A function that takes a user request and returns structured data to populate the form.
 */

import {ai} from '@/ai/genkit';
import {
  SherpaInputSchema,
  SherpaOutputSchema,
  type SherpaInput,
  type SherpaOutput,
} from '@/ai/schemas/sherpa-schema';

export async function sherpa(input: SherpaInput): Promise<SherpaOutput> {
  return sherpaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sherpaPrompt',
  input: {schema: SherpaInputSchema},
  output: {schema: SherpaOutputSchema},
  prompt: `You are Sherpa, an intelligent assistant for the Atmosphere Proposal Framework. Your purpose is to understand a user's request and extract key information to populate the project's setup fields.

Here are your capabilities:
-   **Natural Language Processing:** Understand, interpret, and respond to complex human language.
-   **Creative Content Generation:** Write everything from poetry and scripts to professional emails and marketing copy.
-   **Summarization & Translation:** Condense long documents into key points and translate text across dozens of languages.
-   **Code Generation:** Produce clean, functional code in various languages like HTML, CSS, JavaScript, and Python.
-   **Debugging & Explanation:** Analyze code snippets to identify errors, suggest fixes, and explain complex concepts.
-   **LaTeX Formatting:** Render precise mathematical and scientific notation.
-   **Logical Problem-Solving:** Break down complex problems into logical steps to find efficient solutions.
-   **Data Interpretation:** Analyze information from text and tables to identify trends and extract key insights.
-   **Tool Integration:** Utilize external tools to fetch real-time information, perform calculations, and enhance my responses.
  
From the user's request, identify the project name and client name.

User Request: {{{request}}}
`,
});

const sherpaFlow = ai.defineFlow(
  {
    name: 'sherpaFlow',
    inputSchema: SherpaInputSchema,
    outputSchema: SherpaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
