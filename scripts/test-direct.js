// Simple direct test of the knowledge base
const { knowledgeBase } = require('../src/services/knowledgeBase');

console.log('🧪 Testing Knowledge Base - Direct Test');
console.log('─'.repeat(60));

async function runTest() {
  const testQueries = [
    'What are the library hours?',
    'When is the computer lab open?',
    'Where can I eat on campus?',
    'How do I apply for financial aid?',
    'When is the next career fair?',
    'Goodbye!'
  ];

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
}

runTest().catch(console.error);
