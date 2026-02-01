import { generateText } from 'ai';
import { getSmartestModel, validateKeys, createOpenRouter, OPENROUTER_FREE_MODELS } from '@/lib/ai';
import { OPTIMIZER_SYSTEM_PROMPT } from '@/lib/prompts';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for input validation
const optimizeSchema = z.object({
  originalPrompt: z.string().min(1, "Prompt is required"),
  targetModel: z.string().min(1, "Target model is required"),
  additionalDetails: z.string().optional(),
  optimizerPreference: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate Input
    const { originalPrompt, targetModel, additionalDetails, optimizerPreference } = optimizeSchema.parse(body);

    // Get API Keys from Headers
    const anthropicKey = req.headers.get('x-anthropic-key') || undefined;
    const openaiKey = req.headers.get('x-openai-key') || undefined;
    const googleKey = req.headers.get('x-google-key') || undefined;
    const openrouterKey = req.headers.get('x-openrouter-key') || undefined;
    const freeModelPreference = req.headers.get('x-free-model-preference') || undefined;

    const selection = getSmartestModel({
      anthropic: anthropicKey,
      openai: openaiKey,
      google: googleKey,
      openrouter: openrouterKey,
      optimizerPreference,
      freeModelPreference
    });

    if (!selection) {
      return NextResponse.json(
        { error: 'No valid API keys found. Please check Settings.' },
        { status: 401 }
      );
    }

    let { model, provider } = selection;

    // Construct the User Prompt
    let userMessage = `TARGET MODEL: ${targetModel}\n\nORIGINAL PROMPT:\n${originalPrompt}`;
    if (additionalDetails) {
      userMessage += `\n\nADDITIONAL CONTEXT/DETAILS:\n${additionalDetails}`;
    }

    try {
      // Attempt 1
      const { text } = await generateText({
        model,
        system: OPTIMIZER_SYSTEM_PROMPT,
        prompt: userMessage,
      });
      return NextResponse.json({ result: text });

    } catch (error: any) {
      console.error("Optimization Error (Attempt 1):", error);

      // Retry logic ONLY for OpenRouter if it failed with a possibly transient error
      if (provider === 'openrouter' && openrouterKey) {
        console.log("Attempting OpenRouter fallback models...");

        // Try remaining free models in order
        const retryModels = OPENROUTER_FREE_MODELS.slice(1);

        for (const modelId of retryModels) {
          try {
            console.log(`Retrying with: ${modelId}`);
            const fallbackModel = createOpenRouter(openrouterKey, modelId);
            const { text } = await generateText({
              model: fallbackModel,
              system: OPTIMIZER_SYSTEM_PROMPT,
              prompt: userMessage,
            });
            return NextResponse.json({ result: text });
          } catch (retryError) {
            console.warn(`Fallback ${modelId} failed:`, retryError);
            continue; // Try next model
          }
        }

        return NextResponse.json(
          { error: "Free model unavailable (no active providers). Tried all alternatives. Pick another in Settings or use a paid key for reliability." },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: error.message || 'Failed to optimize prompt' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Critical Route Error:", error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
