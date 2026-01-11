import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set securely

let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const getAIRecommendation = async (userQuery: string): Promise<string> => {
    if (!ai) {
        return "I'm sorry, my styling brain (API Key) is currently offline. Please try again later or contact the admin.";
    }

    try {
        const model = 'gemini-3-flash-preview';
        const systemInstruction = `You are a sophisticated and helpful Virtual Stylist for "Luxe Saree & Parlor". 
        Your goal is to recommend Sarees or Parlor services based on the user's request. 
        Keep your tone elegant, warm, and professional. 
        If the user asks about Sarees, suggest types like Banarasi, Kanjivaram, Chiffon based on occasion.
        If the user asks about beauty, suggest Facials, Makeup, or Hair Spas.
        Keep the response concise (under 100 words).`;

        const response = await ai.models.generateContent({
            model,
            contents: userQuery,
            config: {
                systemInstruction,
                temperature: 0.7,
            }
        });

        return response.text || "I couldn't generate a recommendation at this moment.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting to the styling server right now.";
    }
};