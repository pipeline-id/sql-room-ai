import { AiSettingsSliceConfig } from "@sqlrooms/ai";

// Constants for commonly used values
export const OLLAMA_DEFAULT_BASE_URL = "http://localhost:11434/v1";

// Default base URLs for each provider
export const PROVIDER_DEFAULT_BASE_URLS = {
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  groq: "https://api.groq.com/openai/v1",
  // google: 'https://generativelanguage.googleapis.com/v1beta',
  // deepseek: 'https://api.deepseek.com/v1',
  // ollama: OLLAMA_DEFAULT_BASE_URL,
} as const;

export const LLM_MODELS = [
  {
    name: "openai",
    models: ["gpt-4.1-mini", "gpt-4.1-nano", "gpt-4.1", "gpt-4o", "gpt-4o-mini", "gpt-4", "gpt-5"],
  },
  {
    name: "anthropic",
    models: ["claude-3-5-sonnet", "claude-3-5-haiku"],
  },
  {
    name: "groq",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"],
  },
  // {
  //   name: 'google',
  //   models: [
  //     'gemini-2.0-pro-exp-02-05',
  //     'gemini-2.0-flash',
  //     'gemini-2.0-flash-lite',
  //     'gemini-1.5-pro',
  //     'gemini-1.5-flash',
  //   ],
  // },
  // {
  //   name: 'deepseek',
  //   models: ['deepseek-chat'],
  // },
  // {
  //   name: 'ollama',
  //   models: ['qwen3:32b', 'gpt-oss'],
  // },
];

export type ApiKeys = {
  openai?: string;
  anthropic?: string;
  groq?: string;
};

export const createAiSettings = (apiKeys: ApiKeys = {}) => ({
  providers: LLM_MODELS.reduce((acc: Record<string, any>, provider) => {
    acc[provider.name] = {
      baseUrl: PROVIDER_DEFAULT_BASE_URLS[provider.name as keyof typeof PROVIDER_DEFAULT_BASE_URLS],
      apiKey: apiKeys[provider.name as keyof ApiKeys] || "",
      models: provider.models.map((model) => ({
        id: model,
        modelName: model,
      })),
    };
    return acc;
  }, {}),
}) satisfies Pick<AiSettingsSliceConfig, "providers">;

// Default export for backward compatibility
export const AI_SETTINGS = createAiSettings();
