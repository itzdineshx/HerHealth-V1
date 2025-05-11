
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AiHealthAssistant } from "@/components/chat/AiHealthAssistant";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, MessageSquareHeart } from "lucide-react";

const AIHealthChatPage = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <AppLayout>
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gemini Health Assistant</h1>
            <p className="text-gray-600">Get personalized health information and advice powered by Google's Gemini AI</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AiHealthAssistant />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="bg-herhealth-pink-light/30 pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    About the Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-600">
                    Our Gemini-powered AI Health Assistant can answer questions about women's health, 
                    cycle tracking, wellness, and provide general health information.
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium flex items-center gap-1.5">
                        <Heart className="h-4 w-4 text-herhealth-pink-dark" />
                        Health Topics
                      </h4>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1 pl-5 list-disc">
                        <li>Menstrual cycle and tracking</li>
                        <li>Pregnancy and fertility</li>
                        <li>Menopause and perimenopause</li>
                        <li>General wellness and nutrition</li>
                        <li>Mental health and wellbeing</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h4 className="text-sm font-medium flex items-center gap-1.5">
                        <MessageSquareHeart className="h-4 w-4 text-herhealth-green-dark" />
                        Questions to Ask
                      </h4>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1 pl-5 list-disc">
                        <li>What causes menstrual cramps?</li>
                        <li>How can I track my fertility?</li>
                        <li>What are common symptoms of menopause?</li>
                        <li>How does my cycle affect my energy levels?</li>
                        <li>What foods support hormonal health?</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> This assistant provides general health information only. 
                      Always consult with healthcare professionals for medical advice.
                    </p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">Powered by Google's Gemini AI</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-herhealth-blue-light/30 pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Your Health Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-500 mb-3">
                    The AI assistant is personalized based on your health profile:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Life Stage:</span>
                      <span className="font-medium">{user.lifeStage}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Age:</span>
                      <span className="font-medium">
                        {calculateAge(user.dob)} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Data Sharing:</span>
                      <span className={`font-medium ${user.privacyPreferences.dataSharing ? 'text-green-600' : 'text-red-600'}`}>
                        {user.privacyPreferences.dataSharing ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Helper function to calculate age
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default AIHealthChatPage;
