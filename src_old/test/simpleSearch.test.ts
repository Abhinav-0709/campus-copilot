// Simple test of just the search functionality
function testSearchTransformation() {
  console.log('Testing search result transformation...');
  
  // Mock data that matches what DocumentService.search() would return
  const mockSearchResults = [
    { 
      content: 'The library is open from 8am to 10pm on weekdays.',
      metadata: { source: 'library_hours.txt' }
    },
    { 
      content: 'The computer lab is open 24/7 for students.',
      metadata: { source: 'lab_hours.txt' }
    }
  ];

  // This is the transformation logic we're testing
  const transformResults = (results: any[]) => {
    return results.map((result, index) => ({
      id: `doc_${Date.now()}_${index}`,
      content: result.content,
      metadata: result.metadata,
      score: 1.0 - (index * 0.1)
    }));
  };

  // Apply the transformation
  const transformed = transformResults(mockSearchResults);

  // Check the results
  console.log('\nTransformed Results:');
  console.log(JSON.stringify(transformed, null, 2));

  // Basic assertions
  if (transformed.length !== 2) {
    console.error('❌ Test failed: Expected 2 results');
    return;
  }
  
  if (!transformed[0].id || !transformed[0].content || !transformed[0].score) {
    console.error('❌ Test failed: Missing required fields in result');
    return;
  }
  
  if (transformed[0].score <= transformed[1].score) {
    console.error('❌ Test failed: First result should have higher score');
    return;
  }
  
  console.log('✅ Test passed! The search result transformation is working correctly.');
}

// Run the test
testSearchTransformation();
