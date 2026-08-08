import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, ChatMessage } from '@/lib/llm';
import { prisma } from '@/lib/prisma';
import { searchRelevantContext } from '@/lib/vectorStore';
import { checkRateLimit } from '@/lib/rate-limiter';
import { ChatRequestSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'ai_chat', { limit: 20, windowMs: 60 * 1000 });
    if (!rateCheck.isAllowed) return rateCheck.response!;

    const body = await req.json();
    const validation = ChatRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid chat request', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { messages, sessionId, studentId } = validation.data;

    const lastUserMsg = messages[messages.length - 1];
    // Sanitize user query string
    const userQuery = (lastUserMsg?.content || '').slice(0, 4000).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // RAG Semantic Vector Context Search
    let retrievedContextChunks: string[] = [];
    if (userQuery) {
      try {
        retrievedContextChunks = await searchRelevantContext(userQuery, 3);
      } catch (e) {
        console.warn('RAG Context retrieval note:', e);
      }
    }

    // Fetch contextual student data if studentId is provided
    let campusContext = '';
    if (studentId) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          profile: true,
          attendances: { include: { course: true } },
          enrollments: { include: { course: true } },
        },
      });

      if (student) {
        campusContext = `\nStudent Profile: ${student.profile.name} (Roll: ${student.rollNumber}, Semester: ${student.semester})\n`;
        if (student.attendances.length > 0) {
          campusContext += `Recent Attendance Summary: ${student.attendances.map(a => `${a.course.name}: ${a.status}`).join(', ')}\n`;
        }
      }
    }

    const ragContextText = retrievedContextChunks.length > 0
      ? `\nRelevant Knowledge Base Chunks:\n${retrievedContextChunks.join('\n---\n')}\n`
      : '';

    const systemPrompt = `You are Campus Copilot, an intelligent RAG AI assistant for university students and faculty.
Be helpful, friendly, and concise. Answer questions using the retrieved knowledge base chunks and student context below.
${campusContext}
${ragContextText}`;

    const formattedMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content.slice(0, 4000),
    }));

    const botReply = await generateChatResponse(formattedMessages, systemPrompt);

    // Persist message if sessionId is provided
    if (sessionId) {
      if (lastUserMsg && lastUserMsg.content) {
        await prisma.chatMessage.createMany({
          data: [
            { sessionId, role: 'user', content: userQuery },
            { sessionId, role: 'assistant', content: botReply },
          ],
        });
      }
    }

    return NextResponse.json({ response: botReply, ragChunksUsed: retrievedContextChunks.length });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'production' ? 'Failed to process chat message' : error?.message },
      { status: 500 }
    );
  }
}
