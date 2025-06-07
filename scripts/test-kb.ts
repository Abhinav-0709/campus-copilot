import knowledgeBase from '../src/services/knowledgeBase';

async function testKnowledgeBase() {
  console.log('🚀 Testing Knowledge Base Integration 🚀');
  console.log('------------------------------------');
  
  // The knowledge base is already initialized when imported
  const kb = knowledgeBase;
  
  // Small delay to ensure initialization completes
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('✅ Knowledge base initialized');
  
  // Test queries
  const testQueries = [
    'What are the library hours?',
    'How do I apply for financial aid?',
    'Tell me about the computer science department',
    'When is the next career fair?',
    'How do I contact IT support?'
  ];

  for (const query of testQueries) {
    console.log('\n🔍 Testing Query:', query);
    console.log('─'.repeat(process.stdout.columns || 50));
    
    const startTime = Date.now();
    try {
      const response = await kb.query(query);
      const elapsed = Date.now() - startTime;
      
      console.log(`\n✅ Response (${elapsed}ms):\n`);
      console.log(response);
      console.log('\n' + '─'.repeat(process.stdout.columns || 50));
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

testKnowledgeBase().catch(console.error);
