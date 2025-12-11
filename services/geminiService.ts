import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client strictly as per guidelines
const ai = new GoogleGenAI({ apiKey });

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

/**
 * Sends an image to Gemini to add a Christmas hat.
 * @param base64Image The original image in base64 format.
 * @param mimeType The mime type of the image.
 * @param aspectRatio The desired aspect ratio string (e.g., "16:9", "1:1").
 * @param color The desired color of the hat (default: "Red").
 * @returns The base64 string and mime type of the generated image.
 */
export const addChristmasHat = async (
  base64Image: string, 
  mimeType: string,
  aspectRatio: string = "1:1",
  color: string = "Red"
): Promise<GeneratedImage> => {
  try {
    // Ensure we strip the data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const model = 'gemini-2.5-flash-image';
    // Refined prompt:
    // 1. Detect faces/characters.
    // 2. Add hats matching style/lighting.
    // 3. Handle pose/perspective.
    // 4. STRONG constraint on preserving identity and background.
    // 5. Use the specific color requested.
    const prompt = `Detect all faces and characters in the image. Add a festive ${color} and white Christmas hat to each of them. The hats must strictly follow the artistic style (e.g., photorealistic, oil painting, cartoon, sketch) and lighting of the original image. Adjust the angle, size, and perspective of the hats to match the head pose of each subject naturally, including side profiles and tilted heads. Ensure the hats look like they are physically sitting on the heads. CRITICAL: Do not change the facial features, identity of the persons, or the background environment. Only add the hats.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any, // Cast to any to satisfy strict string literal types if needed
        }
      }
    });

    // Parse response for image
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png'
          };
        }
      }
    }

    throw new Error("No image data returned from the model. It might have refused the request due to safety filters or failed to generate.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};