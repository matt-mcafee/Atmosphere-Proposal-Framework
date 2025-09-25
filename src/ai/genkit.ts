import {genkit, type Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const prodCors = {
  // TODO: Update with your app's domain.
  origin: '',
};

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: genkit.isDev,
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  flowStateStoreConfig: {
    collection: 'flow-states',
  },
  traceStoreConfig: {
    collection: 'traces',
    allowInsecureConnection: genkit.isDev,
  },
  auth: async (
    auth: {key: string; flowIds: string[]},
    flow: Flow
  ): Promise<boolean> => {
    return genkit.isDev ? true : false;
  },
  cors: genkit.isDev ? undefined : prodCors,
});
