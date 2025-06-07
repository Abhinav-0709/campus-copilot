import { DocumentService } from './documentService';
import { LocalVectorStore, VectorDocument } from './vectorStore';

// Search result interface
export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  score: number;
}

// Knowledge base interface
export interface KnowledgeBaseEntry {
  id?: string;
  content?: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  keywords?: string[];
  response?: string;
  category?: string;
  source?: string;
}

/**
 * RAGKnowledgeBase - A knowledge base with Retrieval-Augmented Generation capabilities
 */
class RAGKnowledgeBase {
  // In-memory storage for knowledge base entries
  private entries: KnowledgeBaseEntry[] = [];
  private vectorStore: LocalVectorStore;
  private documentService: DocumentService;
  public readyPromise: Promise<void>;
  public isReady: boolean = false;

  constructor() {
    // Initialize required services first
    this.vectorStore = new LocalVectorStore(384); // 384 dimensions for common embedding models
    this.documentService = new DocumentService();
    
    try {
      // Initialize the ready promise
      this.readyPromise = this.initialize();
      this.readyPromise.then(() => {
        this.isReady = true;
        console.log('Knowledge base initialized successfully');
      }).catch(error => {
        console.error('Failed to initialize knowledge base:', error);
        this.isReady = false;
      });
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
      this.isReady = false;
      this.readyPromise = Promise.reject(error);
    }
  }

  public async initialize(): Promise<void> {
    try {
      console.log('Initializing knowledge base...');
      // Load any existing documents
      await this.vectorStore.loadIndex();
      console.log('Knowledge base initialized with local vector store');
      
      // Initialize default entries
      const defaultEntries: KnowledgeBaseEntry[] = [
        {
          keywords: ['library', 'library hours', 'when is the library open'],
          response: '🏛 **University Library**\n\n**Hours**\n• Monday-Thursday: 7:30 AM - 11:00 PM\n• Friday: 7:30 AM - 8:00 PM\n• Saturday: 10:00 AM - 6:00 PM\n• Sunday: 12:00 PM - 10:00 PM',
          category: 'facilities'
        },
        {
          keywords: ['computer lab', 'lab hours', 'when is the lab open'],
          response: '💻 **Computer Lab**\n\n**Hours**\n• Open 24/7 with student ID access\n• Location: Technology Building, Room 101',
          category: 'facilities'
        },
        {
          keywords: ['cafeteria', 'dining', 'food', 'where can I eat'],
          response: '🍽 **Campus Dining**\n\n**Main Cafeteria Hours**\n• Monday-Friday: 7:00 AM - 8:00 PM\n• Saturday-Sunday: 9:00 AM - 7:00 PM\n\n**Coffee Shop**\n• Monday-Friday: 7:30 AM - 6:00 PM\n• Saturday: 9:00 AM - 3:00 PM\n• Sunday: Closed',
          category: 'dining'
        },
        {
          keywords: ['academic calendar', 'when is spring break', 'when are finals'],
          response: '📅 **Academic Calendar**\n\n**Fall 2023**\n• Classes Start: August 28\n• Thanksgiving Break: November 22-26\n• Finals Week: December 11-15\n• Commencement: December 16\n\n**Spring 2024**\n• Classes Start: January 16\n• Spring Break: March 11-15\n• Finals Week: May 6-10\n• Commencement: May 11',
          category: 'academics'
        },
        {
          keywords: ['career', 'job', 'internship', 'resume', 'interview', 'hire'],
          response: '💼 **Career Development Center**\n\n**Services**\n• Resume & Cover Letter Reviews\n• Mock Interviews\n• Career Counseling\n• Job/Internship Postings\n\n**Hours**\n• Monday-Friday: 9:00 AM - 5:00 PM\n• Location: Student Services Building, Room 200\n\n🔗 career.techville.edu',
          category: 'career'
        },
        {
          keywords: ['health', 'health center', 'counseling', 'doctor'],
          response: '🏥 **Student Health & Wellness**\n\n**Health Center**\n• Location: Wellness Center, 1st Floor\n• Hours: Monday-Friday, 8:00 AM - 5:00 PM\n• Nurse Line: (555) 123-8000\n• Emergency: Dial 911\n\n**Counseling Services**\n• Confidential mental health support\n• Individual and group counseling\n• Crisis intervention available 24/7',
          category: 'health'
        },
        {
          keywords: ['parking', 'where can I park', 'parking permit'],
          response: '🚗 **Parking Information**\n\n**Student Parking**\n• Permits required 7 AM - 5 PM, Monday-Friday\n• Cost: $100/semester\n• Purchase at: parking.techville.edu\n\n**Visitor Parking**\n• Available in designated visitor lots\n• $2/hour or $10/day maximum\n• Pay at kiosks or via mobile app',
          category: 'transportation'
        },
        {
          keywords: ['transit', 'bus', 'shuttle', 'transportation'],
          response: '🚌 **Campus Transit**\n\n**Shuttle Service**\n• Runs 7:00 AM - 11:00 PM daily\n• 15-minute frequency during peak hours\n• Real-time tracking: shuttle.techville.edu\n\n**City Bus**\n• Free with student ID\n• Route maps at student services\n• Late Night Safe Ride: 10:00 PM - 3:00 AM',
          category: 'transportation'
        },
        {
          keywords: ['tutoring', 'help with classes', 'academic help'],
          response: '📚 **Academic Support**\n\n**Tutoring Center**\n• Location: Learning Commons, 2nd Floor\n• Hours: Monday-Thursday 9:00 AM - 7:00 PM, Friday 9:00 AM - 4:00 PM\n• Subjects: Math, Writing, Sciences, and more\n\n**Writing Center**\n• Help with papers and assignments\n• Drop-in or by appointment\n• writingcenter@techville.edu',
          category: 'academics'
        },
        {
          keywords: ['clubs', 'organizations', 'how to join', 'get involved'],
          response: '🎭 **Get Involved!**\n\n**Student Organizations**\n• 200+ student-run clubs and organizations\n• Academic, cultural, special interest, and more\n\n**How to Join**\n1. Visit the Student Activities Fair (first week of each semester)\n2. Check out orgsync.techville.edu\n3. Contact the organization directly\n\nNever a dull moment on campus!',
          category: 'campus-life'
        }
      ];
      
      this.addEntries(defaultEntries);
      
      // Document service is already initialized in its constructor
      
      console.log('Knowledge base initialization complete');
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
      throw error;
    }
  }

  /**
   * Add a document to the knowledge base
   * @param filePath Path to the document file
   * @param category Document category
   */
  public async addDocument(filePath: string): Promise<void> {
    if (!this.isReady || !this.documentService) {
      throw new Error('Knowledge base is not ready');
    }
    
    try {
      // Process the document using the document service and get the chunks
      const chunks = await this.documentService.processFile(filePath);
      
      // Add each chunk to the vector store
      for (const chunk of chunks) {
        const doc: VectorDocument = {
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: chunk.content,
          metadata: {
            ...chunk.metadata,
            source: filePath,
            chunkIndex: chunk.metadata.chunkIndex,
            totalChunks: chunk.metadata.totalChunks
          },
          embedding: chunk.embedding || []
        };
        await this.vectorStore.addDocument(doc);
      }
      
      console.log(`Successfully added document: ${filePath}`);
    } catch (error) {
      console.error(`Error adding document ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Query the knowledge base for a response
   * @param query User's question
   * @returns Response from the knowledge base
   */
  public async query(query: string): Promise<{ answer: string; sources: string[] }> {
    if (!this.isReady) {
      throw new Error('Knowledge base is not ready');
    }

    try {
      // First try to find a direct match in the knowledge base
      const searchResults = await this.search(query, 3);
      
      if (searchResults.length > 0) {
        // If we have search results, use the top result as the answer
        const sources = Array.from(
          new Set(
            searchResults
              .map(r => r.metadata?.source)
              .filter((source): source is string => Boolean(source))
          )
        );
        
        return {
          answer: searchResults[0].content,
          sources
        };
      }
      
      // If no direct match, try to find a related entry
      const relatedEntries = this.entries.filter(entry => 
        entry.keywords?.some(keyword => 
          keyword && typeof keyword === 'string' && query.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      if (relatedEntries.length > 0 && relatedEntries[0].response) {
        return {
          answer: relatedEntries[0].response,
          sources: []
        };
      }
      
      // If no match found, return a fallback response
      return this.getFallbackResponse();
    } catch (error) {
      console.error('Error querying knowledge base:', error);
      return this.getFallbackResponse();
    }
  }

  /**
   * Search for documents matching the query
   * @param query Search query
   * @param k Number of results to return
   * @returns Array of search results
   */
  /**
   * Search for documents matching the query
   * @param query Search query
   * @param k Number of results to return
   * @returns Array of search results
   */
  public async search(query: string, k: number = 5): Promise<SearchResult[]> {
    if (!this.isReady) {
      console.warn('Knowledge base is not ready');
      return [];
    }
    
    if (!this.documentService) {
      console.warn('Document service is not available');
      return [];
    }
    
    try {
      // Get the embedding for the query
      const queryEmbedding = await this.documentService.getEmbedding(query);
      
      if (!queryEmbedding || !Array.isArray(queryEmbedding)) {
        console.error('Invalid embedding received from document service');
        return [];
      }
      
      // Search the vector store
      const results = await this.vectorStore.search(queryEmbedding, k);
      
      // Ensure results match the SearchResult interface
      return results.map(result => ({
        id: result.id || `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: result.content || '',
        metadata: result.metadata || {},
        score: result.score || 0
      }));
    } catch (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }
  }

  /**
   * Get a fallback response when no specific answer is found
   * @returns A fallback response
   */
  /**
   * Get a fallback response when no specific answer is found
   * @returns A fallback response with answer and sources
   */
  private getFallbackResponse(): { answer: string; sources: string[] } {
    const fallbackResponses = [
      "I'm sorry, I don't have enough information to answer that question.",
      "I'm not sure about that. Could you provide more details?",
      "I don't have the answer to that question in my knowledge base.",
      "I'm still learning. I don't have information about that yet.",
      "That's a good question. I don't have that information at the moment."
    ];
    
    // Return a random fallback response
    return {
      answer: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      sources: []
    };
  }


  /**
   * Add entries to the knowledge base
   * @param entries Array of knowledge base entries to add
   */
  addEntries(entries: KnowledgeBaseEntry[]): void {
    this.entries.push(...entries);
  }
}

// Create and export a singleton instance of the knowledge base
export default new RAGKnowledgeBase();
