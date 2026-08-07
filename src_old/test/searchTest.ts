import {RAGKnowledgeBase} from '../services/knowledgeBase';
import { DocumentService } from '../services/documentService';

// Mock the DocumentService
jest.mock('../services/documentService');

describe('RAGKnowledgeBase searchDocuments', () => {
  let knowledgeBase: RAGKnowledgeBase;
  let mockDocumentService: jest.Mocked<DocumentService>;

  beforeEach(() => {
    // Create a new instance before each test
    knowledgeBase = new RAGKnowledgeBase();
    mockDocumentService = new DocumentService() as jest.Mocked<DocumentService>;
    knowledgeBase['documentService'] = mockDocumentService;
  });

  it('should transform search results correctly', async () => {
    // Mock the search method to return test data
    mockDocumentService.search.mockResolvedValue([
      { 
        content: 'Test content 1',
        metadata: { source: 'test1.txt' }
      },
      { 
        content: 'Test content 2',
        metadata: { source: 'test2.txt' }
      }
    ]);

    // Call the method we want to test
    const results = await knowledgeBase.searchDocuments('test query', 2);

    // Verify the results
    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({
      id: expect.any(String),
      content: 'Test content 1',
      metadata: { source: 'test1.txt' },
      score: expect.any(Number)
    });
    expect(results[1].score).toBeLessThan(results[0].score); // Second result should have lower score
  });

  it('should handle empty results', async () => {
    mockDocumentService.search.mockResolvedValue([]);
    const results = await knowledgeBase.searchDocuments('unknown query');
    expect(results).toEqual([]);
  });
});
