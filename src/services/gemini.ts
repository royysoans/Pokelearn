import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateQuestions = async (topic: string, count: number = 5) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate ${count} multiple-choice questions about "${topic}". 
    Format the output as a JSON array of objects, where each object has:
    - "question": The question text
    - "options": An array of 4 possible answers
    - "correctAnswer": The correct answer (must be one of the options)
    
    Ensure the questions are challenging but fair. Return ONLY the JSON array, no markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating questions:", error);
        // Fallback to mock questions so the game is playable
        return [
            {
                question: `(Mock) Which Pokemon is known as the Mouse Pokemon?`,
                options: ["Pikachu", "Rattata", "Sandshrew", "Raichu"],
                correctAnswer: "Pikachu"
            },
            {
                question: `(Mock) What type is Charmander?`,
                options: ["Water", "Grass", "Fire", "Electric"],
                correctAnswer: "Fire"
            },
            {
                question: `(Mock) Who is the gym leader of Pewter City?`,
                options: ["Misty", "Brock", "Lt. Surge", "Erika"],
                correctAnswer: "Brock"
            },
            {
                question: `(Mock) Which of these is NOT a starter Pokemon?`,
                options: ["Bulbasaur", "Squirtle", "Charmander", "Pidgey"],
                correctAnswer: "Pidgey"
            },
            {
                question: `(Mock) How many evolutions does Eevee have in Gen 1?`,
                options: ["3", "8", "1", "5"],
                correctAnswer: "3"
            }
        ];
    }
};
