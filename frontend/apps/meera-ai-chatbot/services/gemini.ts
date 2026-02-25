
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION, SUPPORTED_LANGUAGES } from "../constants";
import { AIResponse, Message } from "../types";

export const generateEmotionalSupportResponseStream = async (
  history: Message[],
  userInput: string,
  onTextUpdate: (text: string) => void,
  audioBase64?: string,
  preferredLanguageCode: string = 'en-IN'
): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === preferredLanguageCode) || SUPPORTED_LANGUAGES[0];

  // Use gemini-1.5-flash for maximum speed and reliability
  const modelName = 'gemini-1.5-flash';

  try {
    const chatHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const userParts: any[] = [{ text: userInput }];

    if (audioBase64) {
      userParts.push({
        inlineData: {
          mimeType: 'audio/webm',
          data: audioBase64
        }
      });
    }

    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: [
        ...chatHistory,
        { role: 'user', parts: userParts }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION +
          `\n\nLanguage Instruction: The user's preferred language is ${langInfo.name}. You MUST respond in ${langInfo.name}.` +
          (audioBase64 ? "\nNOTE: Audio of the user's voice is provided. Listen for emotional subtext, stress levels, and tone." : ""),
        responseMimeType: "application/json",
        // Set thinking budget to 0 for the fastest possible immediate response
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
            isCrisis: { type: Type.BOOLEAN },
            suggestedResources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  url: { type: Type.STRING }
                },
                required: ['title', 'type', 'url']
              }
            }
          },
          required: ['text', 'sentiment', 'isCrisis']
        }
      }
    });

    let fullText = "";
    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      const partText = c.text || "";
      fullText += partText;

      const textMatch = fullText.match(/"text":\s*"((?:[^"\\]|\\.)*)/);
      if (textMatch && textMatch[1]) {
        const preview = textMatch[1]
          .replace(/\\n/g, '\n')
          .replace(/\\"/g, '"')
          .replace(/\\t/g, '\t');
        onTextUpdate(preview);
      }
    }

    try {
      return JSON.parse(fullText) as AIResponse;
    } catch (e) {
      return {
        text: fullText.replace(/[{}"]/g, '').split('text:')[1]?.split(',')[0]?.trim() || "I'm here for you.",
        sentiment: 'neutral',
        isCrisis: false
      };
    }
  } catch (error) {
    console.error("AI API Error:", error);
    return {
      text: "I'm here for you. What's on your mind?",
      sentiment: 'neutral',
      isCrisis: false
    };
  }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return undefined;
  }
};
