import { ChromaClient } from 'chromadb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Create a directory for the ChromaDB data if it doesn't exist
const dbPath = path.resolve(process.cwd(), 'chroma_data');
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

async function testChroma() {
  try {
    console.log('Testing ChromaDB in serverless mode...');
    
    // Initialize ChromaDB in serverless mode
    const chromaClient = new ChromaClient({
      path: dbPath
    });
    
    console.log('ChromaDB client created successfully');
    
    // Test connection by listing collections
    const collections = await chromaClient.listCollections();
    console.log('Available collections:', collections);
    
    // Create a test collection
    const collection = await chromaClient.createCollection({
      name: 'test_collection',
      metadata: { description: 'Test collection' }
    });
    
    console.log('Test collection created successfully');
    
    // Add some test data
    await collection.add({
      ids: ['id1', 'id2'],
      documents: ['This is a test document', 'This is another test document'],
      metadatas: [{ source: 'test' }, { source: 'test' }]
    });
    
    console.log('Test data added successfully');
    
    // Query the collection
    const results = await collection.query({
      queryTexts: ['test'],
      nResults: 2
    });
    
    console.log('Query results:', results);
    
    console.log('✅ ChromaDB test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing ChromaDB:', error);
    process.exit(1);
  }
}

testChroma();
