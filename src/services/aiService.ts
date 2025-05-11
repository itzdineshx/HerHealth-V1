import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { fetchCycleLogs, fetchSymptomLogs, fetchActivityLogs } from "./apiService";

export type AIInsight = {
  id: string;
  title: string;
  description: string;
  type: 'recommendation' | 'prediction' | 'insight';
  category: 'cycle' | 'nutrition' | 'activity' | 'sleep' | 'mental';
  confidence: number;
};

// This function now directly returns mock insights without trying to query a non-existent table
export const fetchPersonalizedInsights = async (userId: string): Promise<AIInsight[]> => {
  try {
    console.log("Fetching insights for user:", userId);
    
    // In a real implementation, we would query the AI insights table
    // Since that table doesn't exist in the current schema, we'll use mock data
    return generateMockInsights(userId);
  } catch (error) {
    console.error("Error in fetchPersonalizedInsights:", error);
    return generateMockInsights(userId);
  }
};

// Mock chat message function
export const sendChatMessage = async (userId: string, message: string): Promise<string> => {
  console.log("Sending chat message for user:", userId, message);
  
  try {
    // First try to send to backend AI service
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
    
    // Fallback with mock responses
    return generateMockResponse(message);
  } catch (error) {
    console.error("Error in sendChatMessage:", error);
    // Fall back to mock response
    return generateMockResponse(message);
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
    
    // Try to get from backend AI service first
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
