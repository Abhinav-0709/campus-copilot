import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { Ollama } from 'ollama';

export type LLMProvider = 'gemini' | 'groq' | 'ollama';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const getProvider = (): LLMProvider => {
  const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase() as LLMProvider;
  if (['gemini', 'groq', 'ollama'].includes(provider)) {
    return provider;
  }
  return 'gemini';
};

// ─── Gemini Setup ─────────────────────────────────────────────────────────────
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is missing');
  return new GoogleGenAI({ apiKey });
}

// ─── Groq Setup ───────────────────────────────────────────────────────────────
function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY environment variable is missing');
  return new Groq({ apiKey });
}

// ─── Ollama Setup ─────────────────────────────────────────────────────────────
function getOllamaClient() {
  const host = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  return new Ollama({ host });
}

// ─── Generate Chat Response ───────────────────────────────────────────────────
export async function generateChatResponse(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const provider = getProvider();

  try {
    if (provider === 'gemini') {
      const ai = getGeminiClient();
      const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: systemPrompt || 'You are Campus Copilot, a helpful AI assistant for college campus students and faculty.'
        }
      });

      return response.text || 'No response from Gemini.';
    }

    if (provider === 'groq') {
      const groq = getGroqClient();
      const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

      const formattedMessages = [
        {
          role: 'system' as const,
          content: systemPrompt || 'You are Campus Copilot, a helpful AI assistant for college campus students and faculty.'
        },
        ...messages.map(msg => ({
          role: msg.role === 'system' ? 'system' as const : msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
          content: msg.content
        }))
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: formattedMessages,
        model: modelName,
        temperature: 0.7,
        max_tokens: 1024,
      });

      return chatCompletion.choices[0]?.message?.content || 'No response from Groq.';
    }

    if (provider === 'ollama') {
      const ollama = getOllamaClient();
      const modelName = process.env.OLLAMA_MODEL || 'llama3.2';

      const formattedMessages = [
        {
          role: 'system' as const,
          content: systemPrompt || 'You are Campus Copilot, a helpful AI assistant for college campus students and faculty.'
        },
        ...messages.map(msg => ({
          role: msg.role === 'system' ? 'system' as const : msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
          content: msg.content
        }))
      ];

      const response = await ollama.chat({
        model: modelName,
        messages: formattedMessages
      });

      return response.message?.content || 'No response from Ollama.';
    }

    throw new Error(`Unsupported LLM provider: ${provider}`);
  } catch (error) {
    console.error(`[LLM Router Error] Provider: ${provider}`, error);
    throw error;
  }
}

// ─── Generate Embeddings ──────────────────────────────────────────────────────
export async function generateEmbeddings(text: string): Promise<number[]> {
  const provider = getProvider();

  try {
    if (provider === 'gemini') {
      const ai = getGeminiClient();
      const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';

      const response = await ai.models.embedContent({
        model: embeddingModel,
        contents: text,
      });

      return response.embeddings?.[0]?.values || [];
    }

    if (provider === 'ollama') {
      const ollama = getOllamaClient();
      const embeddingModel = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

      const response = await ollama.embed({
        model: embeddingModel,
        input: text,
      });

      return response.embeddings?.[0] || [];
    }

    // Default fallback embedding using Gemini if provider is groq (Groq doesn't natively host embeddings)
    const ai = getGeminiClient();
    const response = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: text,
    });

    return response.embeddings?.[0]?.values || [];
  } catch (error) {
    console.error(`[Embedding Error] Provider: ${provider}`, error);
    throw error;
  }
}
