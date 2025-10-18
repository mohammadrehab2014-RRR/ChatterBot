
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function dataUrlToGeminiPart(dataUrl: string): { inlineData: { mimeType: string, data: string } } {
  const [header, data] = dataUrl.split(';base64,');
  const mimeType = header.split(':')[1];
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}

export const runQuery = async (prompt: string, imageDataUrl: string | null): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  try {
    const parts: any[] = [{ text: prompt }];

    if (imageDataUrl) {
      parts.unshift(dataUrlToGeminiPart(imageDataUrl));
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred: ${error.message}. Please check your API key and network connection.`;
    }
    return "An unknown error occurred while contacting the AI.";
  }
};
