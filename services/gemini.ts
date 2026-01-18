
import { GoogleGenAI } from "@google/genai";
import { Resolution, User } from "../types";

export const getAICoachAdvice = async (user: User, resolutions: Resolution[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const stats = resolutions.map(r => `${r.title} (${r.category}): Streak of ${r.streak} days, ${r.totalCompletions} total completions.`).join('\n');
  
  const prompt = `
    You are the "2026 Pixel Master", a wise retro-gaming inspired life coach.
    The year is 2026. 
    User: ${user.username} (Level ${user.level})
    Resolutions:
    ${stats || 'None yet.'}

    Provide a short, encouraging, and witty "Pixel Master" advice (max 80 words). 
    Use gaming metaphors like "level up", "boss fight", "HP", "Save Point", etc.
    Be specific about their progress if they have any resolutions.
    Keep the tone light and fun. Format as a dialogue from a classic RPG.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "Keep pushing, Hero! Your quest has just begun.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "The Pixel Master is resting. Keep grinding and check back later!";
  }
};

export const getAICoachAvatar = async (): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [{ text: 'A pixel art headshot of a wise, mystical retro-game wizard coach, simple 8-bit aesthetic, vibrant colors, solid black background, centered portrait.' }] 
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Error:", error);
    return null;
  }
};
