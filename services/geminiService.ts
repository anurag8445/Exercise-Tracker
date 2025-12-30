import { GoogleGenAI, Type } from "@google/genai";
import { Workout, FitnessGoal, FitnessLevel } from "../types";

export const analyzeWorkouts = async (workouts: Workout[]): Promise<any> => {
  // Always use process.env.API_KEY directly in the client initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const workoutSummary = workouts.slice(0, 10).map(w => 
    `${w.date}: ${w.name} (${w.type}, ${w.duration} mins, ${w.calories} cal, ${w.intensity} intensity)`
  ).join('\n');

  const prompt = `
    Analyze the following recent workouts and provide fitness coaching insights.
    Workouts:
    ${workoutSummary}
    
    If there are no workouts, give general advice on starting a fitness routine.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "Detailed analysis of workout trends" },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3 specific recommendations for next workouts"
            },
            encouragement: { type: Type.STRING, description: "A motivational closing statement" }
          },
          required: ["analysis", "recommendations", "encouragement"]
        }
      }
    });

    // Access the text property directly (not as a method)
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};

export const generateWorkoutPlan = async (goal: FitnessGoal, level: FitnessLevel, history: Workout[]): Promise<any> => {
  // Always use process.env.API_KEY directly in the client initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const historySummary = history.slice(0, 5).map(w => w.name).join(', ');

  const prompt = `
    Create a personalized 7-day workout plan for a user with the goal: "${goal}" and fitness level: "${level}".
    Recent activity: ${historySummary || 'No recent activity'}
    Provide a title and short description for each day, including a "Rest Day" where appropriate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goal: { type: Type.STRING },
            level: { type: Type.STRING },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING, description: "e.g., Monday" },
                  title: { type: Type.STRING, description: "Short workout title" },
                  description: { type: Type.STRING, description: "List of exercises or activity details" },
                  duration: { type: Type.NUMBER, description: "Minutes" },
                  type: { type: Type.STRING, description: "Strength, Cardio, HIIT, etc." }
                },
                required: ["day", "title", "description", "duration", "type"]
              }
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 nutrition or recovery tips for this plan"
            }
          },
          required: ["goal", "level", "schedule", "tips"]
        }
      }
    });

    // Access the text property directly (not as a method)
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Failed to generate plan:", error);
    throw error;
  }
};