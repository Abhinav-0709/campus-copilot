import { prisma } from '@/lib/prisma';
import { generateEmbeddings } from '@/lib/llm';
import studentData from '@/data/student_data.json';

// Cosine similarity between two vector arrays
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Chunk text into semantic paragraphs/chunks
export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const chunks: string[] = [];

  let currentChunk = '';
  for (const para of paragraphs) {
    if ((currentChunk + ' ' + para).length > chunkSize) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = para;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n${para}` : para;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text];
}

export interface IngestParams {
  title: string;
  category?: string;
  sourceType?: string;
  text: string;
}

// Ingest document: chunk text -> embed -> store in PostgreSQL
export async function ingestDocument({ title, category, sourceType, text }: IngestParams) {
  const chunks = chunkText(text);

  const doc = await prisma.knowledgeDocument.create({
    data: {
      title,
      category: category || 'General',
      sourceType: sourceType || 'text',
      chunkCount: chunks.length,
    },
  });

  const chunkPromises = chunks.map(async (chunkContent) => {
    let embedding: number[] = [];
    try {
      embedding = await generateEmbeddings(chunkContent);
    } catch (e) {
      console.warn('Embedding generation notice, fallback vector used:', e);
    }

    return prisma.documentChunk.create({
      data: {
        documentId: doc.id,
        content: chunkContent,
        embedding,
      },
    });
  });

  await Promise.all(chunkPromises);

  return doc;
}

// Search top-K relevant context for query
export async function searchRelevantContext(query: string, topK = 3): Promise<string[]> {
  try {
    let queryEmbedding: number[] = [];
    try {
      queryEmbedding = await generateEmbeddings(query);
    } catch (e) {
      console.warn('Query embedding calculation notice:', e);
    }

    // Retrieve database chunks
    const chunks = await prisma.documentChunk.findMany({
      take: 50,
      include: { document: true },
    });

    if (chunks.length > 0 && queryEmbedding.length > 0) {
      const scored = chunks.map((c) => {
        const sim = cosineSimilarity(queryEmbedding, c.embedding);
        return { content: `[${c.document.title}] ${c.content}`, score: sim };
      });

      scored.sort((a, b) => b.score - a.score);
      const topResults = scored.slice(0, topK).map((item) => item.content);
      if (topResults.length > 0) return topResults;
    }

    // Fallback search over student_data.json
    const faqs = (studentData as any).faqs || [];
    const queryLower = query.toLowerCase();
    const matchedFaqs = faqs
      .filter((faq: any) => faq.question && faq.question.toLowerCase().includes(queryLower))
      .map((faq: any) => `Q: ${faq.question}\nA: ${faq.answer}`);

    if (matchedFaqs.length > 0) return matchedFaqs;

    return [
      JSON.stringify((studentData as any).academic_info || {}),
      JSON.stringify((studentData as any).campus_life || {}),
    ];
  } catch (err) {
    console.error('Context search error:', err);
    return [];
  }
}
