// Test script using ES modules
import knowledgeBase from '../src/services/knowledgeBase.js';

console.log('🧪 Testing Knowledge Base - Basic Functionality');
console.log('─'.repeat(60));

const testQueries = [
  'What are the library hours?',
  'When is the computer lab open?',
  'Where can I eat on campus?',
  'How do I apply for financial aid?',
  'When is the next career fair?',
  'Goodbye!',
  'Hello!',
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

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

runTests().catch(console.error);
