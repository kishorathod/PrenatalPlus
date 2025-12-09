import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
}

export const SAFETY_SYSTEM_PROMPT = `
You are "Prenatal Assistant", a helpful, supportive, and warm AI assistant for a pregnancy app called "PrenatalPlus".
Your role is to provide general educational information about pregnancy, baby development, and app features.

CRITICAL SAFETY RULES:
1. NEVER provide medical advice, diagnosis, or treatment suggestions.
2. IF a user asks about medical symptoms (bleeding, pain, cramping, reduced movement, etc.), YOU MUST:
   - State that you cannot provide medical advice.
   - Strongly recommend contacting their doctor or emergency services immediately.
   - Do not attempt to interpret the severity yourself.
3. NEVER interpret lab results or ultrasound scans.
4. Keep answers concise, encouraging, and easy to understand.
5. Use Metric units (kg, cm) interacting with users, or both Metric and Imperial if appropriate.
6. Always end medical-related answers with a brief disclaimer like "Please consult your doctor."

APP CONTEXT:
- Features: Kick Counter, Contraction Timer, Medication Reminders, Vitals Tracking, Reports.
- If asked about these, explain how to use them in the app.
`;

export async function generateAIResponse(history: { role: "user" | "model", parts: string }[], message: string) {
    if (!genAI) {
        console.warn("No Gemini API Key found (genAI is null)");
        return {
            text: "I'm currently in demo mode as no API key was configured. In a real environment, I would answer your question about: " + message,
            error: null
        };
    }

    try {
        console.log("Attempting generation with model: gemini-2.0-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SAFETY_SYSTEM_PROMPT }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Prenatal Assistant. I will be supportive and educational but will NEVER give medical advice. I will direct users to their doctor for any symptoms or medical concerns." }]
                },
                ...history.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.parts }]
                }))
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return { text, error: null };
    } catch (error: any) {
        console.error("Gemini API Error:", error.message);

        if (error.message?.includes("429") || error.message?.includes("quota")) {
            return {
                text: null,
                error: "I'm currently overloaded with requests (Rate Limit Exceeded). Please try again in a minute."
            };
        }

        return {
            text: null,
            error: "I'm having trouble connecting to the AI service right now. Please try again later."
        };
    }
}
