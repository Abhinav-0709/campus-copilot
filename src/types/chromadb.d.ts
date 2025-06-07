declare module 'chromadb' {
  export class ChromaClient {
    constructor(config: { path: string });
    createCollection(name: string): Promise<Collection>;
    getCollection(name: string): Promise<Collection>;
  }

  export interface Collection {
    query(query: {
      queryTexts: string[];
      nResults?: number;
    }): Promise<{
      documents: string[][];
      distances: number[][];
      ids: string[][];
    }>;
    
    add(ids: string[], embeddings?: number[][], metadatas?: any[], documents?: string[]): Promise<void>;
  }
}

declare module 'ollama' {
  export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }

  export interface ChatResponse {
    message: {
      content: string;
      role: string;
    };
  }

  export class Ollama {
    constructor(config: { baseUrl: string });
    chat(params: {
      model: string;
      messages: Message[];
    }): Promise<ChatResponse>;
  }
}
