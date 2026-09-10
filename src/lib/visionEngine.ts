// src/lib/visionEngine.ts
import * as tmImage from '@teachablemachine/image';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs'; // Required backend

const MODEL_URL = '/model/model.json';
const METADATA_URL = '/model/metadata.json';

let customModel: tmImage.CustomMobileNet | null = null;
let genericModel: mobilenet.MobileNet | null = null;

export async function initModel() {
  if (customModel) return customModel;
  if (genericModel) return genericModel;
  
  try {
    // 1. Try to load the user's custom crop model first
    customModel = await tmImage.load(MODEL_URL, METADATA_URL);
    console.log("Custom crop model loaded successfully.");
    return customModel;
  } catch (error) {
    // 2. Fallback to generic MobileNet for real-time demonstration if crop model is missing
    console.warn("Custom crop model not found in /public/model. Falling back to generic MobileNet.");
    try {
      genericModel = await mobilenet.load({ version: 2, alpha: 1.0 });
      console.log("Generic MobileNet loaded successfully.");
      return genericModel;
    } catch(e) {
      console.error("Failed to load fallback model:", e);
      return null;
    }
  }
}

export async function predictImage(imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement) {
  if (!customModel && !genericModel) {
    await initModel();
  }
  
  if (customModel) {
    const predictions = await customModel.predict(imageElement);
    predictions.sort((a, b) => b.probability - a.probability);
    return predictions;
  }
  
  if (genericModel) {
    // MobileNet returns { className: string, probability: number } array
    const predictions = await genericModel.classify(imageElement);
    return predictions;
  }
  
  return [{ className: "Error loading models", probability: 0 }];
}
