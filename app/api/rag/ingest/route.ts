import { NextRequest, NextResponse } from 'next/server';
import { ingestDocument } from '@/lib/vectorStore';
import { checkRateLimit } from '@/lib/rate-limiter';
import { RAGIngestSchema } from '@/lib/validators';
import { logAuditEvent } from '@/lib/audit-logger';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'rag_ingest', { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const body = await req.json();
    const validation = RAGIngestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid RAG ingestion payload', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { title, content, category } = validation.data;

    const doc = await ingestDocument({
      title,
      text: content,
      category: category || 'general',
      sourceType: 'faculty_text',
    });

    await logAuditEvent({
      actorId: 'FacultyAdmin',
      action: 'INGEST_KNOWLEDGE_DOC',
      resource: 'KnowledgeDocument',
      resourceId: doc.id,
      metadata: { title, chunkCount: doc.chunkCount },
    });

    return NextResponse.json({
      success: true,
      docId: doc.id,
      chunksIngested: doc.chunkCount,
      message: `Successfully ingested document '${title}' with ${doc.chunkCount} chunks.`,
    });
  } catch (error: any) {
    console.error('RAG Ingestion Route Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Document ingestion failed' : error.message },
      { status: 500 }
    );
  }
}
