
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Task } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const professionalizeTask = async (description: string, persona: string = "Professional"): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: User is a ${persona}. 
      Task: "${description}". 
      Action: Rewrite this casual note into a high-performance professional objective. 
      Rules: No bold text. Max 10 words. Use industry-appropriate terminology.`,
    });
    return response.text?.replace(/\*\*/g, '').trim() || description;
  } catch {
    return description;
  }
};

export const classifyTask = async (
  description: string, 
  userCategories: string[],
  persona: string = "Professional"
): Promise<{ category: string; impact: number }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: User is a ${persona}. 
      Input: "${description}". 
      Selection: Choose the best-fitting project from this list: [${userCategories.join(", ")}]. 
      Impact: Estimate business impact 1-10.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            impact: { type: Type.NUMBER }
          },
          required: ["category", "impact"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      category: userCategories.includes(result.category) ? result.category : userCategories[0],
      impact: result.impact || 5
    };
  } catch {
    return { category: userCategories[0], impact: 5 };
  }
};

export const getWeeklyInsights = async (tasks: Task[]): Promise<string> => {
  if (tasks.length === 0) return "Initialize session to activate intelligence.";
  const ai = getAI();
  const summary = tasks.map(t => t.description).join(", ");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these tasks: ${summary}. Provide one extremely short strategic tip focused on communication or efficiency. Rules: No bold text. Max 15 words.`,
    });
    return response.text?.replace(/\*\*/g, '').trim() || "Clarity is the ultimate sophisticated productivity.";
  } catch {
    return "Focus on clear objectives today.";
  }
};

export const getMentorAdvice = async (message: string, history: any[]): Promise<string> => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are "Chronos Mentor". High-performance communication coach.\nRULES:\n1. NEVER USE BOLD (**).\n2. USE SHORT LINES ONLY.\n3. FOCUS ON COMMUNICATION SKILLS.\n4. BE ZEN AND DIRECT.\n5. MAX 3 LINES.'
    }
  });
  const response = await chat.sendMessage({ message });
  return (response.text || "Analyzing...").replace(/\*\*/g, '');
};

export const getMotivationalTrigger = async (task: Task): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `One short compliment for completing "${task.description}". No bold. Max 10 words.`,
    });
    return (response.text || "Excellent work.").replace(/\*\*/g, '').trim();
  } catch { return "Target achieved."; }
};
