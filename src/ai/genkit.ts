import {genkit, type Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const prodCors = {
  // TODO: Update with your app's domain.
  origin: '',
};

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyDgeVeksbDDCLGm-Oizc_E8sqGLY7x_p10'})],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: process.env.NODE_ENV === 'development',
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  flowStateStoreConfig: {
    collection: 'flow-states',
  },
  traceStoreConfig: {
    collection: 'traces',
    allowInsecureConnection: process.env.NODE_ENV === 'development',
  },
  auth: async (
    auth: {key: string; flowIds: string[]},
    flow: Flow
  ): Promise<boolean> => {
    return process.env.NODE_ENV === 'development' ? true : false;
  },
  cors: process.env.NODE_ENV === 'development' ? undefined : prodCors,
});
