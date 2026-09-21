import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const { message, history, context } = await req.json();
    
    // Create the system instruction for the Agronomist AI
    const systemPrompt = `You are KrishiRakshak AI, an expert agricultural doctor and agronomist.
You must answer questions strictly related to farming, crop diseases, pests, weather impacts, and agronomy.
If the user asks about anything unrelated to agriculture, politely decline and redirect them to farming topics.
You can understand and respond in any language the user speaks (e.g., if they ask in Hindi or Marathi, reply in the same language).

Current Farmer Context:
- Location: ${context.location}
- Crop & Stage: ${context.crop}
- Weather: ${context.weather}
- Recent Scan: ${context.recentScan}

Always keep your responses highly actionable, concise, and structured. Use Markdown for bolding important chemicals or steps. Do not use generic pleasantries. Act as a critical intelligence system.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.6-flash", 
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    // Format history for Gemini API, filtering out any empty or error messages
    const validHistory = history.filter((msg: any) => msg.content && !msg.content.includes('error occurred'));
    
    // Gemini API strictly requires alternating user/model roles.
    const strictHistory: {role: string, parts: {text: string}[]}[] = [];
    validHistory.forEach((msg: any) => {
      const role = msg.role === 'user' ? 'user' : 'model';
      if (strictHistory.length === 0 && role === 'model') return; // History must start with user
      if (strictHistory.length > 0 && strictHistory[strictHistory.length - 1].role === role) {
        // Append to previous if same role
        strictHistory[strictHistory.length - 1].parts[0].text += '\n' + msg.content;
      } else {
        strictHistory.push({ role, parts: [{ text: msg.content }] });
      }
    });
    
    // If the last message in history is a model, wait, if it's user, Gemini expects the next message (which is passed in sendMessageStream) to be from user.
    // Actually, `chat.sendMessage` assumes the new message is from 'user'. So history MUST end with 'model'.
    if (strictHistory.length > 0 && strictHistory[strictHistory.length - 1].role === 'user') {
      strictHistory.pop(); // Remove the trailing user message so it ends with model
    }

    const formattedHistory = strictHistory;

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessageStream(message);

    // Return a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
