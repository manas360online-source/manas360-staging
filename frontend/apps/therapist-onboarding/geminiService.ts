
import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Bio generation will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBio = async (data: {
  fullName: string;
  experience: string;
  specializations: string[];
  qualification: string;
  languages: string[];
}) => {
  try {
    const prompt = `Write a professional, empathetic, and engaging therapist bio for ${data.fullName}. 
    Details: 
    - Experience: ${data.experience}
    - Highest Qualification: ${data.qualification}
    - Key Specializations: ${data.specializations.join(", ")}
    - Languages: ${data.languages.join(", ")}
    
    The tone should be warm and professional. Focus on helping the patient feel heard and safe. Length: 150-200 words.`;

    const ai = getAiClient();
    if (!ai) return null;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini bio generation failed:", error);
    return null;
  }
};
