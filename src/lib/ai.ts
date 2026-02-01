// src/lib/ai.ts
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export type SupportedProvider = 'anthropic' | 'openai' | 'google' | 'openrouter';

// Jan 31 2026: Active free models with verified endpoints
export const OPENROUTER_FREE_MODELS = [
  'arcee-ai/trinity-large-preview:free',      // Primary - strong reasoning/creative
  'z.ai/glm-4.5-air:free',                    // Secondary - reliable
  'tngtech/deepseek-r1t2-chimera:free',       // Tertiary - good fallback
  'liquid/lfm-2.5-1.2b-instruct:free',        // Fallback - small/fast
];

export function validateKeys(keys: { anthropic?: string; openai?: string; google?: string; openrouter?: string }) {
  const valid = {
    anthropic: keys.anthropic && keys.anthropic.startsWith('sk-ant'),
    openai: keys.openai && (keys.openai.startsWith('sk-') || keys.openai.startsWith('user-')),
    google: keys.google && keys.google.startsWith('AIza'),
    openrouter: keys.openrouter && keys.openrouter.startsWith('sk-or-'),
  };
  return valid;
}

export function getSmartestModel(keys: {
  anthropic?: string;
  openai?: string;
  google?: string;
  openrouter?: string;
  optimizerPreference?: string; // 'auto', 'claude', 'openai', 'gemini', 'openrouter'
  freeModelPreference?: string; // Specific free model or 'auto'
}) {
  const validity = validateKeys(keys);
  const pref = keys.optimizerPreference || 'auto';

  console.log('[Model Selection] Preference:', pref, 'Validity:', validity);

  // 1. Manual Override
  if (pref === 'claude' && validity.anthropic) return { model: createClaude(keys.anthropic!), provider: 'anthropic' };
  if (pref === 'openai' && validity.openai) return { model: createGPT(keys.openai!), provider: 'openai' };
  if (pref === 'gemini' && validity.google) return { model: createGemini(keys.google!), provider: 'google' };
  if (pref === 'openrouter' && validity.openrouter) {
    const selectedModel = keys.freeModelPreference && keys.freeModelPreference !== 'auto'
      ? keys.freeModelPreference
      : OPENROUTER_FREE_MODELS[0];
    return { model: createOpenRouter(keys.openrouter!, selectedModel), provider: 'openrouter' };
  }

  // 2. Automatic Priority (Paid > Free)

  // Anthropic (Best Prompt Engineering)
  if (validity.anthropic) {
    console.log('Using paid Anthropic key instead of free options.');
    return { model: createClaude(keys.anthropic!), provider: 'anthropic' };
  }

  // OpenAI
  if (validity.openai) {
    console.log('Using paid OpenAI key instead of free options.');
    return { model: createGPT(keys.openai!), provider: 'openai' };
  }

  // Google
  if (validity.google) {
    console.log('Using paid Gemini key instead of free options.');
    return { model: createGemini(keys.google!), provider: 'google' };
  }

  // OpenRouter (Free Fallback)
  if (validity.openrouter) {
    console.log('Using OpenRouter free tier (no paid keys found).');
    const selectedModel = keys.freeModelPreference && keys.freeModelPreference !== 'auto'
      ? keys.freeModelPreference
      : OPENROUTER_FREE_MODELS[0];
    return { model: createOpenRouter(keys.openrouter!, selectedModel), provider: 'openrouter' };
  }

  return null;
}

export function createOpenRouter(apiKey: string, modelId: string) {
  console.log(`Selected: OpenRouter (${modelId})`);
  return createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
  })(modelId);
}

// Helpers
function createClaude(apiKey: string) {
  console.log('Selected: Claude 3.5 Sonnet');
  return createAnthropic({ apiKey })('claude-3-5-sonnet-20240620');
}

function createGPT(apiKey: string) {
  console.log('Selected: GPT-4o');
  return createOpenAI({ apiKey })('gpt-4o');
}

function createGemini(apiKey: string) {
  console.log('Selected: Gemini 2.5 Pro');
  const google = createGoogleGenerativeAI({ apiKey });
  try { return google('gemini-2.5-pro'); } catch { return google('gemini-1.5-pro'); }
}
