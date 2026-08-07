import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, ChatMessage } from '@/lib/llm';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, sessionId, studentId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
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

    const systemPrompt = `You are Campus Copilot, an AI assistant for university students and faculty.
Be helpful, friendly, and concise. Provide accurate info about campus life, courses, schedules, and academic status.
${campusContext}`;

    const formattedMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    const botReply = await generateChatResponse(formattedMessages, systemPrompt);

    // Persist message if sessionId is provided
    if (sessionId) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg && lastUserMsg.content) {
        await prisma.chatMessage.createMany({
          data: [
            { sessionId, role: 'user', content: lastUserMsg.content },
            { sessionId, role: 'assistant', content: botReply },
          ],
        });
      }
    }

    return NextResponse.json({ response: botReply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
