import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialization happens inside the POST route now

export const maxDuration = 60; // Allow up to 60s for Render cold starts

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body; // Base64 data URL

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert data URI back to raw base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // 1. OOD / NOVELTY GATEKEEPER (Gemini Vision)
    // We use Gemini strictly to detect if the user uploaded something stupid (like paper, cars, humans)
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        const prompt = `Analyze this image. Does it contain a close-up of a plant, crop, fruit, or leaf? Answer ONLY with "YES" or "NO".`;
        const result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ]);
        const answer = result.response.text().trim().toUpperCase();
        
        if (answer.includes("NO")) {
          console.log("Gatekeeper rejected the image as Not a Plant.");
          return NextResponse.json({ 
            predictions: [
              { 
                className: "Not a Plant - Image Rejected",
                probability: 1.0,
                heatmap: null,
                severity: "INVALID",
                severityScore: 0
              }
            ] 
          });
        }
      } catch (err) {
        console.error("Gemini Gatekeeper failed, falling back to Python API directly", err);
      }
    } else {
      console.log("GEMINI_API_KEY not found! Bypassing Gatekeeper.");
    }

    // 2. REAL INFERENCE (Local Python Backend)
    console.log("Calling Local Python FastAPI Backend...");
    
    // Call the newly refactored Python backend via the JSON endpoint
    const backendUrl = process.env.BACKEND_API_URL || 'https://modelofkrishirakshak.onrender.com';
    const pythonRes = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_bytes: base64Data,
        region: 'pune',
        stage: 'vegetative'
      })
    });
    
    if (!pythonRes.ok) {
        const errText = await pythonRes.text();
        console.error("Python API Error:", errText);
        return NextResponse.json({ error: "Backend validation failed", details: errText }, { status: pythonRes.status });
    }

    const pythonData = await pythonRes.json();
    
    // Return to UI
    return NextResponse.json({ 
      predictions: [
        { 
          className: `${pythonData.crop} - ${pythonData.diagnosis.disease}`,
          probability: pythonData.diagnosis.confidence_percent / 100,
          heatmap: pythonData.explainability?.heatmap || null,
          severity: pythonData.severity_info?.level || "unknown",
          severityScore: pythonData.severity_info?.score || 0
        }
      ] 
    });

  } catch (error: any) {
    console.error('Scan API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
