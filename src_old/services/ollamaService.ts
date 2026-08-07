interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export class OllamaService {
  private readonly baseUrl: string;
  private readonly model: string;
  private isConfigured: boolean;

  constructor() {
    // Get configuration from environment variables with fallbacks
    this.baseUrl = (import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/+$/, '');
    this.model = import.meta.env.VITE_OLLAMA_MODEL || 'llama3';
    this.isConfigured = false;
    
    // Log configuration for debugging
    console.log('Ollama Service Configuration:', {
      baseUrl: this.baseUrl,
      model: this.model,
      isClient: typeof window !== 'undefined'
    });
    
    this.checkConnection().catch(console.error);
  }
  
  private async checkConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      this.isConfigured = response.ok;
      console.log('Ollama connection check:', this.isConfigured ? 'Connected' : 'Failed');
    } catch (error) {
      this.isConfigured = false;
      console.error('Ollama connection error:', error);
    }
  }

  async generateResponse(
    prompt: string, 
    systemPrompt: string = 'You are a helpful AI assistant for a college campus.'
  ): Promise<string> {
    // Check if running on client-side
    if (typeof window !== 'undefined') {
      return "AI services are only available on the server-side. Please try again from a server environment.";
    }

    // Check if service is configured
    if (!this.isConfigured) {
      console.warn('Ollama service is not properly configured');
      return "The AI service is currently being configured. Please try again in a moment.";
    }

    try {
      console.log('Sending request to Ollama API with prompt:', prompt.substring(0, 100) + '...');
      
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Ollama API error (${response.status}): ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response.trim();
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      
      // More specific error messages based on error type
      if (error instanceof TypeError && error.message.includes('fetch failed')) {
        return "Unable to connect to the AI service. Please ensure the Ollama server is running and accessible.";
      }
      
      return "I'm having trouble connecting to the AI service. The service might be temporarily unavailable. Please try again later.";
    }
  }
}

// Create and export a singleton instance
const ollamaService = new OllamaService();

export { ollamaService };
export default ollamaService;
