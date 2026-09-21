import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { disease } = await req.json();

    if (!disease) {
      return NextResponse.json({ error: 'No disease provided' }, { status: 400 });
    }

    // Fallback if no API key
    if (!process.env.GEMINI_API_KEY) {
       return NextResponse.json({ 
          prescription: `Apply appropriate targeted fungicide or pesticide for ${disease}. Ensure thorough coverage and monitor weather conditions to prevent further spread.`
       });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `You are an expert agronomist. 
The AI model has detected "${disease}" in the crop. 
Provide a very short, actionable prescription (max 3 sentences) for the farmer.
Include the specific chemical (pesticide/fungicide) name they should use, and one prevention tip.
Do not use markdown formatting (no bold/italics), just return plain text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return NextResponse.json({ prescription: text });

  } catch (error) {
    console.error('Prescription API Error:', error);
    return NextResponse.json({ 
      prescription: "Apply broad-spectrum fungicide and isolate infected plants immediately to prevent spread."
    });
  }
}
