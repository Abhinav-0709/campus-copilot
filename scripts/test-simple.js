// Simple test script that doesn't require external services
const knowledgeBase = require('../dist/services/knowledgeBase.js').default;

console.log('🧪 Testing Knowledge Base - Basic Functionality');
console.log('─'.repeat(60));

const testQueries = [
  'What are the library hours?',
  'When is the computer lab open?',
  'Where can I eat on campus?',
  'How do I apply for financial aid?',
  'When is the next career fair?',
  'Goodbye!'
];

async function runTests() {
  console.log('✅ Knowledge base initialized');
  
  for (const query of testQueries) {
    console.log('\n🔍 Query:', query);
    console.log('─'.repeat(60));
    
    try {
      const start = Date.now();
      const response = await knowledgeBase.query(query);
      const time = Date.now() - start;
      
      console.log(`\n💡 Response (${time}ms):`);
      console.log(response);
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }
  
  console.log('\n✨ Test completed!');
}

runTests().catch(console.error);
