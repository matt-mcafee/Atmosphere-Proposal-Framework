import {genkit, type Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const prodCors = {
  // TODO: Update with your app's domain.
  origin: '',
};

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY_HERE'})],
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
