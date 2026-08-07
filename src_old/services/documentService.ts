import { ChromaClient } from 'chromadb';
import { Ollama } from 'ollama';
import dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// Load environment variables
dotenv.config();

interface DocumentChunk {
  content: string;
  metadata: {
    source: string;
    chunkIndex: number;
    totalChunks: number;
  };
  embedding?: number[];
  distance?: number;
}

// Helper function to read and process files
async function readAndProcessFile(filePath: string): Promise<{ content: string; source: string }> {
  const ext = path.extname(filePath).toLowerCase();
  const source = path.basename(filePath);
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    if (ext === '.json') {
      const jsonData = JSON.parse(fileContent);
      // Convert JSON to a readable text format
      const content = typeof jsonData === 'string' 
        ? jsonData 
        : JSON.stringify(jsonData, null, 2);
      return { content, source };
    } 
    
    if (ext === '.csv') {
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });
      // Convert CSV records to a readable format
      const content = records
        .map((record: Record<string, string>) => 
          Object.entries(record)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
        )
        .join('\n\n');
      return { content, source };
    }
    
    // For other file types, treat as plain text
    return { content: fileContent, source };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw new Error(`Failed to process file: ${(error as Error).message}`);
  }
}

export class DocumentService {
  private chromaClient: ChromaClient;
  private ollama: Ollama;
  private collection: any;
  private readonly chunkSize: number = 1000; // characters per chunk
  private readonly chunkOverlap: number = 200; // characters overlap between chunks

  constructor() {
    try {
      console.log('Initializing ChromaDB client with URL:', process.env.VITE_CHROMA_DB_URL || 'http://localhost:8000');
      this.chromaClient = new ChromaClient({
        path: process.env.VITE_CHROMA_DB_URL || 'http://localhost:8000',
      });

      console.log('Initializing Ollama with URL:', process.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434');
      this.ollama = new Ollama({
        baseUrl: process.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
      });

      // Don't initialize collection here, let it be done lazily
      this.collection = null;
    } catch (error) {
      console.error('Error initializing services:', error);
      throw error;
    }
  }

  private async initializeCollection() {
    try {
      // Try to get the collection, create it if it doesn't exist
      try {
        this.collection = await this.chromaClient.getCollection('document_chunks');
      } catch (error) {
        // Collection doesn't exist, create it with a simple configuration
        this.collection = await this.chromaClient.createCollection('document_chunks');
      }
      
      console.log('Successfully connected to ChromaDB collection');
    } catch (error) {
      console.error('Error initializing ChromaDB collection:', error);
      console.error('Make sure ChromaDB server is running at: http://localhost:8000');
      throw new Error('Failed to initialize document collection. ' + (error as Error).message);
    }
  }

  public async getEmbedding(text: string): Promise<number[]> {
    try {
      // Use the chat API to generate an embedding
      const response = await this.ollama.chat({
        model: import.meta.env.VITE_OLLAMA_MODEL || 'llama3',
        messages: [
          {
            role: 'system',
            content: 'Generate a dense vector representation of the following text. Return only the comma-separated numbers, nothing else.'
          },
          {
            role: 'user',
            content: text
          }
        ]
      });

      // Parse the response to extract the embedding
      const content = response.message?.content;
      if (!content) {
        throw new Error('No content in response');
      }

      // Try to parse the response as a comma-separated list of numbers
      try {
        return content.split(',').map(Number);
      } catch (parseError) {
        console.error('Failed to parse embedding from response:', content);
        throw new Error('Failed to parse embedding from response');
      }
    } catch (error) {
      console.error('Error generating embedding:', error);
      // Return a random embedding as fallback
      return Array(384).fill(0).map(() => Math.random());
    }
  }

  private splitTextIntoChunks(text: string, source: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let startIndex = 0;
    let chunkIndex = 0;

    while (startIndex < text.length) {
      let endIndex = startIndex + this.chunkSize;
      
      // Try to find a good breaking point (end of sentence or paragraph)
      if (endIndex < text.length) {
        const nextPeriod = text.indexOf('.', endIndex);
        const nextNewline = text.indexOf('\n', endIndex);
        
        if (nextNewline > 0 && (nextNewline - endIndex) < 100) {
          endIndex = nextNewline + 1;
        } else if (nextPeriod > 0 && (nextPeriod - endIndex) < 100) {
          endIndex = nextPeriod + 1;
        }
      } else {
        endIndex = text.length;
      }

      const chunk = text.substring(startIndex, endIndex).trim();
      if (chunk) {
        chunks.push({
          content: chunk,
          metadata: {
            source,
            chunkIndex: chunkIndex++,
            totalChunks: 0 // Will be updated later
          }
        });
      }

      startIndex = endIndex - Math.min(this.chunkOverlap, endIndex - startIndex);
    }

    // Update total chunks for each chunk
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length;
    });

    return chunks;
  }

  public async processFile(filePath: string): Promise<DocumentChunk[]> {
    try {
      const { content, source } = await readAndProcessFile(filePath);
      return await this.processText(content, source);
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
      throw error;
    }
  }

  public async processText(text: string, source: string): Promise<DocumentChunk[]> {
    try {
      const chunks = this.splitTextIntoChunks(text, source);
      
      // Initialize collection if not already done
      if (!this.collection) {
        await this.initializeCollection();
      }
      
      await this.ingestChunks(chunks);
      console.log(`Successfully processed and ingested text from ${source}`);
      return chunks;
    } catch (error) {
      console.error(`Error processing text from ${source}:`, error);
      throw error;
    }
  }

  private async ingestChunks(chunks: DocumentChunk[]): Promise<void> {
    if (!this.collection) {
      throw new Error('Collection not initialized');
    }

    try {
      // Generate embeddings for each chunk
      const embeddings = await Promise.all(
        chunks.map(chunk => this.getEmbedding(chunk.content))
      );

      // Prepare data for ingestion
      const ids = chunks.map((_, index) => `chunk_${Date.now()}_${index}`);
      const documents = chunks.map(chunk => chunk.content);
      const metadatas = chunks.map(chunk => chunk.metadata);

      // Add to ChromaDB
      await this.collection.add({
        ids,
        embeddings,
        metadatas,
        documents
      });

      console.log(`Successfully ingested ${chunks.length} chunks`);
    } catch (error) {
      console.error('Error ingesting chunks:', error);
      throw new Error(`Failed to ingest chunks: ${(error as Error).message}`);
    }
  }

  public async queryDocuments(query: string, nResults: number = 3): Promise<DocumentChunk[]> {
    if (!this.collection) {
      await this.initializeCollection();
    }

    try {
      // Get query embedding
      const queryEmbedding = await this.getEmbedding(query);
      
      // Query ChromaDB
      const results = await this.collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: nResults,
        include: ['documents', 'metadatas', 'distances']
      });

      // Map results to DocumentChunk format
      return results.ids[0].map((id: string, index: number) => ({
        content: results.documents[0][index],
        metadata: results.metadatas[0][index],
        distance: results.distances?.[0]?.[index]
      }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw new Error(`Failed to query documents: ${(error as Error).message}`);
    }
  }
}

// Create and export a singleton instance
const documentService = new DocumentService();
export default documentService;
