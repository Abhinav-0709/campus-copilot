// src/scripts/simpleIngest.ts
import { promises as fs } from 'fs';
import path from 'path';
import { ChromaClient } from 'chromadb';
import { Ollama } from 'ollama';

// Configuration
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const CHROMA_URL = 'http://localhost:8000';
const OLLAMA_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3';

// Initialize clients
const chromaClient = new ChromaClient({ path: CHROMA_URL });
// @ts-ignore - The host property is valid but TypeScript types might be outdated
const ollama = new Ollama({ host: OLLAMA_URL });

// Simple text chunking
function chunkText(text: string, source: string) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end);
    
    chunks.push({
      content: chunk,
      metadata: { 
        source,
        start,
        end
      }
    });
    
    start = end - Math.min(CHUNK_OVERLAP, chunk.length);
  }
  
  return chunks;
}

// Main function to process a single file
async function processFile(filePath: string) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const source = path.basename(filePath);
    let content = await fs.readFile(filePath, 'utf-8');
    
    console.log(`Processing ${source}...`);
    
    // Simple processing based on file type
    if (ext === '.json') {
      const data = JSON.parse(content);
      content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    } else if (ext === '.csv') {
      // Simple CSV to text conversion
      content = content.split('\n')
        .map(line => line.split(',').join(' | '))
        .join('\n');
    }
    
    // Chunk and process
    const chunks = chunkText(content, source);
    console.log(`Created ${chunks.length} chunks from ${source}`);
    
    // Get or create collection with metadata
    const collectionName = 'documents';
    let collection;
    
    try {
      // Try to get the collection first
      collection = await chromaClient.getCollection(collectionName);
    } catch (error) {
      // If collection doesn't exist, create it
      collection = await chromaClient.createCollection(collectionName);
    }
    
    // Add to Chroma (in small batches)
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchIds = batch.map((_, idx) => `doc-${i+idx}`);
      const batchMetadatas = batch.map(chunk => chunk.metadata);
      const batchContents = batch.map(chunk => chunk.content);
      
      // Create simple embeddings (in a real app, you'd use a proper embedding model)
      const batchEmbeddings = batch.map(() => [
        Math.random(), Math.random(), Math.random()  // Simple random embeddings for demo
      ]);
      
      try {
        // ChromaDB Collection.add expects separate arguments, not an object
        await collection.add(
          batchIds,
          batchEmbeddings,
          batchMetadatas,
          batchContents
        );
        console.log(`Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`);
      } catch (error) {
        console.error('Error adding batch to collection:', error);
        throw error;
      }
    }
    
    console.log(`✅ Successfully processed ${source}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

// Main execution
async function main() {
  const filesToProcess = [
    path.join(process.cwd(), 'data', 'sample.json'),
    path.join(process.cwd(), 'data', 'faqs.csv')
  ];
  
  for (const file of filesToProcess) {
    await processFile(file);
  }
  
  console.log('🎉 All files processed!');
}

main().catch(console.error);