export interface VectorDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding: number[];
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  score: number;
}

type DistanceFunction = (a: number[], b: number[]) => number;

export class LocalVectorStore {
  private documents: VectorDocument[] = [];
  private dimensions: number;
  private distanceFn: DistanceFunction;

  constructor(dimensions: number = 384) {
    this.dimensions = dimensions;
    this.distanceFn = this.cosineDistance;
  }

  private cosineDistance(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return 1 - (dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)));
  }

  async initialize(): Promise<void> {
    // No initialization needed for in-memory store
  }

  async addDocuments(docs: VectorDocument[]): Promise<void> {
    this.documents.push(...docs);
  }

  async similaritySearch(
    query: number[],
    k: number = 4
  ): Promise<SearchResult[]> {
    const results = this.documents.map(doc => ({
      id: doc.id,
      content: doc.content,
      metadata: doc.metadata,
      score: this.distanceFn(query, doc.embedding)
    }));

    return results
      .sort((a, b) => a.score - b.score)
      .slice(0, k);
  }

  async search(embedding: number[], k: number = 4): Promise<SearchResult[]> {
    return this.similaritySearch(embedding, k);
  }

  async addDocument(doc: VectorDocument): Promise<void> {
    return this.addDocuments([doc]);
  }

  async deleteAll(): Promise<void> {
    this.documents = [];
  }

  async getDocumentCount(): Promise<number> {
    return this.documents.length;
  }

  // Add any other required methods here
  async saveIndex(): Promise<void> {
    // No-op for in-memory store
  }

  async loadIndex(): Promise<void> {
    // No-op for in-memory store
  }
}
