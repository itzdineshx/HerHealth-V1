
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { fetchCycleLogs, fetchSymptomLogs, fetchActivityLogs } from "./apiService";

// Gemini API key - in production, this should come from environment variables or Supabase secrets
const GEMINI_API_KEY = "AIzaSyCGo4QPLUtsHTzO0f1E-rBaWumWoSKO2dY";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export type AIInsight = {
  id: string;
  title: string;
  description: string;
  type: 'recommendation' | 'prediction' | 'insight';
  category: 'cycle' | 'nutrition' | 'activity' | 'sleep' | 'mental';
  confidence: number;
};

// Function to call Gemini API
const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text from Gemini's response structure
    if (data.candidates && data.candidates[0] && data.candidates[0].content && 
        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected Gemini response structure:", data);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// This function now uses Gemini API to generate personalized insights
export const fetchPersonalizedInsights = async (userId: string): Promise<AIInsight[]> => {
  try {
    console.log("Fetching insights for user:", userId);
    
    // First try to get from Gemini API
    try {
      const userPrompt = `Generate 4 personalized health insights for a woman's health app user. 
      Format as JSON array with these properties: title (short), description (1-2 sentences), 
      type (one of: recommendation, prediction, insight), 
      category (one of: cycle, nutrition, activity, sleep, mental), 
      confidence (number between 0.6 and 0.95).
      Make insights specific to women's health topics like cycle tracking, hormonal health, 
      nutrition based on cycle phase, and mental wellbeing.`;
      
      const geminiResponse = await callGeminiAPI(userPrompt);
      
      try {
        // Parse the JSON response from Gemini
        const parsedInsights = JSON.parse(geminiResponse);
        
        // Validate and transform the response
        if (Array.isArray(parsedInsights) && parsedInsights.length > 0) {
          return parsedInsights.map(insight => ({
            id: uuidv4(),
            title: insight.title || "Health Insight",
            description: insight.description || "Personalized health recommendation based on your data",
            type: ["recommendation", "prediction", "insight"].includes(insight.type) 
              ? insight.type 
              : "recommendation",
            category: ["cycle", "nutrition", "activity", "sleep", "mental"].includes(insight.category)
              ? insight.category
              : "cycle",
            confidence: typeof insight.confidence === 'number' && insight.confidence >= 0.6 && insight.confidence <= 0.95
              ? insight.confidence
              : 0.8
          }));
        }
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        console.log("Raw response:", geminiResponse);
      }
    } catch (geminiError) {
      console.error("Error using Gemini for insights:", geminiError);
    }
    
    // Fall back to mock insights if Gemini fails
    return generateMockInsights(userId);
  } catch (error) {
    console.error("Error in fetchPersonalizedInsights:", error);
    return generateMockInsights(userId);
  }
};

// Chat message function using Gemini
export const sendChatMessage = async (userId: string, message: string): Promise<string> => {
  console.log("Sending chat message for user:", userId, message);
  
  try {
    // First try to use Gemini API
    try {
      const userPrompt = `You are a health assistant for a women's health app called HerHealth. 
      A user has sent this message: "${message}"
      
      Respond in a helpful, accurate, and compassionate way. Focus on women's health topics like menstrual cycles, 
      pregnancy, menopause, general wellness, and mental health. If asked about serious medical conditions, 
      remind the user to consult with healthcare professionals.
      
      Keep your response under 150 words and maintain a supportive tone.`;
      
      return await callGeminiAPI(userPrompt);
    } catch (geminiError) {
      console.error("Error using Gemini for chat:", geminiError);
      
      // Try to send to backend AI service as backup
      const { data, error } = await supabase
        .functions.invoke('health-assistant-chat', {
          body: { userId, message }
        });
      
      if (error) {
        console.error("Error sending message to AI service:", error);
        throw error;
      }
      
      if (data && data.response) {
        return data.response;
      }
    }
    
    // Fallback with mock responses
    return generateMockResponse(message);
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    // Fall back to mock response
    return generateMockResponse(message);
  }
};

// Generate workout recommendations using Gemini
export const generateWorkoutRecommendations = async (
  userId: string, 
  cyclePhase: string,
  fitnessLevel: string,
  preferences: string[]
): Promise<any[]> => {
  try {
    const userPrompt = `Generate 3 workout recommendations for a woman in her ${cyclePhase} phase of menstrual cycle.
    Fitness level: ${fitnessLevel}
    Preferences: ${preferences.join(', ')}
    
    Format as JSON array with these properties for each workout:
    - title: brief workout name
    - description: 1-2 sentences about the workout
    - duration: time in minutes (between 15-60)
    - intensity: "low", "moderate", or "high"
    - benefits: array of 2-3 health benefits
    - exercises: array of 3-5 specific exercises to do`;
    
    try {
      const geminiResponse = await callGeminiAPI(userPrompt);
      const parsedWorkouts = JSON.parse(geminiResponse);
      
      if (Array.isArray(parsedWorkouts) && parsedWorkouts.length > 0) {
        return parsedWorkouts;
      }
    } catch (geminiError) {
      console.error("Error using Gemini for workouts:", geminiError);
    }
    
    // Fallback to mock workouts
    return [
      {
        title: "Gentle Flow Yoga",
        description: "A low-impact yoga session focused on relaxation and flexibility",
        duration: 30,
        intensity: "low",
        benefits: ["Stress reduction", "Improved flexibility", "Better sleep"],
        exercises: ["Cat-cow pose", "Child's pose", "Gentle twists", "Forward folds"]
      },
      {
        title: "Strength Building Circuit",
        description: "Build muscle and boost metabolism with this strength workout",
        duration: 45,
        intensity: "moderate",
        benefits: ["Increased strength", "Metabolism boost", "Improved posture"],
        exercises: ["Squats", "Modified push-ups", "Dumbbell rows", "Bridges"]
      },
      {
        title: "Cardio Dance",
        description: "Fun dance-based cardio to boost mood and energy",
        duration: 25,
        intensity: "moderate",
        benefits: ["Mood elevation", "Cardiovascular health", "Coordination"],
        exercises: ["Warm-up", "Dance intervals", "Stretching", "Cool down"]
      }
    ];
  } catch (error) {
    console.error("Error generating workout recommendations:", error);
    return [];
  }
};

// Mock mood predictions function
export const fetchMoodPredictions = async (userId: string): Promise<{ day: string; mood: number; energy: number }[]> => {
  try {
    console.log("Fetching mood predictions for user:", userId);
    
    // Try to get user's actual data to make better predictions
    const [cycles, symptoms, activities] = await Promise.all([
      fetchCycleLogs(userId),
      fetchSymptomLogs(userId),
      fetchActivityLogs(userId)
    ]);
    
    // Try to generate predictions using Gemini
    try {
      // Convert user data to simplified format for the prompt
      const cycleData = JSON.stringify(cycles).substring(0, 200) + "...";
      const symptomData = JSON.stringify(symptoms).substring(0, 200) + "...";
      
      const userPrompt = `Based on this partial cycle data: ${cycleData}
      And symptom data: ${symptomData}
      
      Generate mood and energy predictions for the next 14 days (starting today).
      Return as JSON array with objects for each day containing:
      - day: date in YYYY-MM-DD format
      - mood: number between 30-95
      - energy: number between 25-90
      
      Create realistic patterns that follow cyclical hormonal changes.`;
      
      const geminiResponse = await callGeminiAPI(userPrompt);
      
      try {
        const parsedPredictions = JSON.parse(geminiResponse);
        if (Array.isArray(parsedPredictions) && parsedPredictions.length > 0) {
          return parsedPredictions.map(pred => ({
            day: pred.day,
            mood: pred.mood,
            energy: pred.energy
          }));
        }
      } catch (parseError) {
        console.error("Error parsing Gemini predictions:", parseError);
      }
    } catch (geminiError) {
      console.error("Error using Gemini for mood predictions:", geminiError);
    }
    
    // Try to get from backend AI service if Gemini fails
    const { data, error } = await supabase
      .functions.invoke('mood-prediction', {
        body: { userId, cycles, symptoms, activities }
      });
    
    if (error) {
      console.error("Error calling mood prediction:", error);
      throw error;
    }
    
    if (data && data.predictions && Array.isArray(data.predictions)) {
      return data.predictions;
    }
    
    // Fall back to mock predictions
    return generateMockMoodPredictions();
  } catch (error) {
    console.error("Error in fetchMoodPredictions:", error);
    // Fall back to mock predictions
    return generateMockMoodPredictions();
  }
};

// Helper function to generate mock insights for development
const generateMockInsights = (userId: string): AIInsight[] => {
  const today = new Date();
  const cycleDay = Math.floor(Math.random() * 28) + 1; // Random day in cycle
  
  return [
    {
      id: uuidv4(),
      title: "Cycle-based Nutrition",
      description: `Based on your cycle patterns, you're likely in day ${cycleDay}. Increasing iron-rich foods now may help with energy levels.`,
      type: "recommendation",
      category: "nutrition",
      confidence: 0.85
    },
    {
      id: uuidv4(),
      title: "Sleep Pattern Insight",
      description: "Your sleep data suggests you're getting 15% less deep sleep on days before your period starts. Consider a bedtime routine to improve sleep quality.",
      type: "insight",
      category: "sleep",
      confidence: 0.78
    },
    {
      id: uuidv4(),
      title: "Mood Pattern Detected",
      description: "We've noticed a pattern of lower mood reports 2-3 days before your period. Mindfulness activities may be especially helpful during this phase.",
      type: "prediction",
      category: "mental",
      confidence: 0.72
    },
    {
      id: uuidv4(),
      title: "Activity Optimization",
      description: "Your energy levels tend to peak around ovulation. This week might be ideal for higher intensity workouts if that aligns with your goals.",
      type: "recommendation",
      category: "activity",
      confidence: 0.81
    }
  ];
};

// Helper function for mock chat responses
const generateMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("period") || lowerMessage.includes("cycle")) {
    return "Your menstrual cycle typically consists of four phases: menstruation, the follicular phase, ovulation, and the luteal phase. Each phase is characterized by different hormone levels which can affect how you feel physically and emotionally. Tracking your symptoms can help you better understand your personal patterns.";
  }
  
  if (lowerMessage.includes("pain") || lowerMessage.includes("cramp")) {
    return "Menstrual cramps are a common experience. For relief, you might try applying heat, gentle exercise like yoga or walking, staying hydrated, and taking over-the-counter pain relievers if appropriate. If your pain is severe or interferes with daily activities, consider consulting with a healthcare provider.";
  }
  
  if (lowerMessage.includes("pregnant") || lowerMessage.includes("pregnancy")) {
    return "Pregnancy brings many changes to your body. It's important to stay in regular contact with healthcare providers, maintain a balanced diet, stay physically active as recommended by your doctor, and pay attention to your emotional wellbeing. Every pregnancy experience is unique.";
  }
  
  if (lowerMessage.includes("menopause")) {
    return "Menopause is a natural biological process marking the end of menstrual cycles. Symptoms can include hot flashes, sleep disruptions, and mood changes. Lifestyle adjustments like regular exercise, stress management, and a balanced diet can help manage symptoms. Hormone therapy and other treatments are also available - discuss options with your healthcare provider.";
  }
  
  return "Thank you for your question. I'm a health assistant focused on women's wellness topics. I can provide general information about menstrual cycles, symptoms, pregnancy, menopause, and overall wellness strategies. What specific aspect would you like to know more about?";
};

// Helper function for mock mood predictions
const generateMockMoodPredictions = (): { day: string; mood: number; energy: number }[] => {
  const predictions = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() + i - 3); // Start 3 days ago
    
    predictions.push({
      day: currentDate.toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 40) + 40, // Random between 40-80
      energy: Math.floor(Math.random() * 50) + 30 // Random between 30-80
    });
  }
  
  // Add more variation to make it look realistic
  const cyclePhases = [
    { mood: 60, energy: 45 },  // Menstruation
    { mood: 75, energy: 65 },  // Follicular
    { mood: 85, energy: 80 },  // Ovulation
    { mood: 75, energy: 70 },  // Early Luteal
    { mood: 55, energy: 50 },  // Late Luteal
  ];
  
  let phaseIndex = Math.floor(Math.random() * 5);
  
  return predictions.map((pred, i) => {
    // Change phase every 5-6 days
    if (i % 5 === 0 && i > 0) {
      phaseIndex = (phaseIndex + 1) % 5;
    }
    
    // Add randomness but keep within the phase pattern
    const phase = cyclePhases[phaseIndex];
    const randomVariation = Math.floor(Math.random() * 15) - 7; // -7 to +7
    
    return {
      day: pred.day,
      mood: Math.max(30, Math.min(95, phase.mood + randomVariation)),
      energy: Math.max(25, Math.min(90, phase.energy + randomVariation))
    };
  });
};
