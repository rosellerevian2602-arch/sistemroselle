import { GoogleGenAI, Chat, Type } from "@google/genai";
import { HOSPITAL_SYSTEM_PROMPT, RAW_PROMPT_TEMPLATE } from "../constants";
import { ERDModel } from "../types";

let chatSession: Chat | null = null;

export const initializeChat = (apiKey: string) => {
  const ai = new GoogleGenAI({ apiKey });
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: HOSPITAL_SYSTEM_PROMPT,
      temperature: 0.3, // Low temperature for factual consistency
    },
  });
};

export const sendMessageToAssistant = async (message: string, apiKey: string): Promise<string> => {
  if (!chatSession) {
    initializeChat(apiKey);
  }

  try {
    if (!chatSession) throw new Error("Chat session not initialized");
    
    const response = await chatSession.sendMessage({
      message: message
    });

    return response.text || "Maaf, saya tidak dapat memproses permintaan tersebut saat ini.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Reset session on error to be safe for next try
    chatSession = null;
    throw error;
  }
};

export const generateERD = async (moduleNames: string[]): Promise<ERDModel> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found in environment variables");

  const ai = new GoogleGenAI({ apiKey });
  
  const modulesList = moduleNames.map(m => `    *   ${m}`).join('\n');
  const prompt = RAW_PROMPT_TEMPLATE.replace('{{MODULES_LIST}}', modulesList);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                entities: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            attributes: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        dataType: { type: Type.STRING },
                                        isPrimaryKey: { type: Type.BOOLEAN },
                                        isForeignKey: { type: Type.BOOLEAN },
                                    },
                                    required: ["name", "dataType"]
                                }
                            }
                        },
                        required: ["name", "attributes"]
                    }
                },
                relationships: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            source: { type: Type.STRING },
                            target: { type: Type.STRING },
                            cardinality: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                        required: ["source", "target", "cardinality"]
                    }
                }
            },
            required: ["entities", "relationships"]
        }
    }
  });

  if (response.text) {
    try {
        return JSON.parse(response.text) as ERDModel;
    } catch (e) {
        console.error("Failed to parse JSON", e);
        throw new Error("Invalid JSON response from model");
    }
  }
  throw new Error("No response from model");
};