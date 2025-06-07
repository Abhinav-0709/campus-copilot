// If running in Deno, ensure you have the correct Deno setup and types.
// If running in Node.js, use the 'serve' function from 'npm:std/http/server' or a similar package.
// import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { createServer } from 'http';

// Helper to mimic Deno's serve in Node.js
function serve(handler: (req: Request) => Promise<Response>) {
  const server = createServer(async (req, res) => {
    const url = `http://${req.headers.host}${req.url}`;
    const request = new Request(url, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? (req as any) : undefined,
    });
    const response = await handler(request);
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    const body = await response.arrayBuffer();
    res.end(Buffer.from(body));
  });
  server.listen(process.env.PORT || 3000);
}
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? ''
    );

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message, sessionId } = await req.json();

    // Get relevant knowledge base entries
    const { data: documents } = await supabase.rpc('match_documents', {
      query_embedding: (
        await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: message,
        })
      ).data[0].embedding,
      match_threshold: 0.78,
      match_count: 3,
    });

    // Prepare context from relevant documents
    const context = documents
      ? `Relevant information from the knowledge base:\n${documents
        .map((doc) => doc.content)
        .join('\n')}`
      : '';

    // Prepare conversation history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a helpful AI assistant for our college campus. Be friendly and professional.
          
          Here is some context about the topic:
          ${context}
          
          If you don't know something, admit it and suggest contacting the relevant department.`,
      },
      ...(history || []),
      { role: 'user', content: message },
    ];

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message?.content || 'Sorry, I could not generate a response.';

    // Save the conversation
    await supabase.from('chat_messages').insert([
      {
        session_id: sessionId,
        role: 'user',
        content: message,
      },
      {
        session_id: sessionId,
        role: 'assistant',
        content: aiResponse,
      },
    ]);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});