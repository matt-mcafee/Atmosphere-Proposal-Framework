import {genkit, type Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {isDev} from 'genkit/dev';

const prodCors = {
  // TODO: Update with your app's domain.
  origin: '',
};

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: isDev(),
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  flowStateStoreConfig: {
    collection: 'flow-states',
  },
  traceStoreConfig: {
    collection: 'traces',
    allowInsecureConnection: isDev(),
  },
  auth: async (
    auth: {key: string; flowIds: string[]},
    flow: Flow
  ): Promise<boolean> => {
    return isDev() ? true : false;
  },
  cors: isDev() ? undefined : prodCors,
});
