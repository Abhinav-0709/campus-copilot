import { Ollama } from 'ollama';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class AIService {
  private ollama: Ollama;
  private model: string;
  private baseUrl: string;

  constructor() {
    this.model = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';
    this.baseUrl = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
    
    // Configure Ollama with the correct base URL
    const url = new URL(this.baseUrl);
    this.ollama = new Ollama({
      baseUrl: `${url.protocol}//${url.host}`
    });
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: systemPrompt || 'You are a helpful AI assistant for a college campus.'
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const response = await this.ollama.chat({
        model: this.model,
        messages: messages
      });

      return response.message?.content || 'No response from AI';
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}

export const aiService = new AIService();
export default aiService;
