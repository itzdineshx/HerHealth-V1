
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMealSuggestions } from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export type MealSuggestion = {
  id: string;
  title: string;
  description: string;
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
  imageUrl: string;
  recipeUrl?: string;
  benefits: string[];
  cyclePhaseRecommendation?: string;
};

export const MealSuggestions = ({ cyclePhase = "general", dietary = [] }: { cyclePhase?: string; dietary?: string[] }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const meals = await generateMealSuggestions(user.id, cyclePhase, dietary);
        setSuggestions(meals);
      } catch (error) {
        console.error("Error fetching meal suggestions:", error);
        toast({
          title: "Unable to load meal suggestions",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user, cyclePhase, dietary, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meal Suggestions</CardTitle>
          <CardDescription>Personalized for your health needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-5/6 mb-3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-herhealth-purple-light/30">
        <CardTitle className="flex items-center">
          <Utensils className="mr-2 h-5 w-5" />
          Meal Suggestions
        </CardTitle>
        <CardDescription>
          {cyclePhase !== "general" 
            ? `Optimized for your ${cyclePhase} phase`
            : "Personalized for your health needs"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.length > 0 ? (
            suggestions.map((meal) => (
              <div key={meal.id} className="border rounded-md overflow-hidden hover:shadow-md transition-all">
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={meal.imageUrl} 
                    alt={meal.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1170&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium">
                    {meal.nutritionInfo.calories} cal
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium">{meal.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{meal.description}</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>P: {meal.nutritionInfo.protein}g</span>
                    <span>C: {meal.nutritionInfo.carbs}g</span>
                    <span>F: {meal.nutritionInfo.fat}g</span>
                  </div>
                  <Button 
                    onClick={() => {
                      if (meal.recipeUrl) {
                        window.open(meal.recipeUrl, '_blank');
                      } else {
                        toast({
                          title: "Recipe details",
                          description: `${meal.title} - Full recipe coming soon!`,
                        });
                      }
                    }}
                    className="w-full mt-3 text-xs h-8" 
                    variant="outline"
                  >
                    View Recipe
                    {meal.recipeUrl ? (
                      <ExternalLink className="ml-1 h-3 w-3" />
                    ) : (
                      <ArrowRight className="ml-1 h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <Utensils className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <h3 className="text-gray-500">No meal suggestions available</h3>
              <p className="text-sm text-gray-400">Please try again later</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
