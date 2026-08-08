// Simple test script using ES modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the knowledge base
const knowledgeBaseModule = await import('../src/services/knowledgeBase.js');
const knowledgeBase = knowledgeBaseModule.default;

console.log('🧪 Testing Knowledge Base - Basic Functionality');
console.log('='.repeat(60));

const testQueries = [
  'What are the library hours?',
  'When is the computer lab open?',
  'Where can I eat on campus?',
  'How do I apply for financial aid?',
  'When is the next career fair?',
  'Hello!',
  'Goodbye!',
  'Thanks for your help!'
];

async function runTests() {
  console.log('✅ Knowledge base initialized\n');
  
  for (const query of testQueries) {
    console.log('🔍 Query:', query);
    console.log('─'.repeat(60));
    
    try {
      const start = Date.now();
      const response = await knowledgeBase.query(query);
      const time = Date.now() - start;
      
      console.log(`\n💡 Response (${time}ms):`);
      console.log(response);
      console.log('\n' + '─'.repeat(60));
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.log('\n' + '─'.repeat(60));
    }
  }
  
  console.log('\n✨ Test completed!');
}

// Run the tests
runTests().catch(console.error);
