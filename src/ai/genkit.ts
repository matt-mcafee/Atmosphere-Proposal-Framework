import {genkit, type Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const prodCors = {
  // TODO: Update with your app's domain.
  origin: '',
};

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyDgeVeksbDDCLGm-Oizc_E8sqGLY7x_p10'})],
  model: 'googleai/gemini-2.5-flash',
});
