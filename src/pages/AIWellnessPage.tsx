
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealSuggestions } from "@/components/wellness/MealSuggestions";
import { WorkoutRecommendations } from "@/components/wellness/WorkoutRecommendations";
import { SleepOptimization } from "@/components/wellness/SleepOptimization";
import { Utensils, Activity, Moon, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AIWellnessPage = () => {
  const { user, isLoading } = useAuth();
  const [cyclePhase, setCyclePhase] = useState("follicular");
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(["balanced"]);
  const [fitnessLevel, setFitnessLevel] = useState("moderate");
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <AppLayout>
      <div className="py-8 bg-gradient-to-b from-herhealth-purple-light/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">AI-Powered Wellness</h1>
            <p className="text-gray-600">Personalized recommendations for your unique health journey</p>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Wellness Profile</CardTitle>
              <CardDescription>Customize recommendations for your current cycle phase and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Cycle Phase</label>
                  <Select value={cyclePhase} onValueChange={setCyclePhase}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menstrual">Menstrual Phase</SelectItem>
                      <SelectItem value="follicular">Follicular Phase</SelectItem>
                      <SelectItem value="ovulation">Ovulation Phase</SelectItem>
                      <SelectItem value="luteal">Luteal Phase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Dietary Preferences</label>
                  <Select value={dietaryPreferences[0]} onValueChange={(val) => setDietaryPreferences([val])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="glutenFree">Gluten Free</SelectItem>
                      <SelectItem value="lowCarb">Low Carb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Fitness Level</label>
                  <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                <Heart className="h-4 w-4 mr-1" />
                All Recommendations
              </TabsTrigger>
              <TabsTrigger value="meals">
                <Utensils className="h-4 w-4 mr-1" />
                Meal Suggestions
              </TabsTrigger>
              <TabsTrigger value="workouts">
                <Activity className="h-4 w-4 mr-1" />
                Workouts
              </TabsTrigger>
              <TabsTrigger value="sleep">
                <Moon className="h-4 w-4 mr-1" />
                Sleep Optimization
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-6">
                <MealSuggestions cyclePhase={cyclePhase} dietary={dietaryPreferences} />
                <WorkoutRecommendations cyclePhase={cyclePhase} fitnessLevel={fitnessLevel} />
                <SleepOptimization cyclePhase={cyclePhase} />
              </div>
            </TabsContent>
            
            <TabsContent value="meals">
              <MealSuggestions cyclePhase={cyclePhase} dietary={dietaryPreferences} />
            </TabsContent>
            
            <TabsContent value="workouts">
              <WorkoutRecommendations cyclePhase={cyclePhase} fitnessLevel={fitnessLevel} />
            </TabsContent>
            
            <TabsContent value="sleep">
              <SleepOptimization cyclePhase={cyclePhase} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default AIWellnessPage;
