import { config } from 'dotenv';
config();

import '@/ai/flows/generate-bill-of-materials-from-drawing.ts';
import '@/ai/flows/ai-powered-recommendation.ts';
import '@/ai/flows/estimate-travel-costs.ts';